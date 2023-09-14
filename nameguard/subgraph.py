import httpx

from nameguard.logging import logger
from nameguard.exceptions import ENSSubgraphUnavailable, NamehashNotFoundInSubgraph, NamehashMismatchError
from nameguard.utils import namehash_from_name


ENS_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

SUBGRAPH_NAME_QUERY = """
query getDomains($nameHash: String) {
  domain(id: $nameHash) {
    id
    labelhash
    name
    createdAt
    parent {
      id
    }
    resolver {
      texts
      address
    }
  }
}
"""  # redundant elements in query for future use


async def namehash_to_name_lookup(namehash_hexstr: str) -> str:
    logger.debug(f"Trying namehash lookup for: {namehash_hexstr}")

    variables = {'nameHash': namehash_hexstr}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                ENS_SUBGRAPH_URL + '?source=ens-nameguard',
                json={
                    'query': SUBGRAPH_NAME_QUERY,
                    'variables': variables,
                },
            )

        if response.status_code == 200:
            response_json = response.json()
            logger.debug(f"Subgraph response json:\n{response_json}")
        else:
            raise ENSSubgraphUnavailable(
                f"Received unexpected status code from ENS Subgraph {response.status_code}: {response.text}")
    except httpx.RequestError as ex:
        logger.exception(f'[namehash_to_name_lookup] communication error with subgraph occurred')
        if not str(ex):
            raise ENSSubgraphUnavailable(f"RequestError has occurred.")
        raise ENSSubgraphUnavailable(f"RequestError has occurred: {ex}")
    except Exception:
        logger.exception(f'[namehash_to_name_lookup] communication error with subgraph occurred')
        raise ENSSubgraphUnavailable(f"Unknown error occurred while making request")

    if 'data' not in response_json or 'domain' not in response_json['data']:
        logger.error(f"Unexpected response body: {response_json}")
        raise ENSSubgraphUnavailable(f"Unexpected response body: {response_json}")
    elif response_json['data']['domain'] is None:
        raise NamehashNotFoundInSubgraph()
    elif 'name' in response_json['data']['domain']:
        name = str(response_json['data']['domain']['name'])
        calculated_namehash = namehash_from_name(name)
        if calculated_namehash != namehash_hexstr:
            logger.error(
                f"NamehashMismatchError occurred:\ninput: {namehash_hexstr}\tcalculated: {calculated_namehash}")
            raise NamehashMismatchError()
        return name
    else:
        logger.error(f"Unexpected response body: {response_json}")
        raise ENSSubgraphUnavailable(f"Unexpected response body: {response_json}")


async def resolve_all_labelhashes_in_name(name: str) -> str:
    logger.debug(f"Trying to resolve full name: {name}")
    namehash = namehash_from_name(name)
    logger.debug(f"Namehash: {namehash}")
    return await namehash_to_name_lookup(namehash)

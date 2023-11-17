import os
import httpx

from nameguard.logging import logger
from nameguard.exceptions import ProviderUnavailable


async def get_nft_metadata(contract_address: str, token_id: str) -> dict:
    url = f"{os.environ.get('PROVIDER_URI_MAINNET')}/getNFTMetadata?contractAddress={contract_address}&tokenId={token_id}&refreshCache=false"
    headers = {"accept": "application/json"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=headers,
            )

        if response.status_code == 200:
            response_json = response.json()
            logger.debug(f"Provider response json:\n{response_json}")
            if 'error' in response_json and 'timed out' in response_json['error']:
                raise ProviderUnavailable(
                    f"Received retryable error from provider {response.status_code}: {response_json['error']}")
        else:
            raise ProviderUnavailable(
                f"Received unexpected status code from provider {response.status_code}: {response.text}")
    except Exception as ex:
        logger.exception(f'Communication error with provider occurred')
        if not str(ex):
            raise ProviderUnavailable(f"Communication error with provider occurred.")
        raise ProviderUnavailable(f"Communication error with provider occurred: {ex}")

    return response_json

import re
import httpx

from ens.constants import EMPTY_SHA3_BYTES
from ens.utils import Web3

from hexbytes import HexBytes



def normal_name_to_hash(name: str) -> str:
    def label_to_hash(label_: str) -> HexBytes:
        if "." in label_:
            raise ValueError(f"Cannot generate hash for label {label_!r} with a '.'")
        return Web3().keccak(text=label_)

    node = EMPTY_SHA3_BYTES
    if name:
        labels = name.split(".")
        for label in reversed(labels):
            labelhash = label_to_hash(label)
            assert isinstance(labelhash, bytes)  # todo: remove?
            assert isinstance(node, bytes)
            node = Web3().keccak(node + labelhash)
    return node.hex()


def hexbytes_to_int(hb: HexBytes) -> int:
    return int(hb.hex(), base=16)


def int_to_hexstr(n: int, hex_len=64) -> str:
    """
    Given an integer `n`, return a hex-string prefixed with '0x',
    padded with 0s to have exactly `hex_len` digits.

    :raises ValueError  if `n` in hex repr has more digits than `hex_len`
    """
    res = f"{n:#0{hex_len + 2}x}"
    if len(res) < hex_len + 2:
        raise ValueError(f'Resulting hex number has more digits ({len(res) - 2}) than specified {hex_len}.')
    return res


async def namehash_to_normal_name_lookup(namehash_str: str, network='mainnet') -> str:
    ens_subgraph_url = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens' + '?source=ens-nameguard'
    query = """
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

    variables = {'nameHash': namehash_str}

    async with httpx.AsyncClient() as client:
        response = await client.post(ens_subgraph_url, json={'query': query, 'variables': variables})
        response_json = response.json()

    match response_json:
        case {'data': {'domain': None}}:
            raise ValueError('NameHash Not Found In Subgraph')  # todo
        case {'data': {'domain': {'name': str(name)}}} if re.fullmatch(r'\[[0-9a-fA-F]{64}]\.\w*', name):
            raise ValueError('Unknown Label')  # todo
        case {'data': {'domain': {'name': str(_)}}}:
            normal_name = str(response_json['data']['domain']['name'])
        case _:
            raise ValueError('Unknown response')  # todo

#     # todo: The returned namehash should equal the namehash that we used in our lookup.
#     #  If it doesn’t, this should raise the NameHash Mismatch Error.

    return normal_name

# req:
# {
#     domain(id: "0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835") {
#       id
#       labelhash
#       name
#       createdAt
#       parent {
#         id
#       }
#       resolver {
#         texts
#         address
#       }
#     }
#   }

# res:
# {
#   "data": {
#     "domain": {
#       "id": "0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835",
#       "labelhash": "0xaf2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc",
#       "name": "vitalik.eth",
#       "createdAt": "1497775154",
#       "parent": {
#         "id": "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae"
#       },
#       "resolver": {
#         "texts": [
#           "url",
#           "avatar"
#         ],
#         "address": "0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41"
#       }
#     }
#   }
# }

# Here you will see that the returned name returns 1 or more labels in the format “[labelhash]”.
# Note how “[“ and “]” are not allowed in normalized labels. In this specific context, all labelhashes are always a hex value (without any 0x prefix) containing exactly 64 hex digits.
# Whenever the subgraph returns a label like this, it means that this label is “unknown”.

# For now, an unknown label should trigger a red NameGuard check result.
# It also means that no grapheme level analysis for such a label will be possible.
# This also means the “normalization” in the result should be “Unknown”.

#  Our logic can be more simple. Basically we just need to take the “name” value returned by the ENS Subgraph
#  and calculate namehash on that. The returned namehash should equal the namehash that we used in our lookup.
#  If it doesn’t, this should raise the NameHash Mismatch Error.

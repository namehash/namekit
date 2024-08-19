import re
from typing import Optional
from ens.utils import Web3
from hexbytes import HexBytes
from ens.constants import EMPTY_SHA3_BYTES

from nameguard.exceptions import InvalidNameHash, InvalidTokenID, InvalidEthereumAddress
from nameguard.models import Rating, GenericCheckResult, Check

MAX_INSPECTED_NAME_CHARACTERS = 200  # maximum number of characters to inspect in a name including labels and separators
MAX_INSPECTED_NAME_UNKNOWN_LABELS = 5  # each unknown label in a name is distinctly counted, even if there are multiple instances of the same unknown label in a name.
MAX_NUMBER_OF_NAMES_IN_BULK = 250  # maximum number of names to inspect in a single bulk inspection request


def compute_canonical_from_list(canonicals: list[Optional[str]], sep='') -> Optional[str]:
    """
    Compute a canonical string from a list of canonical strings.
    If any canonical `None`, the result is `None`.
    """
    if any(canonical is None for canonical in canonicals):
        return None
    return sep.join(canonicals)


LABELHASH_REGEX = re.compile(r'^\[[0-9a-f]{64}\]$')
LABELHASH_ETH_REGEX = re.compile(r'^\[[0-9a-f]{64}\]\.eth$')
LABELHASH_IN_NAME_REGEX = re.compile(r'(^|\.)\[[0-9a-f]{64}\]($|\.)')


def is_labelhash_eth(x: str) -> bool:
    return bool(LABELHASH_ETH_REGEX.match(x))


def label_is_labelhash(x: str) -> bool:
    return bool(LABELHASH_REGEX.match(x))


def labelhash_in_name(x: str) -> bool:
    return bool(LABELHASH_IN_NAME_REGEX.match(x))


def hexbytes_to_int(hb: HexBytes) -> int:
    return int(hb.hex(), base=16)


def int_to_hexstr(n: int, hex_len=64) -> str:
    """
    Given an integer `n`, return a hex-string prefixed with '0x',
    padded with 0s to have exactly `hex_len` digits.

    Parameters
    ----------
    n : int
    hex_len: int, optional
    Returns
    -------
    str
        `n` in hex-string format (padded with 0s to match 64 digits and prefixed with 0x).
    Raises
    ------
    ValueError
        If `n` in hex repr has more digits than `hex_len`.
    """
    res = f'{n:#0{hex_len + 2}x}'
    if len(res) > hex_len + 2:
        raise ValueError(f'Resulting hex number has more digits ({len(res) - 2}) than specified ({hex_len}).')
    return res


def labelhash_from_label(label: str) -> str:
    return Web3().keccak(text=label).hex()


def namehash_from_name(name: str) -> str:
    """
    Calculate the namehash of a name.
    Detects labelhashes in the name.
    """
    node = EMPTY_SHA3_BYTES
    if name:
        labels = name.split('.')
        for label in reversed(labels):
            if label_is_labelhash(label):
                labelhash = HexBytes(label[1:-1])
            else:
                labelhash = Web3().keccak(text=label)
            node = Web3().keccak(node + labelhash)
    return node.hex()


def namehash_from_labelhash(labelhash_hexstr: str, parent_name='eth') -> str:
    parent_namehash_hexstr = namehash_from_name(parent_name)
    node = Web3().keccak(HexBytes(parent_namehash_hexstr) + HexBytes(labelhash_hexstr))
    return node.hex()


def validate_token_id(token_id: str) -> str:
    """
    Validate token_id string and return normalized token_id.

    Parameters
    ----------
    token_id : str
        A string representing a token_id. It can be in
            a) decimal format - decimal integer of any length,
            b) hex format - hex digits prefixed with 0x.
    Returns
    -------
    str
        normalized input
    Raises
    ------
    InvalidTokenID
    """
    token_id = token_id.lower()
    if token_id.startswith('0x'):
        if not validate_hex(token_id, require_prefix=True, required_length=None):
            raise InvalidTokenID('Invalid hex number.')
        return token_id
    elif token_id.isdigit():
        return token_id
    else:
        raise InvalidTokenID('Must be a valid, decimal integer.')


def validate_namehash(namehash: str) -> str:
    """
    Validate namehash string and return namehash in hex-string format.

    Parameters
    ----------
    namehash : str
        A string representing a namehash. It can be in
            a) decimal format - decimal integer of any length,
            b) hex format - 64 hex digits prefixed with 0x.
    Returns
    -------
    str
        Namehash in hex-string format (padded with 0s to match 64 digits and prefixed with 0x).
    Raises
    ------
    InvalidNameHash
    """
    namehash = namehash.lower()
    if namehash.startswith('0x'):
        if not validate_hex(namehash, require_prefix=True, required_length=66):
            raise InvalidNameHash("Hex number must be 64 digits long and prefixed with '0x'.")
        return namehash
    else:
        try:
            int_namehash = int(namehash)
        except ValueError:
            raise InvalidNameHash(
                "Must be a valid, decimal integer or a hex number with 64 digits, prefixed with '0x'."
            )
        try:
            hex_namehash = int_to_hexstr(int_namehash)
        except ValueError:
            raise InvalidNameHash('The decimal integer converted to base-16 should have at most 64 digits.')
        return hex_namehash


def validate_ethereum_address(address: str) -> str:
    """
    Validate address string and return normalized address.

    Parameters
    ----------
    address : str
        A string representing a address. It must be in hex format - hex digits prefixed with 0x.
    Returns
    -------
    str
        normalized input
    Raises
    ------
    InvalidEthereumAddress
    """
    address = address.lower()
    if not validate_hex(address, require_prefix=True, required_length=42):
        raise InvalidEthereumAddress("Hex number must be 40 digits long and prefixed with '0x'.")
    return address


def validate_hex(hex: str, *, require_prefix: bool = True, required_length: int = None) -> bool:
    """
    Hex string must be lowercased.
    """
    if required_length is not None and len(hex) != required_length:
        return False
    if require_prefix:
        if not hex.startswith('0x'):
            return False
        return all(c in '0123456789abcdef' for c in hex[2:])
    else:
        return all(c in '0123456789abcdef' for c in hex)


def calculate_nameguard_rating(check_results: list[GenericCheckResult]) -> Rating:
    return max((check.rating for check in check_results), default=Rating.PASS)


def count_risks(check_results: list[GenericCheckResult]) -> int:
    return sum(1 for check in check_results if check.rating > Rating.PASS)


def agg_checks(check_results: list[GenericCheckResult]) -> list[GenericCheckResult]:
    out: dict[Check, GenericCheckResult] = {}
    for result in check_results:
        out[result.check] = max(out.get(result.check, result), result)
    return list(out.values())


def get_highest_risk(check_results: list[GenericCheckResult]) -> Optional[GenericCheckResult]:
    return max((check for check in check_results if check.rating > Rating.PASS), default=None)


def detect_grapheme_link_name(link: str) -> str:
    """
    Possible link formats:

    * https://unicodeplus.com/U+{...}
    * https://unicode.link/inspect/utf8:{...}
    * http://📙.la/{...}
    """

    if link.startswith('https://unicodeplus.com'):
        return 'UnicodePlus'
    elif link.startswith('https://unicode.link'):
        # title of th epage
        return 'Unicode Visualizer'
    elif link.startswith('http://📙.la'):
        return 'Emojipedia'
    else:
        return 'Unknown External Page'

import re
from typing import Optional
from ens.utils import Web3
from hexbytes import HexBytes
from ens.constants import EMPTY_SHA3_BYTES

from nameguard.exceptions import InvalidNameHash
from nameguard.models import Rating, GenericCheckResult, Check


def label_is_labelhash(x: str) -> bool:
    return bool(re.match(r'^\[[0-9a-f]{64}\]$', x))


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
    res = f"{n:#0{hex_len + 2}x}"
    if len(res) > hex_len + 2:
        raise ValueError(f'Resulting hex number has more digits ({len(res) - 2}) than specified ({hex_len}).')
    return res


def labelhash_from_label(label: str) -> str:
    return Web3().keccak(text=label).hex()


def namehash_from_name(name: str) -> str:
    '''
    Calculate the namehash of a name.
    Detects labelhashes in the name.
    '''
    node = EMPTY_SHA3_BYTES
    if name:
        labels = name.split(".")
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
    if namehash.startswith('0x'):
        if len(namehash) != 66 or not all(c in '0123456789abcdefABCDEF' for c in namehash[2:]):
            raise InvalidNameHash("Hex number must be 64 digits long and prefixed with '0x'.")
        return namehash
    else:
        try:
            int_namehash = int(namehash)
        except ValueError:
            raise InvalidNameHash("Must be a valid, decimal integer or a hex number with 64 digits, prefixed with '0x'.")
        try:
            hex_namehash = int_to_hexstr(int_namehash)
        except ValueError:
            raise InvalidNameHash("The decimal integer converted to base-16 should have at most 64 digits.")
        return hex_namehash


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

from ens.constants import EMPTY_SHA3_BYTES
from ens.utils import Web3

from hexbytes import HexBytes


def label_to_hash(label: str) -> HexBytes:
    if "." in label:
        raise ValueError(f"Cannot generate hash for label {label!r} with a '.'")
    return Web3().keccak(text=label)


def normal_name_to_hash(name: str) -> str:
    node = EMPTY_SHA3_BYTES
    if name:
        labels = name.split(".")
        for label in reversed(labels):
            labelhash = label_to_hash(label)
            assert isinstance(labelhash, bytes)  # todo: remove?
            assert isinstance(node, bytes)
            node = Web3().keccak(node + labelhash)
    return node.hex()

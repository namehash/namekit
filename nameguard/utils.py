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

def int_to_hexstr(n: int, padding=64) -> str:
    res = f"{n:#0{padding}x}"
    assert len(res) == 64
    return res

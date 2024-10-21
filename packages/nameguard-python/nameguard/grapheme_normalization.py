from ens_normalize.normalization import NORMALIZATION
from ens_normalize import is_ens_normalized


def grapheme_is_normalized(conf: str) -> bool:
    if len(conf) == 1 and ord(conf) in NORMALIZATION.valid:
        return True
    return is_ens_normalized(conf)

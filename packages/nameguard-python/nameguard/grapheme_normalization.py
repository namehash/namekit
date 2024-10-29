from ens_normalize.normalization import NORMALIZATION
from ens_normalize import is_ens_normalized


def grapheme_is_normalized(g: str) -> bool:
    # optimization for single codepoint graphemes
    if len(g) == 1 and ord(g) in NORMALIZATION.valid:
        return True
    return is_ens_normalized(g)

# The MIT License (MIT)
#
# Copyright (c) 2016 The Ethereum Foundation
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# import json
from functools import wraps
from typing import Optional, Union, Tuple, cast

from ens.constants import ENS_EXTENDED_RESOLVER_INTERFACE_ID, EMPTY_SHA3_BYTES
from ens.ens import _resolver_supports_interface, ENS
from ens.exceptions import ENSValidationError
from ens.utils import address_to_reverse_domain, is_empty_name, is_none_or_zero_address, Web3

# from ens.utils import normalize_name
from eth_typing import ChecksumAddress
from eth_utils import to_checksum_address, is_address, to_bytes
from hexbytes import HexBytes
from web3.contract import Contract


def label_to_hash(label: str) -> HexBytes:
    # label = normalize_name(label)
    if '.' in label:
        raise ValueError(f"Cannot generate hash for label {label!r} with a '.'")
    return Web3().keccak(text=label)


def normal_name_to_hash(name: str) -> HexBytes:
    """
    This method will not normalize the name. 'normal' name here means the name
    should already be normalized before calling this method.

    :param name:            the name to hash - should already be normalized
    :return: namehash       the hash of the name
    :rtype: HexBytes
    """
    node = EMPTY_SHA3_BYTES
    if not is_empty_name(name):
        labels = name.split('.')
        for label in reversed(labels):
            labelhash = label_to_hash(label)
            assert isinstance(labelhash, bytes)
            assert isinstance(node, bytes)
            node = Web3().keccak(node + labelhash)
    return node


def raw_name_to_hash(name: str) -> HexBytes:
    """
    Generate the namehash. This is also known as the ``node`` in ENS contracts.

    In normal operation, generating the namehash is handled
    behind the scenes. For advanced usage, it is a helpful utility.

    This normalizes the name with `nameprep
    <https://github.com/ethereum/EIPs/blob/master/EIPS/eip-137.md#name-syntax>`_
    before hashing.

    :param str name: ENS name to hash
    :return: the namehash
    :rtype: bytes
    :raises InvalidName: if ``name`` has invalid syntax
    """
    # normalized_name = normalize_name(name)
    normalized_name = name
    return normal_name_to_hash(normalized_name)


def ens_encode_name(name: str) -> bytes:
    """
    Encode a name according to DNS standards specified in section 3.1
    of RFC1035 with the following validations:

        - There is no limit on the total length of the encoded name
        and the limit on labels is the ENS standard of 255.

        - Return a single 0-octet, b'\x00', if empty name.

    :param str name: the dot-separated ENS name
    """
    if is_empty_name(name):
        return b'\x00'

    # normalized_name = normalize_name(name)
    normalized_name = name

    labels = normalized_name.split('.')
    labels_as_bytes = [to_bytes(text=label) for label in labels]

    # raises if len(label) > 255:
    for index, label in enumerate(labels):
        if len(label) > 255:
            raise ENSValidationError(f'Label at position {index} too long after encoding.')

    # concat label size in bytes to each label:
    dns_prepped_labels = [to_bytes(len(label)) + label for label in labels_as_bytes]

    # return the joined prepped labels in order and append the zero byte at the end:
    return b''.join(dns_prepped_labels) + b'\x00'


class OurENS(ENS):
    """
    Name normalization is disabled.
    """

    def name(self, address: ChecksumAddress) -> Optional[str]:
        """
        Look up the name that the address points to, using a
        reverse lookup. Reverse lookup is opt-in for name owners.

        :param address:
        :type address: hex-string
        """
        reversed_domain = address_to_reverse_domain(address)
        name = self._resolve(reversed_domain, fn_name='name')

        # To be absolutely certain of the name, via reverse resolution,
        # the address must match in the forward resolution
        result = name if to_checksum_address(address) == self.address(name) else None

        return result

    def resolver(self, name: str) -> Optional['Contract']:
        """
        Get the resolver for an ENS name.

        :param str name: The ENS name
        """
        # normal_name = normalize_name(name)
        normal_name = name
        return self._get_resolver(normal_name)[0]

    @staticmethod
    @wraps(raw_name_to_hash)
    def namehash(name: str) -> HexBytes:
        return raw_name_to_hash(name)

    def _resolve(self, name: str, fn_name: str = 'addr') -> Optional[Union[ChecksumAddress, str]]:
        # normal_name = normalize_name(name)
        normal_name = name
        resolver, current_name = self._get_resolver(normal_name, fn_name)
        if not resolver:
            return None

        node = self.namehash(normal_name)

        # handle extended resolver case
        if _resolver_supports_interface(resolver, ENS_EXTENDED_RESOLVER_INTERFACE_ID):
            contract_func_with_args = (fn_name, [node])

            calldata = resolver.encodeABI(*contract_func_with_args)
            contract_call_result = resolver.caller.resolve(
                ens_encode_name(normal_name),  # TODO ens_encode_name
                calldata,
            )
            result = self._decode_ensip10_resolve_data(contract_call_result, resolver, fn_name)
            return to_checksum_address(result) if is_address(result) else result
        elif normal_name == current_name:
            lookup_function = getattr(resolver.functions, fn_name)
            result = lookup_function(node).call()
            if is_none_or_zero_address(result):
                return None
            return to_checksum_address(result) if is_address(result) else result
        return None

    def _get_resolver(
        self,
        normal_name: str,
        fn_name: str = 'addr',
    ) -> Tuple[Optional['Contract'], str]:
        current_name = normal_name

        # look for a resolver, starting at the full name and taking the parent
        # each time that no resolver is found
        while True:
            if is_empty_name(current_name):
                # if no resolver found across all iterations, current_name
                # will eventually be the empty string '' which returns here
                return None, current_name

            resolver_addr = self.ens.caller.resolver(normal_name_to_hash(current_name))
            if not is_none_or_zero_address(resolver_addr):
                # if resolver found, return it
                resolver = cast('Contract', self._type_aware_resolver(resolver_addr, fn_name))
                return resolver, current_name

            # set current_name to parent and try again
            current_name = self.parent(current_name)

from enum import Enum


class ResolverNetworkName(str, Enum):
    MAINNET = 'mainnet'
    SEPOLIA = 'sepolia'
    GOERLI = 'goerli'

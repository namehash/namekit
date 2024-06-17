import pytest

from nameguard.subgraph import (
    resolve_labelhashes_querying_labelhashes,
    resolve_all_labelhashes_in_name_querying_labelhashes,
)
from nameguard.utils import namehash_from_name, MAX_INSPECTABLE_NAME_UNKNOWN_LABELS


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
@pytest.mark.parametrize(
    'name, namehash, expected',
    [
        (
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
            '0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
            '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
        ),
        (
            '[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth',
            '0x0462571d34d206146958c44e473730b1b2630321072c7fbb92deeea946416dab',
            '[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth',
        ),
        (
            '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
            '0x5f57b185ab56ca42b5506f96694c767ebcc8c6e2854a79636b565e4ebe700fb0',
            '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
        ),
        (
            '[3cea9784e8054d1110ff911c2ec60c673937528a1903ba0d76b76b11f62e4550].[17b7d2bcf3a9a21b8c13ea2f80455c2e5725593527788ea42b4deac1b327b620].eth',
            '0x313f64986f3b9b91f1da2a2f9d9029e5121e4caf1c5f959bfedfabe1d0256095',
            '[3cea9784e8054d1110ff911c2ec60c673937528a1903ba0d76b76b11f62e4550].tenzorum-id.eth',
        ),
        (
            '[1c475ca4200d816bad97986d1a70646022472f691e1929e8b2d405969fc68fd5].[5deb321dac767b851bb9b84f09a1b28038f4096cf436648a02f7d403cd52de1e].행정사법인.eth',
            '0x0954e85a60b36786ee9a6d06dd38b66642a21f1517205314d720c164c8bc6604',
            '[1c475ca4200d816bad97986d1a70646022472f691e1929e8b2d405969fc68fd5].[5deb321dac767b851bb9b84f09a1b28038f4096cf436648a02f7d403cd52de1e].행정사법인.eth',
        ),
        (
            '[af2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc].eth',
            '0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835',
            'vitalik.eth',
        ),
    ],
)
async def test_lookup(name, namehash, expected):
    assert namehash_from_name(name) == namehash
    network_name = 'mainnet'
    assert await resolve_all_labelhashes_in_name_querying_labelhashes(network_name, name) == expected


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_long_lookup():
    network_name = 'mainnet'
    name = (
        '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].' * MAX_INSPECTABLE_NAME_UNKNOWN_LABELS
        + 'eth'
    )
    assert await resolve_all_labelhashes_in_name_querying_labelhashes(network_name, name) == name

    name = (
        '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].'
        * (MAX_INSPECTABLE_NAME_UNKNOWN_LABELS + 1)
        + 'eth'
    )
    assert await resolve_all_labelhashes_in_name_querying_labelhashes(network_name, name) is None


@pytest.mark.flaky(retries=2, condition=not pytest.use_monkeypatch)
@pytest.mark.asyncio
async def test_lookup2():
    network_name = 'mainnet'
    labelhashes = {
        '[af2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc]': 'vitalik',
        '[5d5727cb0fb76e4944eafb88ec9a3cf0b3c9025a4b2f947729137c5d7f84f68f]': 'nick',
        '[f3e579667f05ae575146e5f418b0e8c0de3527a84c92e839c722a97901cd4b67]': 'jkestel',
        '[f3e579667f05ae575146e5f418b0e8c0de3527a84c92e839c722a97901cd4b68]': '[f3e579667f05ae575146e5f418b0e8c0de3527a84c92e839c722a97901cd4b68]',
    }
    result = await resolve_labelhashes_querying_labelhashes(network_name, labelhashes.keys())
    print(result)
    assert result == labelhashes

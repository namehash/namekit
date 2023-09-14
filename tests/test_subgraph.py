import pytest

from nameguard.subgraph import (
    namehash_to_name_lookup,
    resolve_all_labelhashes_in_name,
)
from nameguard.utils import namehash_from_name


@pytest.mark.asyncio
@pytest.mark.parametrize('name, namehash, expected', [
    ('[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth',
     '0xe0fe380f4d877f643e88ceabbed4e5ee0efe66f079aabba23e8902336f7948da',
     '[af498306bb191650e8614d574b3687c104bc1cd7e07c522954326752c6882770].eth'),

    ('[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth',
     '0x0462571d34d206146958c44e473730b1b2630321072c7fbb92deeea946416dab',
     '[5bc926fc40cc7c49e0df6dddf26e4dc7b9d6d32f4a55d4f0670320dbf414afd2].byongdok.eth'),

    ('[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth',
     '0x5f57b185ab56ca42b5506f96694c767ebcc8c6e2854a79636b565e4ebe700fb0',
     '[2af8fae91ee5ef94f17f2c2f23532cc2d1ccaee78cae52efed0df04bc2463b13].[3fddf465ed81d79ae943b35800b1d187dc0b5d69614bf7e8ebddbae19d72cae8].genevaswis.eth'),

    ('[3cea9784e8054d1110ff911c2ec60c673937528a1903ba0d76b76b11f62e4550].[17b7d2bcf3a9a21b8c13ea2f80455c2e5725593527788ea42b4deac1b327b620].eth',
     '0x313f64986f3b9b91f1da2a2f9d9029e5121e4caf1c5f959bfedfabe1d0256095',
     '[3cea9784e8054d1110ff911c2ec60c673937528a1903ba0d76b76b11f62e4550].tenzorum-id.eth'),

    ('[1c475ca4200d816bad97986d1a70646022472f691e1929e8b2d405969fc68fd5].[5deb321dac767b851bb9b84f09a1b28038f4096cf436648a02f7d403cd52de1e].행정사법인.eth',
     '0x0954e85a60b36786ee9a6d06dd38b66642a21f1517205314d720c164c8bc6604',
     '[1c475ca4200d816bad97986d1a70646022472f691e1929e8b2d405969fc68fd5].[5deb321dac767b851bb9b84f09a1b28038f4096cf436648a02f7d403cd52de1e].행정사법인.eth'),
])
async def test_lookup(name, namehash, expected):
    assert namehash_from_name(name) == namehash
    assert await resolve_all_labelhashes_in_name(name) == expected

# ENS Smart Contracts Summary Overview

- All addresses and ENS names given below are for mainnet.
- Below is only a partial summary of ENS contracts.

## "ENSRegistryOld"

- Address: 0x314159265dd8dbb310642f98f50c066173c1259b
- ENS Name: (none)
- Subgraph
  - Name in subgraph.yaml: "ENSRegistryOld"
- Start block: 3327417 (Mar-10-2017 05:05:44 PM +UTC)
- Role:
  - The original registry for ENS names before the ENS Registry Migration in Feb 2020 that transitioned the registry to "ENSRegistryWithFallback".
- Data model summary:
  - Maps from node -> (resolver, owner, TTL).

## "ENSRegistryWithFallback"

- Address: 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e
- ENS Name: registry.ens.eth
- Subgraph:
  - Name in subgraph.yaml: "ENSRegistry"
- Start block: 9380380 (Jan-30-2020 12:37:12 AM +UTC)
- Role:
  - The current registry for ENS names.
  - "... with Fallback" refers to how this registry reads state for a node:
    1. It looks for registry records contained for the node within this new "ENSRegistryWithFallback" registry.
    2. If found, the requested data is returned from state held within "ENSRegistryWithFallback".
    3. If not found, it "falls back" to the original "ENSRegistryOld" registry and returns whatever state that contract had for that node (if any).
    4. This fallback works only for read operations; if a record exists in the old registry but not yet in the new one, users cannot call functions to modify that record on the new registry.
  - Migration process of a node from "ENSRegistryOld" to "ENSRegistryWithFallback"
    - A node in "ENSRegistryWithFallback" must be recreated as if from scratch - so, for example, if ‘foo.eth’ does not yet exist in "ENSRegistryWithFallback", the owner of the ‘eth’ node must create it in the same fashion as if it were a new domain, by calling `setSubnodeOwner` (or the new `setSubnodeRecord`) on "ENSRegistryWithFallback". Other top-level domain owners (eg, .luxe, .kred, .club and .art) will need to do this on behalf of their users, so those users can recover write access to their domains.
  - Adds features not present in "ENSRegistryOld", including:
    1. Addition of `setRecord` and `setSubnodeRecord` methods, which allow setting owner, resolver, and TTL in a single operation.
    2. Addition of the `setApprovalForAll` approval mechanism based on ERC721, that allows users to delegate control over their names to another address, without having to transfer their names.
- Data model summary:
  - Maps from node -> (resolver, owner, TTL).
  - Maps from address -> (address -> bool) to identify a given address has approved another address to operate on its behalf.
- Background info on the ENS Registry Migration:
  - [Technical Description](https://web.archive.org/web/20210924182933/https://docs.ens.domains/ens-migration-february-2020/technical-description) (archive.org)
  - [Guide for DApp Developers](https://web.archive.org/web/20211129135716/https://docs.ens.domains/ens-migration-february-2020/guide-for-dapp-developers) (archive.org)
  - [ENS Registry Migration: Bug Fix, New Features](https://web.archive.org/web/20221130223832/https://medium.com/the-ethereum-name-service/ens-registry-migration-bug-fix-new-features-64379193a5a) (archive.org)
  - [ENS Registry Migration Is Over… Now What? A Few Things to Know](https://makoto-inoue.medium.com/ens-registry-migration-is-over-now-what-a-few-things-to-know-fb05f921872a)
  - [Migration complete (Feb 10, 2020)](https://x.com/ensdomains/status/1226950669904400384)

## ".ethBaseRegistrarImplementation"

- Address: 0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85
- ENS Name: registrar.ens.eth
- Subgraph
  - Name in subgraph.yaml: "BaseRegistrar"
- Start block: 9380410 (Jan-30-2020 12:43:54 AM +UTC)
- Role:
  - Current BaseRegistrarImplementation for second-level .eth names.
  - ERC721 NFTs for second-level .eth names are minted and managed through this contract.
  - Implements a dynamic time-dependant `ownerOf` function that indicates a subname is unowned once its registration expires.
    - It should be noted how it is possible to be the owner of a node in the ENS Registry (which has no concept of expiration) and therefore still able to perform any desired write options on the node in the ENS Registry even when there is no `ownerOf` in the BaseRegistrarImplementation. However, once the name becomes `available` according to the BaseRegistrarImplementation anyone may register it. This registration will involve the BaseRegistrarImplementation using it's right to `setSubnodeOwner` in the ENS Registry to update the owner of the node in the ENS Registry.
    - Therefore, buy or ask orders for a related NFT cannot be executed when a name is in an expired state.
  - Implements a dynamic time-dependant `available` function that prevents a subname from being registered until both the registration and a subsequent grace period expires.
- Data model summary:
  - Maps from address -> bool to identify a given address is approved as a "controller" of this BaseRegistrarImplementation.
  - Maps from tokenId -> registration expiration time;
  - From ERC721:
    - Maps from tokenId -> address of token owner
      - NOTE: It is possible for a node to have a different owner in the ENS Registry than in the BaseRegistrarImplementation.
        - For example: someone might transfer ownership of a node in the ENS Registry to another address, but not update any state in the BaseRegistrarImplementation.
        - For example: see the `registerOnly` function that sets the owner inside the BaseRegistrarImplementation but not in the ENS Registry.
      - In the case of a disagreement of who the owner is, the owner according to the BaseRegistrarImplementation "wins" through the use of the `reclaim` function that will use `setSubnodeOwner` in the ENS Registry to synchronize ownership state.
    - Maps from tokenId -> address of "token approval address"
    - Maps from address -> number of owned tokens
      - NOTE: This doesn't take into consideration expired names.
    - Mapping from owner -> address of operator -> bool if operator is approved to act on behalf of owner

## "Old.ethBaseRegistrarImplementation"

- Address: 0xfac7bea255a6990f749363002136af6556b31e04
- ENS Name: (none)
- Subgraph
  - Not indexed
- Start block: 7666399 (Apr-30-2019 03:35:33 AM +UTC)
- Role:
  - Former BaseRegistrarImplementation for second-level .eth names.
  - Replaced by ".ethBaseRegistrarImplementation" as part of the ENS registry migration.
  - Prior to the ENS registry migration, this contract was the source of truth for ERC721 NFTs for direct subnames of .eth.
  - Starting on February 3rd 00:00 UTC, after the ENS registry migration, domain owners will automatically have new ERC721 tokens created on ".ethBaseRegistrarImplementation", with the same Token Id as those on "Old.ethBaseRegistrarImplementation".
  - After `isMigrated` becomes true for a node inside this contract, the NFT for that node inside this contract no longer corresponds to an ENS name and is worthless.

## "Old.ethRegistrarController"

- Address: 0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5
- Subgraph
  - Name in subgraph.yaml: "EthRegistrarControllerOld"
- Start block: 9380471 (Jan-30-2020 12:56:38 AM +UTC)
- Role:
  - Registers names in ".ethBaseRegistrarImplementation"
  - As of time of writing, continues to be a controller for ".ethBaseRegistrarImplementation" even though it is "old".
- Data model summary:
  - Maps from "commitment" -> time of commitment

## ".ethRegistrarController"

- Address: 0x253553366Da8546fC250F225fe3d25d0C782303b
- Subgraph
  - Name in subgraph.yaml: "EthRegistrarController"
- Start block: 16925618 (Mar-28-2023 11:44:59 AM +UTC)
- Role:
  - Registers names in ".ethBaseRegistrarImplementation"
  - During each registration:
    - Automatically wraps all registered names in "NameWrapper" using `registerAndWrapETH2LD` function.
    - Provides option to also make the name being registered your primary name as part of the same transaction.
    - Provides option to also initialize resolver records using the specified resolver as part of the same transaction using `multicallWithNodeCheck` function.
  - During each renewal:
    - Also calls `nameWrapper.renew`
- Data model summary:
  - Maps from "commitment" -> time of commitment

## "NameWrapper"

- Address: 0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401
- ENS Name: wrapper.ens.eth
- Subgraph
  - Name in subgraph.yaml: "NameWrapper"
- Start block: 16925608 (Mar-28-2023 11:42:59 AM +UTC)
- Data model summary:
  - Maps from node -> (address owner, uint32 fuses, uint64 expiry) (through "ERC1155Fuse.sol")
- NOTE: `getData` function dynamically nullifies the owner and fuses for a node based on the current time in relation to the expiry time of a node.
- NOTE: `renew` function:
  - Is only for second-level ".eth" names
  - Renews by the specified duration in ".ethRegistrarController"
  - Sets the `expiry` in "NameWrapper" to be the expiry in ".ethRegistrarController" + GRACE_PERIOD

## "RegistryMigration"

- Address: 0x6109DD117AA5486605FC85e040ab00163a75c662
- Subgraph
  - Not indexed
- Start block: 9406409 (Feb-03-2020 12:55:01 AM +UTC)
- Role:
  - Supported the migration of names from "Old.ethBaseRegistrarImplementation" to ".ethBaseRegistrarImplementation" as part of the ENS Registry Migration.

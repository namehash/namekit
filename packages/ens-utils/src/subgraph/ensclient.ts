import { ChainId, MAINNET, SEPOLIA } from '../chain';
import {
  SubgraphClient,
  SubgraphClientOptions,
  SubgraphRef,
  buildSubgraphRef,
} from './client';

export class ENSSubgraphClient extends SubgraphClient {
  public constructor(subgraph: SubgraphRef, options?: SubgraphClientOptions) {
    super(subgraph, options);
  }

  /**
   * TODO: update for new decentralized subgraph transition.
   * More details at https://discuss.ens.domains/t/ens-subgraph-migration-to-the-decentralised-version/19183
   **/
  public static readonly getOfficialEndpoint = (chain: ChainId): URL => {
    switch (chain.chainId) {
      case MAINNET.chainId:
        return new URL(
          'https://api.thegraph.com/subgraphs/name/ensdomains/ens'
        );
      case SEPOLIA.chainId:
        return new URL(
          'https://api.studio.thegraph.com/query/49574/enssepolia/version/latest'
        );
      default:
        throw new Error(
          `Official ENS subgraph endpoint for ChainId ${chain.chainId} is unknown.`
        );
    }
  };

  public static readonly getOfficialDeploymentId = (chain: ChainId): string => {
    switch (chain.chainId) {
      case MAINNET.chainId:
        return 'QmYNJebmKg5mw6kBd4aN8UtJ3SuE1zDvoibfQJ7fjyFNv4';
      case SEPOLIA.chainId:
        return 'QmdDtoN9QCRsBUsyoiiUUMQPPmPp5jimUQe81828UyWLtg';
      default:
        throw new Error(
          `Official ENS Subgraph Deployment Id for ChainId ${chain.chainId} is unknown.`
        );
    }
  };

  public static readonly buildENSSubgraphRef = (
    chain: ChainId,
    customEndpoint?: string,
    customDeploymentId?: string
  ): SubgraphRef => {
    return buildSubgraphRef(
      chain,
      customEndpoint
        ? new URL(customEndpoint)
        : ENSSubgraphClient.getOfficialEndpoint(chain),
      customDeploymentId ?? ENSSubgraphClient.getOfficialDeploymentId(chain)
    );
  };
}

export const ENS_SUBGRAPH_MAINNET =
  ENSSubgraphClient.buildENSSubgraphRef(MAINNET);
export const ENS_SUBGRAPH_SEPOLIA =
  ENSSubgraphClient.buildENSSubgraphRef(SEPOLIA);
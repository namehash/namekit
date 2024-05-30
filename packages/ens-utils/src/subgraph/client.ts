import fetch from 'cross-fetch';
import { ChainId, MAINNET, SEPOLIA } from '../chain';
import { Timestamp, buildTimestamp } from '../time';

export interface SubgraphRef {
  chain: ChainId;
  deploymentId: string;
  endpoint: URL;
}

export const buildSubgraphRef = (
  chain: ChainId,
  customEndpoint?: string,
  deploymentId?: string
): SubgraphRef => {
  return {
    chain,
    endpoint: customEndpoint
      ? new URL(customEndpoint)
      : getOfficialSubgraphEndpoint(chain),
    deploymentId: deploymentId ?? getOfficialSubgraphDeploymentId(chain),
  };
};

// TODO: update for new decentralized subgraph transition. More details at https://discuss.ens.domains/t/ens-subgraph-migration-to-the-decentralised-version/19183
export const getOfficialSubgraphEndpoint = (chain: ChainId): URL => {
  switch (chain.chainId) {
    case MAINNET.chainId:
      return new URL('https://api.thegraph.com/subgraphs/name/ensdomains/ens');
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

export const getOfficialSubgraphDeploymentId = (chain: ChainId): string => {
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

export const formatSubgraphRef = (subgraph: SubgraphRef): string => {
  return `SubgraphRef(chainId:\"${subgraph.chain.chainId}\", endpoint:\"${subgraph.endpoint}\", deploymentId:\"${subgraph.deploymentId}\")`;
};

export const MAINNET_SUBGRAPH = buildSubgraphRef(MAINNET);
export const SEPOLIA_SUBGRAPH = buildSubgraphRef(SEPOLIA);

export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLError {
  message: string;
  locations?: GraphQLErrorLocation[];
}

export interface RawSubgraphResponse {
  data?: {
    _meta?: {
      block: {
        number: number;
        hash: `0x${string}` | null;
        timestamp: number | null;
      };
      deployment: string;
      hasIndexingErrors: boolean;
    };

    // "catch-all" for the true response data
    [key: string]: any;
  };

  errors?: GraphQLError[];
}

export interface BlockRef {
  chain: ChainId;
  blockNumber: number;
  blockHash: `0x${string}`;
  timestamp: Timestamp;
}

export interface SubgraphIndexingStatus {
  lastIndexedBlock: BlockRef;
  subgraphDeploymentId: string;
  hasIndexingErrors: boolean;
}

export interface SubgraphResponse<QueryResponseType> {
  indexingStatus: SubgraphIndexingStatus;
  data: QueryResponseType;
}

export interface SubgraphErrorOptions {
  message: string;
  subgraph: SubgraphRef;
  response?: Response;
}

export class SubgraphError extends Error {
  public readonly subgraph: SubgraphRef;
  public readonly response?: Response;

  public constructor({ message, subgraph, response }: SubgraphErrorOptions) {
    super(SubgraphError.buildMessage(message, subgraph, response));
    this.subgraph = subgraph;
    this.response = response;
    this.name = 'SubgraphError';
    Error.captureStackTrace(this, this.constructor);
  }

  public static buildMessage(
    message: string,
    subgraph: SubgraphRef,
    response?: Response
  ): string {
    return `Subgraph error: ${message}\n\t${formatSubgraphRef(subgraph)}\n\t${response ? SubgraphError.formatResponse(response) : ''}`;
  }

  private static formatGraphQLError = (error: GraphQLError): string => {
    let locations = '';
    if (error.locations) {
      locations = error.locations
        .map((location) => {
          return `(${location.line}:${location.column})`;
        })
        .join(',');
    }
    return `${error.message} ${locations}`;
  };

  private static formatGraphQLErrors = (errors: GraphQLError[]): string => {
    return errors.map(SubgraphError.formatGraphQLError).join('\n');
  };

  private static formatResponse = async (
    response: Response
  ): Promise<string> => {
    let details: string;
    if (!response.ok) {
      details = `text: \"${await response.text()}\"`;
    } else {
      const rawResponse: RawSubgraphResponse = await response.json();

      if (rawResponse.errors) {
        details = `errors: \"${SubgraphError.formatGraphQLErrors(rawResponse.errors)}\"`;
      } else if (!rawResponse.data) {
        details = `data: \"(no data returned)\"`;
      } else {
        details = `data: \"${JSON.stringify(rawResponse.data)}\"`;
      }
    }

    return `Response(status:\"${response.status}\", message:\"${response.statusText}\", ${details})`;
  };
}

/**
 * 5 seconds
 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 5000;

export interface SubgraphQueryOptions {
  timeoutMs?: number;
}

export const IssueHandlingPolicy = {
  Ignore: 'IGNORE',
  Warn: 'WARN',
  Error: 'ERROR',
} as const;

export type IssueHandlingPolicy =
  (typeof IssueHandlingPolicy)[keyof typeof IssueHandlingPolicy];

export interface SubgraphClientOptions {
  subgraph?: SubgraphRef;
  deploymentIdMismatchPolicy?: IssueHandlingPolicy;
  hasIndexingErrorPolicy?: IssueHandlingPolicy;
}

// TODO: document me
export class SubgraphClient {
  // TODO: document me
  public readonly subgraph: SubgraphRef;
  public readonly deploymentIdMismatchPolicy: IssueHandlingPolicy;
  public readonly hasIndexingErrorPolicy: IssueHandlingPolicy;

  // TODO: document me
  constructor(options?: SubgraphClientOptions) {
    this.subgraph = options?.subgraph ?? MAINNET_SUBGRAPH;
    this.deploymentIdMismatchPolicy =
      options?.deploymentIdMismatchPolicy ?? IssueHandlingPolicy.Warn;
    this.hasIndexingErrorPolicy =
      options?.hasIndexingErrorPolicy ?? IssueHandlingPolicy.Warn;
  }

  /**
   * Performs a GraphQL query on an ENS Subgraph.
   *
   * @param {string} request The GraphQL request body.
   * @param {number} timeoutMs Optional timeout for the request in milliseconds. Defaults to `DEFAULT_REQUEST_TIMEOUT`.
   * @returns {Promise<SubgraphResponse<ResponseType>>} The data returned from the subgraph.
   */
  public async query<ResponseType>(
    request: string,
    { timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS }: SubgraphQueryOptions = {}
  ): Promise<SubgraphResponse<ResponseType>> {
    const requestBody = this._buildQueryBody(request);

    const options: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: requestBody,
      signal: AbortSignal.timeout(timeoutMs),
    };

    const response = await fetch(this.subgraph.endpoint, options);

    return this._validateResponse<ResponseType>(response);
  }

  // TODO: document me
  public async queryIndexingStatus(): Promise<SubgraphResponse<{}>> {
    return this.query<{}>('');
  }

  // TODO: document me
  private _buildQueryBody(query: string): string {
    // add `_meta` to the query so that we also get the indexing status of the subgraph with each query
    const queryWithMeta = `
        query {
            _meta {
                block {
                    number
                    hash
                    timestamp
                }
                deployment
                hasIndexingErrors
            }
            ${query}
        }`;

    return JSON.stringify({ query: queryWithMeta });
  }

  // TODO: document me
  private async _validateResponse<ResponseType>(
    response: Response
  ): Promise<SubgraphResponse<ResponseType>> {
    if (!response.ok) {
      throw new SubgraphError({
        message: 'Subgraph request error.',
        subgraph: this.subgraph,
        response: response,
      });
    }

    const rawResponse: RawSubgraphResponse = await response.json();

    if (rawResponse.errors) {
      throw new SubgraphError({
        message: 'Subgraph returned error.',
        subgraph: this.subgraph,
        response: response,
      });
    }

    if (!rawResponse.data) {
      throw new SubgraphError({
        message: 'Subgraph returned no data.',
        subgraph: this.subgraph,
        response: response,
      });
    }

    const meta = rawResponse.data._meta;

    if (!meta) {
      throw new SubgraphError({
        message: 'Subgraph returned no metadata.',
        subgraph: this.subgraph,
        response: response,
      });
    }

    if (!meta.block.hash) {
      throw new SubgraphError({
        message: 'Subgraph returned no block hash metadata.',
        subgraph: this.subgraph,
        response: response,
      });
    }

    if (!meta.block.timestamp) {
      throw new SubgraphError({
        message: 'Subgraph returned no block timestamp metadata.',
        subgraph: this.subgraph,
        response: response,
      });
    }

    if (meta.deployment !== this.subgraph.deploymentId) {
      const message = `Subgraph deployment mismatch. Expected: ${this.subgraph.deploymentId} Actual: ${meta.deployment}.`;
      switch (this.deploymentIdMismatchPolicy) {
        case IssueHandlingPolicy.Ignore:
          break;
        case IssueHandlingPolicy.Warn:
          console.warn(SubgraphError.buildMessage(message, this.subgraph));
          break;
        case IssueHandlingPolicy.Error:
          throw new SubgraphError({
            message: message,
            subgraph: this.subgraph,
          });
      }
    }

    if (meta.hasIndexingErrors) {
      const message = 'Subgraph has indexing errors.';
      switch (this.hasIndexingErrorPolicy) {
        case IssueHandlingPolicy.Ignore:
          break;
        case IssueHandlingPolicy.Warn:
          console.warn(SubgraphError.buildMessage(message, this.subgraph));
          break;
        case IssueHandlingPolicy.Error:
          throw new SubgraphError({
            message: message,
            subgraph: this.subgraph,
          });
      }
    }

    // deconstruct `_meta` out from `rawResponse.data` so that `data` only contains the response data that was explicitly requested
    const { _meta, ...data } = rawResponse.data;

    return {
      indexingStatus: {
        lastIndexedBlock: {
          chain: this.subgraph.chain,
          blockNumber: meta.block.number,
          blockHash: meta.block.hash,
          timestamp: buildTimestamp(BigInt(meta.block.timestamp)),
        },
        subgraphDeploymentId: meta.deployment,
        hasIndexingErrors: meta.hasIndexingErrors,
      },
      data: data as unknown as ResponseType,
    };
  }
}

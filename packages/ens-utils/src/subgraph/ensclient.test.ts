import { describe, it, expect } from 'vitest';
import { IssueHandlingPolicy } from './client';
import {
  ENSSubgraphClient,
  ENS_SUBGRAPH_MAINNET,
  ENS_SUBGRAPH_SEPOLIA,
} from './ensclient';

// TODO: expand test cases!
describe('SubgraphClient', () => {
  it('can query official mainnet subgraph', async () => {
    const client = new ENSSubgraphClient(ENS_SUBGRAPH_MAINNET);

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });

  it('can query official sepolia subgraph', async () => {
    const client = new ENSSubgraphClient(ENS_SUBGRAPH_SEPOLIA);

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });

  it('has the latest mainnet subgraph deployment id', async () => {
    const client = new ENSSubgraphClient(ENS_SUBGRAPH_MAINNET, {
      deploymentIdMismatchPolicy: IssueHandlingPolicy.Error,
    });

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });

  it('has the latest sepolia subgraph deployment id', async () => {
    const client = new ENSSubgraphClient(ENS_SUBGRAPH_SEPOLIA, {
      deploymentIdMismatchPolicy: IssueHandlingPolicy.Error,
    });

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });
});

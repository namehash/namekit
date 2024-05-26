import { describe, it, expect } from 'vitest';
import {
  IssueHandlingPolicy,
  SEPOLIA_SUBGRAPH,
  SubgraphClient,
} from './subgraph';

// TODO: expand test cases!
describe('SubgraphClient', () => {
  it('can query official mainnet subgraph', async () => {
    const client = new SubgraphClient();

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });

  it('can query official sepolia subgraph', async () => {
    const client = new SubgraphClient({ subgraph: SEPOLIA_SUBGRAPH });

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });

  it('has the latest mainnet subgraph deployment id', async () => {
    const client = new SubgraphClient({
      deploymentIdMismatchPolicy: IssueHandlingPolicy.Error,
    });

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });

  it('has the latest sepolia subgraph deployment id', async () => {
    const client = new SubgraphClient({
      subgraph: SEPOLIA_SUBGRAPH,
      deploymentIdMismatchPolicy: IssueHandlingPolicy.Error,
    });

    const result = await client.queryIndexingStatus();
    expect(result).toBeDefined();
  });
});

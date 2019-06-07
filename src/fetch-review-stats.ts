import {
  RequestInformation,
  getInitialRequestInformation,
  getIntermediateRequestInformation
} from './queries';
import { PullRequest } from './types';

interface PullRequestsResponse {
  data: {
    search: {
      nodes: PullRequest[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
}

const REQUEST_DELAY_MS = 3000;

function makeGraphQLRequest(
  client: any,
  requestInformation: RequestInformation
): Promise<PullRequestsResponse> {
  return client.query(requestInformation.query, requestInformation.variables);
}

export async function fetchReviewStats(
  client: any,
  repository: string,
  timeRange: string
) {
  const requestInformation = getInitialRequestInformation(
    repository,
    timeRange
  );
  let requestId = -1;

  console.log(`${++requestId}: fetching`);
  const allNodes: PullRequest[] = [];
  let response = (await makeGraphQLRequest(client, requestInformation)).data
    .search;
  allNodes.push(...response.nodes);
  console.log(`${requestId}: fetched`);

  while (response.pageInfo.hasNextPage) {
    console.log(`${++requestId}: waiting...`);
    await delay(REQUEST_DELAY_MS);
    console.log(`${requestId}: fetching`);
    const intermediateRequestInformation = getIntermediateRequestInformation(
      repository,
      timeRange,
      response.pageInfo.endCursor as string
    );

    const rawResponse = await makeGraphQLRequest(
      client,
      intermediateRequestInformation
    );
    console.log(`${requestId}: fetched`);
    response = rawResponse.data.search;
    allNodes.push(...response.nodes);
  }

  return allNodes;
}

function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

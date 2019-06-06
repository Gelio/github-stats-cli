const {
  getInitialRequestInformation,
  getIntermediateRequestInformation
} = require('./queries');

/**
 * @param {*} client
 * @param {{ query: object, variables: object }} requestInformation
 */
function makeGraphQLRequest(client, requestInformation) {
  return client.query(requestInformation.query, requestInformation.variables);
}

/**
 * @param {*} client
 * @param {string} repository
 * @param {string} timeRange
 */
async function fetchReviewStats(client, repository, timeRange) {
  const requestInformation = getInitialRequestInformation(
    repository,
    timeRange
  );
  let requestId = -1;

  console.log(`${++requestId}: fetching`);
  const allNodes = [];
  let response = (await makeGraphQLRequest(client, requestInformation)).data
    .search;
  allNodes.push(...response.nodes);
  console.log(`${requestId}: fetched`);

  while (response.pageInfo.hasNextPage) {
    console.log(`${++requestId}: fetching`);
    const intermediateRequestInformation = getIntermediateRequestInformation(
      repository,
      timeRange,
      response.pageInfo.endCursor
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

module.exports = {
  fetchReviewStats
};

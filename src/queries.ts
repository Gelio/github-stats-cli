/**
 * TODO: One query with optional `afterCursor` parameter can be used
 * instead of having two separate queries.
 */

const commonQueryPart = `
nodes {
  ... on PullRequest {
    number
    permalink
    title
    updatedAt
    createdAt
    mergedAt
    closed
    merged
    changedFiles
    additions
    deletions
    author {
      login
    }
    labels(first: 100) {
      nodes {
        name
      }
    }
    reviews(first: $firstReviews) {
      nodes {
        author {
          login
        }
        comments {
          totalCount
        }
        publishedAt
        state
      }
    }
  }
}
pageInfo {
  endCursor
  hasNextPage
}`;

export interface RequestInformation {
  query: string;
  variables: object;
}

/**
 * REFACTOR: use a single query with optional `after` param
 */

export function getInitialRequestInformation(
  repository: string,
  timeRange: string,
  additionalQuerySuffix: string
): RequestInformation {
  return {
    query: `
query GetRepositoryInfo($firstPrs: Int!, $firstReviews: Int!, $query: String!) {
search(first: $firstPrs, type: ISSUE, query: $query) {
  ${commonQueryPart}
}
}
`,
    variables: {
      firstPrs: 100,
      firstReviews: 100,
      query: `type:pr repo:${repository} updated:${timeRange} sort:updated-desc ${additionalQuerySuffix}`
    }
  };
}

export function getIntermediateRequestInformation(
  repository: string,
  timeRange: string,
  pageCursor: string,
  additionalQuerySuffix: string
): RequestInformation {
  return {
    query: `
query GetRepositoryInfo($afterCursor: String!, $firstPrs: Int!, $firstReviews: Int!, $query: String!) {
search(first: $firstPrs, after: $afterCursor, type: ISSUE, query: $query) {
  ${commonQueryPart}
}
}
`,
    variables: {
      afterCursor: pageCursor,
      firstPrs: 100,
      firstReviews: 100,
      query: `type:pr repo:${repository} updated:${timeRange} sort:updated-desc ${additionalQuerySuffix}`
    }
  };
}

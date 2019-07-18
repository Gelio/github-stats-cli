require('dotenv').config();

import { writeFileSync } from 'fs';
import * as createGraphQlClient from 'graphql-client';

import { fetchReviewStats } from './src/fetch-review-stats';
import { config } from './src/config';
import { PullRequest } from './src/types';

const client = createGraphQlClient({
  url: 'https://api.github.com/graphql',
  headers: {
    Authorization: `token ${config.authToken}`
  }
});

function filterReviews(prs: PullRequest[]) {
  const [fromTime, toTime] = config.timeRange.split('..');
  const fromTimestamp = new Date(fromTime).getTime();
  const toTimestamp = new Date(toTime).getTime();

  return prs.map(pr => {
    pr.reviews.nodes = pr.reviews.nodes.filter(review => {
      const timestamp = new Date(review.publishedAt).getTime();

      return timestamp >= fromTimestamp && timestamp <= toTimestamp;
    });

    return pr;
  });
}

fetchReviewStats(
  client,
  config.repository,
  config.timeRange,
  config.additionalQuerySuffix
)
  .then(filterReviews)
  .then(body => {
    console.log(`Finished fetching. Saving to ${config.fileName}`);
    writeFileSync(config.fileName, JSON.stringify(body, null, 2), 'utf8');
    console.log('Saved');
  })
  .catch(error => console.error(error));

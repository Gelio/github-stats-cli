require('dotenv').config();

import { writeFileSync } from 'fs';
import { fetchReviewStats } from './src/fetch-review-stats';
import { config } from './src/config';

import * as createGraphQlClient from 'graphql-client';

const client = createGraphQlClient({
  url: 'https://api.github.com/graphql',
  headers: {
    Authorization: `token ${config.authToken}`
  }
});

fetchReviewStats(client, config.repository, config.timeRange)
  .then(body => {
    console.log(`Finished fetching. Saving to ${config.fileName}`);
    writeFileSync(config.fileName, JSON.stringify(body, null, 2), 'utf8');
    console.log('Saved');
  })
  .catch(error => console.error(error));

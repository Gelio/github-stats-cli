require('dotenv').config();

const { writeFileSync } = require('fs');
const { fetchReviewStats } = require('./src/fetch-review-stats');
const config = require('./src/config');
const client = require('graphql-client')({
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

import { readFileSync } from 'fs';

import { reviewsPerEngineer } from './src/analyzers/reviews-per-engineer';
import { PullRequest } from './src/types';
import { prsCreated } from './src/analyzers/prs-created';
import { timeToFirstReview } from './src/analyzers/time-to-first-review';
import { timeToMerge } from './src/analyzers/time-to-merge';
import { timeBetweenLastReviewAndMerge } from './src/analyzers/time-between-last-review-and-merge';

const fileName = process.argv[2];
if (!fileName) {
  console.error('Please provide the JSON file path as the first parameter');
  process.exit(1);
}

const allPRs: PullRequest[] = JSON.parse(readFileSync(fileName, 'utf8'));
const filteredPRs = allPRs.filter(pr => !/sync/i.test(pr.title));

try {
  const results = timeBetweenLastReviewAndMerge(filteredPRs);

  Object.keys(results).forEach(author => {
    console.log(`${author},"${results[author]}"`);
  });
} catch (error) {
  console.error(error);
}

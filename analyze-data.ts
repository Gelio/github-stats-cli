import { readFileSync } from 'fs';

import { reviewsPerEngineer } from './src/analyzers/reviews-per-engineer';
import { PullRequest } from './src/types';
import { prsCreated } from './src/analyzers/prs-created';
import { timeToFirstReview } from './src/analyzers/time-to-first-review';
import { timeToMerge } from './src/analyzers/time-to-merge';
import { timeBetweenLastReviewAndMerge } from './src/analyzers/time-between-last-review-and-merge';
import { substituteNames } from './src/substitute-names';

const namesSubstitutions: Record<string, string> = {};


const fileName = process.argv[2];
if (!fileName) {
  console.error('Please provide the JSON file path as the first parameter');
  process.exit(1);
}

const allPRs: PullRequest[] = JSON.parse(readFileSync(fileName, 'utf8'));

try {
  const results = reviewsPerEngineer(allPRs);
  const resultsWithSubstitutedNames = substituteNames(
    results,
    namesSubstitutions
  );

  Object.keys(resultsWithSubstitutedNames).forEach(author => {
    console.log(`"${author}","${resultsWithSubstitutedNames[author]}"`);
  });
} catch (error) {
  console.error(error);
}

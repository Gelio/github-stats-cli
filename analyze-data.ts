import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

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
const baseFileName = basename(fileName, '.json');

const allPRs: PullRequest[] = JSON.parse(readFileSync(fileName, 'utf8'));

const metrics = [
  reviewsPerEngineer,
  prsCreated,
  timeToFirstReview,
  timeToMerge,
  timeBetweenLastReviewAndMerge
];

try {
  metrics.map(metric => {
    const results = metric(allPRs);
  const resultsWithSubstitutedNames = substituteNames(
      results as any,
    namesSubstitutions
  );

    const csvResults = Object.keys(resultsWithSubstitutedNames)
      .map(author => `"${author}","${resultsWithSubstitutedNames[author]}"`)
      .join('\r\n');

    const resultsFileName = `${baseFileName}-${metric.name}.csv`;
    writeFileSync(resultsFileName, csvResults);
    console.log(resultsFileName, 'done');
  });

  console.log('Completed successfully');
} catch (error) {
  console.error(error);
}

import { gt, always } from 'ramda';

import { PullRequest } from '../types';

const buckets: ((hours: number) => boolean)[] = [
  gt(2),
  gt(8),
  gt(24),
  gt(24 * 3),
  gt(24 * 7),
  gt(24 * 30),
  always(true)
];
const bucketNames = [
  'a. Less than 2h',
  'b. 2h - 8h',
  'c. 8h - 24h',
  'd. 24h - 3d',
  'e. 3d - 7d',
  'f. 7d - 1m',
  'g. 1m or more'
];

export function timeToMerge(prs: PullRequest[]) {
  const timeToMergePerPR: Record<string, string> = {};

  prs.forEach(pr => {
    if (!pr.mergedAt) {
      return;
    }

    const timeToMerge =
      (new Date(pr.mergedAt).getTime() - new Date(pr.createdAt).getTime()) /
      1000 /
      60 /
      60;

    const bucket = buckets.findIndex(x => x(timeToMerge));
    const bucketName = bucketNames[bucket];

    timeToMergePerPR[pr.number] = bucketName;
  });

  return timeToMergePerPR;
}

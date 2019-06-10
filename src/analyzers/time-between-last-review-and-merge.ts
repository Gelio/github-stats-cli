import { maxBy, reduce, gt, always } from 'ramda';

import { PullRequest, Review, ReviewState } from '../types';

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

const acceptableReviewStates: ReviewState[] = ['APPROVED'];

export function timeBetweenLastReviewAndMerge(prs: PullRequest[]) {
  const timeBetweenLastReviewAndMergePerPR: Record<string, string> = {};

  prs.forEach(pr => {
    const reviews = pr.reviews.nodes.filter(review =>
      acceptableReviewStates.includes(review.state)
    );

    if (reviews.length === 0) {
      return;
    }

    const lastReview = reduce(
      maxBy((review: Review) => new Date(review.publishedAt).getTime()),
      reviews[0],
      reviews
    );

    const timeBetweenLastReviewAndMerge = Math.round(
      (new Date(pr.mergedAt).getTime() -
        new Date(lastReview.publishedAt).getTime()) /
        1000 /
        60 /
        60
    );

    const bucket = buckets.findIndex(x => x(timeBetweenLastReviewAndMerge));
    const bucketName = bucketNames[bucket];

    timeBetweenLastReviewAndMergePerPR[pr.number] = bucketName;
  });

  return timeBetweenLastReviewAndMergePerPR;
}

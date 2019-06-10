import { minBy, reduce, gt, always } from 'ramda';

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

const acceptableReviewStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED'];

export function timeToFirstReview(prs: PullRequest[]) {
  const timeToFirstReviewPerPR: Record<string, string> = {};

  prs.forEach(pr => {
    const reviews = pr.reviews.nodes.filter(review =>
      acceptableReviewStates.includes(review.state)
    );

    if (reviews.length === 0) {
      return;
    }

    const firstReview = reduce(
      minBy((review: Review) => new Date(review.publishedAt).getTime()),
      reviews[0],
      reviews
    );

    const timeToFirstReview = Math.round(
      (new Date(firstReview.publishedAt).getTime() -
        new Date(pr.createdAt).getTime()) /
        1000 /
        60 /
        60
    );

    const bucket = buckets.findIndex(x => x(timeToFirstReview));
    const bucketName = bucketNames[bucket];

    timeToFirstReviewPerPR[pr.number] = bucketName;
  });

  return timeToFirstReviewPerPR;
}

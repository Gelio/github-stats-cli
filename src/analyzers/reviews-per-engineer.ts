import { uniq } from 'ramda';

import { PullRequest, ReviewState } from '../types';

const acceptableReviewStates: ReviewState[] = ['APPROVED', 'CHANGES_REQUESTED'];

export function reviewsPerEngineer(prs: PullRequest[]) {
  const engineersReviews: Record<string, number> = {};

  prs.forEach(pr => {
    const reviewers = pr.reviews.nodes
      .filter(review => acceptableReviewStates.includes(review.state))
      .map(review => review.author.login)
      .filter(reviewer => reviewer !== pr.author.login);
    const uniqueReviewers = uniq(reviewers);

    uniqueReviewers.forEach(author => {
      engineersReviews[author] = (engineersReviews[author] || 0) + 1;
    });
  });

  return engineersReviews;
}

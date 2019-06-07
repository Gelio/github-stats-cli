import { uniq } from 'ramda';

import { PullRequest } from '../types';

export function reviewsPerEngineer(prs: PullRequest[]) {
  const engineersReviews: Record<string, number> = {};
  const syncRegexp = /sync/i;

  prs.forEach(pr => {
    if (syncRegexp.test(pr.title)) {
      return;
    }

    const reviewers = pr.reviews.nodes.map(review => review.author.login);
    const uniqueReviewers = uniq(reviewers);

    uniqueReviewers.forEach(author => {
      engineersReviews[author] = (engineersReviews[author] || 0) + 1;
    });
  });

  return engineersReviews;
}

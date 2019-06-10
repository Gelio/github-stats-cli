import { PullRequest } from '../types';

export function prsCreated(prs: PullRequest[]) {
  const prsCreatedPerEngineer: Record<string, number> = {};

  prs.forEach(pr => {
    const author = pr.author.login;

    prsCreatedPerEngineer[author] = (prsCreatedPerEngineer[author] || 0) + 1;
  });

  return prsCreatedPerEngineer;
}

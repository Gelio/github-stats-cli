export type ReviewState = 'APPROVED' | 'COMMENTED' | 'CHANGES_REQUESTED';

export interface User {
  login: string;
}

export interface Review {
  author: User;
  comments: {
    totalCount: number;
  };
  publishedAt: string;
  state: ReviewState;
}

export interface Label {
  name: string;
}

export interface GraphData<T extends object> {
  nodes: T[];
}

export interface PullRequest {
  number: number;
  permalink: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  mergedAt: string;
  changedFiles: number;
  additions: number;
  deletions: number;
  author: User;
  labels: GraphData<Label>;
  reviews: GraphData<Review>;
}

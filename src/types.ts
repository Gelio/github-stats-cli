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
  additions: number;
  author: User;
  changedFiles: number;
  closed: boolean;
  createdAt: string;
  deletions: number;
  labels: GraphData<Label>;
  merged: boolean;
  mergedAt: string;
  number: number;
  permalink: string;
  reviews: GraphData<Review>;
  title: string;
  updatedAt: string;
}

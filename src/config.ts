export const config = {
  repository: 'Facebook/react',
  timeRange: '2019-03-30T16:49:46Z..2019-06-06T16:49:46Z',
  authToken: process.env.AUTH_TOKEN,
  fileName: 'data.json',

  /**
   * Additional suffix to be added to the GraphQL query
   * @see https://help.github.com/en/articles/searching-issues-and-pull-requests
   */
  additionalQuerySuffix: 'base:master'
};

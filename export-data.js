const { readFileSync, writeFileSync } = require('fs');
const { basename } = require('path');
const csv = require('csv');

const fileName = process.argv[2];
if (!fileName) {
  console.error('Please provide the JSON file path as the first parameter');
  return;
}
console.log('Reading from', fileName);
const baseFileName = basename(fileName, '.json');

const data = JSON.parse(readFileSync(fileName, 'utf8'));

const prsRows = [];
const prStringifier = csv.stringify();
prStringifier.on('readable', () => {
  let row;
  while ((row = prStringifier.read())) {
    prsRows.push(row);
  }
});
prStringifier.on('finish', () => {
  writeFileSync(`${baseFileName}-prs.csv`, prsRows.join(''), 'utf8');
});

const reviewersRows = [];
const reviewersStringifier = csv.stringify();
reviewersStringifier.on('readable', () => {
  let row;
  while ((row = reviewersStringifier.read())) {
    reviewersRows.push(row);
  }
});
reviewersStringifier.on('finish', () => {
  writeFileSync(
    `${baseFileName}-reviewers.csv`,
    reviewersRows.join(''),
    'utf8'
  );
});

prStringifier.write([
  'number',
  'title',
  'permalink',
  'createdAt',
  'mergedAt',
  'updatedAt',
  'changedFiles',
  'additions',
  'deletions',
  'linesChanged',
  'author',
  'labels'
]);
reviewersStringifier.write([
  'prNumber',
  'reviewer',
  'publishedAt',
  'state',
  'comments'
]);

data.forEach(pr => {
  prStringifier.write([
    pr.number,
    pr.title,
    pr.permalink,
    pr.createdAt,
    pr.mergedAt,
    pr.updatedAt,
    pr.changedFiles,
    pr.additions,
    pr.deletions,
    pr.additions + pr.deletions,
    pr.author.login,
    pr.labels.nodes.map(node => node.name).join(',')
  ]);

  pr.reviews.nodes.forEach(review => {
    reviewersStringifier.write([
      pr.number,
      review.author.login,
      review.publishedAt,
      review.state,
      review.comments.totalCount
    ]);
  });
});

prStringifier.end();
reviewersStringifier.end();

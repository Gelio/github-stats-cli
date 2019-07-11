# GitHub PR stats CLI

## Features

1. Fetch PR data based on time range and repository
2. Export all PR data to CSV
3. Analyze PR data based on metrics:
   1. PRs created per user
   2. PRs reviewed per user
   3. Time between last review and merge for each PR
   4. Time to first review per PR
   5. Time to merge per PR
4. Substitute usernames (in case real names instead of GitHub usernames should be used in reports)

## Installation

1. Create `.env` file based on `.env.example` and paste your generated [GitHub OAuth Token](https://github.com/settings/developers)
2. Run `npm install`

## Usage

First, specify `repository` and `timeRange` in [config.ts](src/config.ts).

### Fetching PR data

To fetch PR data, run:

```sh
npx ts-node fetch-data.json
```

This will download all PR data from GitHub and store it in a file specified in
[config.ts](src/config.ts) (`data.json` by default).

### Exporting all PR data to CSV

To export all PR data to CSV, run:

```sh
npx ts-node export-data.ts [filename]
```

The `filename` should point to the file with PR data fetched in the previous step.

The command will generate 2 files:

- `filename-prs.csv` that contains data about all PRs updated in the configured time range
- `filename-reviewers.csv` that contains data about all reviewers for those PRs

### Analyzing PR data

To analyze PR data, run:

```sh
npx ts-node analyze-data.json [filename]
```

The `filename` should point to the file with PR data fetched in the previous step.

The command will generate multiple `filename-metric.csv` files. Each contains data related to a
different metric.

## Author

The author of this project is Grzegorz Rozdzialik.

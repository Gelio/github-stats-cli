import { readFileSync } from 'fs';
import { reviewsPerEngineer } from './src/analyzers/reviews-per-engineer';

const fileName = process.argv[2];
if (!fileName) {
  console.error('Please provide the JSON file path as the first parameter');
  process.exit(1);
}

const data = JSON.parse(readFileSync(fileName, 'utf8'));

try {
  const results = reviewsPerEngineer(data);

  Object.keys(results).forEach(author => {
    console.log(`${author},${results[author]}`);
  });
} catch (error) {
  console.error(error);
}

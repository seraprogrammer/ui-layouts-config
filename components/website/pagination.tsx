import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Read the JSON file
const docsData = JSON.parse(
  readFileSync(join(process.cwd(), 'configs/docs.json'), 'utf8')
); 
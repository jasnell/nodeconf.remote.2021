import { Pipeline } from './index.mjs';

const pipeline = Pipeline();

try {
  await pipeline(process.stdin, process.stdout);
  console.error('All done!');
} catch (error) {
  console.error('Oh no!', error.message);
}

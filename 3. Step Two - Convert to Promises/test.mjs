import { Pipeline } from './index.mjs';

const pipeline = Pipeline({
  key: Buffer.from('a'.repeat(64), 'hex'),
  iv: Buffer.from('b'.repeat(32), 'hex'),
});

try {
  await pipeline(process.stdin, process.stdout);
  console.error('All done!');
} catch (error) {
  console.error('Oh no!', error.message);
}

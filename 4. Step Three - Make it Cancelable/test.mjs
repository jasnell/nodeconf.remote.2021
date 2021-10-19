import { Pipeline } from './index.mjs';

const pipeline = Pipeline({
  key: Buffer.from('a'.repeat(64), 'hex'),
  iv: Buffer.from('b'.repeat(32), 'hex'),
});

try {
  const ac = new AbortController();

  // const p = pipeline(process.stdin, process.stdout, { signal: ac.signal });
  // ac.abort();
  // await p;

  await pipeline(process.stdin, process.stdout, { signal: ac.signal });

  console.error('All done!');
} catch (error) {
  console.error('Oh no!', error.message);
}

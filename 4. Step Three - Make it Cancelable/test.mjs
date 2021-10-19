import { Pipeline } from './index.mjs';

const pipeline = Pipeline();

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

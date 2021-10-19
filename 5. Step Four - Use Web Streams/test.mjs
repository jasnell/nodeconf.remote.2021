import { Pipeline } from './index.mjs';
import {
  Readable,
  Writable,
} from 'node:stream';

const pipeline = Pipeline();

try {
  const ac = new AbortController();


  await pipeline(
      Readable.toWeb(process.stdin),
      Writable.toWeb(process.stdout),
      { signal: ac.signal });

  console.log('All done!');
} catch (error) {
  console.error('Oh no!', error.message);
}
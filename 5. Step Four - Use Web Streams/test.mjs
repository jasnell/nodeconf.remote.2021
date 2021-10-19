import { Pipeline } from './index.mjs';
import {
  Readable,
  Writable,
} from 'node:stream';

const pipeline = Pipeline({
  key: Buffer.from('a'.repeat(64), 'hex'),
  iv: Buffer.from('b'.repeat(32), 'hex'),
});

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

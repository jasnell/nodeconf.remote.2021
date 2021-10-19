import { Pipeline } from './index.mjs';
import {
  Readable,
} from 'node:stream';
import {
  WritableStream,
} from 'node:stream/web';

const pipeline = Pipeline({ key: 'a'.repeat(64), iv: 'b'.repeat(32) });

try {
  const ac = new AbortController();

  await pipeline(
      Readable.toWeb(process.stdin),
      wrapStdout(),
      { signal: ac.signal });

  console.log('All done!');
} catch (error) {
  console.error('Oh no!', error.message);
}

function wrapStdout() {
  return new WritableStream({
    async write(chunk) {
      await new Promise((resolve, reject) => {
        process.stdout.write(chunk, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    }
  });
}

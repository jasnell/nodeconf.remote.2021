import {
  DecompressionStream,
  TransformStream,
  WritableStream,
} from 'stream/web';

import {
  Duplex,
  Readable,
  Writable,
} from 'stream';

import { webcrypto } from 'crypto';
import { createGunzip } from 'zlib';

const {
  subtle: { importKey, decrypt }
} = webcrypto;

function createDecipher() {
  return new TransformStream({
    async start() {
      this.cipherKey =
        await importKey(
          'raw',
          Buffer.from('a'.repeat(64), 'hex'),
          { name: 'AES-CTR' },
          false,
          [ 'decrypt' ]);
    },
    async transform(chunk, controller) {
      controller.enqueue(
        await decrypt(
          {
            name: 'AES-CTR',
            counter: Buffer.from('b'.repeat(32), 'hex'),
            length: 128,
          },
          this.cipherKey,
          chunk));
    },
    flush(controller) {
      controller.terminate();
    }
  });
}

function getToBuffer() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(Buffer.from(chunk));
    }
  });
}

let stream = Readable.toWeb(process.stdin);
stream = stream.pipeThrough(createDecipher());
//stream = stream.pipeThrough(new DecompressionStream('gzip'));
stream = stream.pipeThrough(getToBuffer());
await stream.pipeTo(Writable.toWeb(process.stdout));

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

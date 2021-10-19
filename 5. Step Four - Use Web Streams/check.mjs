import {
  DecompressionStream,
} from 'stream/web';

import {
  Readable,
  Writable,
  Duplex,
} from 'stream';

import { createDecipheriv } from 'crypto';

const decipher =
  createDecipheriv(
    'aes256',
    Buffer.from('a'.repeat(64), 'hex'),
    Buffer.from('b'.repeat(32), 'hex'));

let stream = Readable.toWeb(process.stdin);
stream = stream.pipeThrough(Duplex.toWeb(decipher));
stream = stream.pipeThrough(new DecompressionStream('gzip'));
stream.pipeTo(Writable.toWeb(process.stdout));

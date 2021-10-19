// This module takes an input stream of binary data, interprets it as utf8 text,
// compresses it, encrypts it, then streams the resulting data back out.

import {
  pipeline,
} from 'node:stream';
import {
  createGzip,
} from 'node:zlib';
import {
  createCipheriv,
  randomFillSync,
} from 'node:crypto';

function getOption(options, name, length) {
  if (options[name] !== undefined) {
    if (typeof options[name] === 'string') {
      options[name] = Buffer.from(options[name], 'hex');
    }
    if (options[name].length !== length) {
      throw new RangeError(`The ${name} must be ${length} bytes`);
    }
    return options[name];
  }
  return randomFillSync(Buffer.allocUnsafe(length));
}

export function Pipeline(options = {}) {
  const key = getOption(options, 'key', 32);
  const iv = getOption(options, 'iv', 16);
  return function(source, destination, callback) {
    source.setEncoding('utf8');
    const gzip = new createGzip();
    const cipher = new createCipheriv('aes256', key, iv);
    return pipeline(source, gzip, cipher, destination, callback);
  }
}

// This module takes an input stream of binary data, interprets it as utf8 text,
// compresses it, encrypts it, then streams the resulting data back out.

import {
  CompressionStream,
  TextDecoderStream,
  TransformStream,
} from 'node:stream/web';
import {
  Duplex,
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

function getCompressionStreamOrPolyfill() {
  if (typeof CompressionStream === 'function') {
    return new CompressionStream('gzip');
  }
  return Duplex.toWeb(createGzip());
}

function getCipherStream(key, iv) {
  const cipher = createCipheriv('aes256', key, iv);

  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(cipher.update(chunk));
    },
    flush(controller) {
      controller.enqueue(cipher.final());
      controller.terminate();
    }
  });
}

export function Pipeline(options = {}) {
  const key = getOption(options, 'key', 32);
  const iv = getOption(options, 'iv', 16);
  return async function(source, destination, options = {}) {
    const { signal } = { ...options };
    if (signal) {
      if (typeof signal?.addEventListener !== 'function') {
        throw new TypeError('The signal must be an AbortSignal!');
      }
      if (signal.aborted) {
        throw new Error('The abort signal has already been triggered!');
      }
    }

    source = source.pipeThrough(new TextDecoderStream('utf-8'), { signal });
    source = source.pipeThrough(getCompressionStreamOrPolyfill(), { signal });
    source = source.pipeThrough(getCipherStream(key, iv));
    return source.pipeTo(destination, { signal });
  }
}

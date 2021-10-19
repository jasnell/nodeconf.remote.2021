const { pipeline } = require('stream');
const { createDecipheriv } = require('crypto');
const { createGunzip } = require('zlib');

const gzip = createGunzip();

//const decipher = createDecipheriv('aes256', Buffer.from('a'.repeat(64), 'hex'), Buffer.from('b'.repeat(32), 'hex'));

pipeline(process.stdin, /*decipher, */ gzip, process.stdout, (err) => {
  console.log(err)
});

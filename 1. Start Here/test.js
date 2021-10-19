const Pipeline = require('./index');

const pipeline = Pipeline({
  key: Buffer.from('a'.repeat(64), 'hex'),
  iv: Buffer.from('b'.repeat(32), 'hex'),
});

pipeline(process.stdin, process.stdout, (err) => {
  if (err) {
    console.error('Oh no!', err.message);
    return;
  }

  console.error('All done!');
});

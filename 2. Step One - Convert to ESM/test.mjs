import { Pipeline } from './index.mjs';

const pipeline = Pipeline();

pipeline(process.stdin, process.stdout, (err) => {
  if (err) {
    console.error('Oh no!', err.message);
    return;
  }

  console.error('All done!');
});

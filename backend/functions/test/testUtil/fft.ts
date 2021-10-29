import fft = require('firebase-functions-test');

const test = fft();

after(() => {
  test.cleanup();
});

export default test;

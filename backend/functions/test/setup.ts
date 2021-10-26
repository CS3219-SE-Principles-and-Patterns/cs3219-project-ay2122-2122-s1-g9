import fft = require('firebase-functions-test');

const test = fft();

after(async () => {
  test.cleanup();
});

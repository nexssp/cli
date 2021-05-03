Array.prototype.forEachAsyncFunc = async function(fn) {
  for (let el of this) {
    await fn(el);
  }
};

Array.prototype.forEachAsyncParallelFunc = async function(fn) {
  await Promise.all(this.map(fn));
};

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// https://exploringjs.com/es2018-es2019/ch_asynchronous-iteration.html
async function* createAsyncIterable(syncIterable) {
  for (const elem of syncIterable) {
    yield elem;
  }
}

// const asyncGenObj = createAsyncIterable(["a", "b"]);
// const [{ value: v1 }, { value: v2 }] = await Promise.all([
//   asyncGenObj.next(),
//   asyncGenObj.next()
// ]);
// console.log(v1, v2); // a b

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of

// var asyncIterable = {
//   [Symbol.asyncIterator]() {
//     return {
//       i: 0,
//       next() {
//         if (this.i < 3) {
//           return Promise.resolve({ value: this.i++, done: false });
//         }

//         return Promise.resolve({ done: true });
//       }
//     };
//   }
// };

// (async function() {
//   for await (let num of asyncIterable) {
//     console.log(num);
//   }
// })();

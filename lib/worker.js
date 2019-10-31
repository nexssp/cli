// https://github.com/nodejs/node/pull/20876
// index.js
// run with node --experimental-worker index.js on Node.js 10.x

// Workers are useful for performing CPU-intensive JavaScript operations;
// do not use them for I/O, since Node.js’s built-in mechanisms for performing
// operations asynchronously already treat it more efficiently than Worker threads can.

const { Worker } = require("worker_threads");

function runService(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./workerThreadsService.js", { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function run() {
  const result = await runService("world");
  console.log(result);
}

run().catch(err => console.error(err));

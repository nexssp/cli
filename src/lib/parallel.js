class Parallel {
  constructor(channel = "MyChannel") {
    process.tasks = process.tasks || {};

    // console.log(process.tasks);
  }

  addTask(id, task, channel = "MyChannel") {
    process.tasks[channel] = process.tasks[channel] || [];
    process.tasks[channel].push({ id, taskPromise: task() });
  }

  async wait(channel = "MyChannel") {
    console.log("Waiting: ", ...process.tasks[channel]);
    let result = await Promise.allSettled(
      process.tasks[channel].map((e) => e.taskPromise)
    ).catch((e) => console.log("Nexss Programmer: Error", e));

    return result;
  }
}

(async () => {
  const P = new Parallel();
  P.addTask(
    "A",
    async () =>
      new Promise((resolve, reject) => {
        setInterval(() => {
          resolve("TaskID: A");
        }, 2000);
      })
  );

  P.addTask(
    "B",
    async () =>
      new Promise((resolve, reject) => {
        setInterval(() => {
          resolve("TaskID: B");
        }, 1000);
      })
  );

  P.addTask(
    "C",
    async () =>
      new Promise((resolve, reject) => {
        setInterval(() => {
          reject("TaskID: CCCCC");
        }, 1000);
      })
  );

  P.addTask(
    "D2",
    async () =>
      new Promise((resolve, reject) => {
        setInterval(() => {
          resolve("TaskID: D2");
        }, 5000);
      }),
    "Channel1234"
  );

  P.addTask(
    "D3",
    async () =>
      new Promise((resolve, reject) => {
        setInterval(() => {
          resolve("TaskID: D3");
        }, 2500);
      }),
    "Channel1234"
  );

  console.log(`Waiting for finish:My Channel`);
  const MyChannel = await P.wait("MyChannel");
  //   const B = await P.wait("B");
  console.log("A:", MyChannel[0], "B:", MyChannel[1], "C:", MyChannel[2]);
  console.log("Waiting longer...");
  const XXXX = await P.wait("Channel1234");
  console.log("XXXX1:", XXXX[0], "XXXX2:", XXXX[1]);
  process.exit(0);
})().then((e) => {
  console.log("xxxxxxxxxxxxxxxxxxxxx");
  console.log(
    process._getActiveHandles(),
    "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii\n\n\n",
    process._getActiveRequests()
  );
});

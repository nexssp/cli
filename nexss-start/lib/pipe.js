async function run(operations, options = {}) {
  if (cliArgs.nxsTime) {
    process.nxsTime = process.hrtime();
  }

  process.nxsOut = cliArgs.nxsOut;
  delete cliArgs.nxsOut;

  const { pipeline } = require("stream");
  // Below must be like that! for EVAL
  const { transformNexss } = require("./transformNexssASync");
  const { transformError } = require("./transformError");
  const { transformFile } = require("./transformFile");
  const { writeableStdout } = require("./writeableStdout");
  const { transformTest } = require("./transformTest");
  const { transformValidation } = require("./transformValidation");
  const { transformInput } = require("./transformInput");
  const { transformOutput } = require("./transformOutput");
  const { transformHash } = require("./transformHash");
  const { transformRequest } = require("./transformRequest");
  // const { transformParse } = require("./transformParseDELETED");
  const { readable } = require("./readable");
  const { cleanup } = require("./output/nxsOutputParams");
  const { blue, bold } = require("@nexssp/ansi");
  const util = require("util");
  const pipelineAsync = util.promisify(pipeline);

  // Below is for relative dirs in the .nexss files
  // This will need to be changed to the distributed systems
  console.time(bold(cyan("Nexss P"), bold("rogrammer")));

  const finalOperations = operations.map((element, index) => {
    // We get last index of transformOutput as some parameters
    // passed in the commandline directly only should be applied in the
    // last transform output eg. nxsFields, nxsField etc.
    let lastIndex;
    for (let x = 0; x < operations.length; x++) {
      if (operations[x].stream == "transformOutput") {
        lastIndex = x;
      }
    }
    let streamName = element.stream || "transformNexss";
    let args = element.args || [];

    // Arguments from command line on run
    let paramsNumber = 4;
    if (process.argv[2] !== "s" && process.argv[2] !== "start") {
      paramsNumber = 3;
    }

    if (!options.nxsBuild) {
      let terminalParams = process.argv.slice(paramsNumber);
      // We filter transformOutput params passed from terminal
      // This needs to be done as some packages are built from
      // many modules and transform output streams are used also there.
      if (index != lastIndex) {
        terminalParams = cleanup(terminalParams);
      }

      args = args.concat(terminalParams);
    }
    // We add ' to attributes which contains code to execute
    const sign = process.platform === "win32" ? `"` : `'`;
    args = args.map((e) => {
      return e.includes &&
        e.includes("${") &&
        !e.startsWith("'") &&
        !e.startsWith("--")
        ? `${sign}${e}${sign}`
        : e;
    });

    const runOptions = Object.assign({}, options, {
      fileName: element.fileName,
      cwd: element.cwd,
    });

    runOptions.inputData = element.inputData;

    if (element.data) {
      if (runOptions.inputData) {
        Object.assign(runOptions.inputData, element.data);
      } else {
        runOptions.inputData = element.data;
      }
    }
    runOptions.env = Object.assign({}, process.env, element.env);

    if (element.cmd) {
      return eval(streamName)(element.cmd, args, runOptions);
    } else {
      return eval(element)(runOptions);
    }
  });
  const { PassThrough, Readable } = require("stream");

  // Below are 2 versions for of look and Async Pipeline
  if (1) {
    let nPipe;
    // We get Readable Stream
    nPipe = finalOperations.shift();

    // nPipe = process.openStdin();
    const EventEmitter = require("events");
    const EE = new EventEmitter();
    EE.on("go", (e) => console.log("==============================", e));
    // log.di(`nPipe-stdin open`);
    let previousFrom = "";
    try {
      for (let pipe of finalOperations) {
        // log.di(`nPipe-stdin :pipe`, Object.keys(pipe));
        // if (process.NEXSS_WAIT) {
        // }

        nPipe = nPipe.pipe && nPipe.pipe(pipe);

        if (cliArgs.nxsDebugData && nPipe instanceof Readable) {
          var PTrough = new PassThrough({ objectMode: true });
          PTrough.on("data", (x) => {
            // First: don't display doubles (like cancel stream.)
            if (x.from !== previousFrom) {
              // Second: search by name of the stream data comes from.
              if (
                ~x.from.indexOf(
                  typeof cliArgs.nxsDebugData !== "boolean"
                    ? cliArgs.nxsDebugData
                    : ""
                )
              )
                EE.emit("go", x);
            }
            previousFrom = x.from;
          });
          nPipe.pipe(PTrough);
        }

        // nPipe = PTrough;
        if (nPipe) {
          pipe.on("error", (e) =>
            console.log(bold(cyan("Nexss P"), bold("rogrammer")), e)
          );
          // DebugData.pipe(nPipe);
        }

        //  nPipe.pipe(DebugData, { end: false });
      }
    } catch (ex) {
      console.log(`Error in PIPE: pipe.js`, ex);
    }

    nPipe.on("finish", (e) => {
      if (process.argv.includes("--debug")) {
        process.stdout.write("\n");
        console.timeEnd(bold(cyan("Nexss P"), bold("rogrammer")));
      }
    });
  } else {
    await pipelineAsync(
      // process.stdin,
      ...finalOperations
    )
      .then((e) => {
        if (process.argv.includes("--debug")) {
          process.stdout.write("\n");
        }
        if (
          process.argv.includes("--nxsTime") ||
          process.argv.includes("--debug")
        ) {
          console.timeEnd(bold(cyan("Nexss P"), bold("rogrammer")));
        }
      })
      .catch((err) => {
        // This is handled by nexss transform as all errors are parsed
        // based on language - this can be used maybe to better debug ?
        console.error(bold(cyan("Nexss P"), bold("rogrammer")), err);
        // console.error("Nexss last error: ", process.cwd());
        process.exitCode = 1;
      });
  }

  return;
}

module.exports.run = run;

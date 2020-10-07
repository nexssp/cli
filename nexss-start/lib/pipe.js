async function run(operations, options = {}) {
  const { pipeline } = require("stream");
  // Below must be like that! for EVAL
  const { transformNexss } = require("./transformNexss");
  const { transformError } = require("./transformError");
  const { transformFile } = require("./transformFile");
  const { writeableStdout } = require("./writeableStdout");
  const { transformTest } = require("./transformTest");
  const { transformValidation } = require("./transformValidation");
  const { transformInput } = require("./transformInput");
  const { transformOutput } = require("./transformOutput");
  const { transformHash } = require("./transformHash");
  const { transformRequest } = require("./transformRequest");
  const { readable } = require("./readable");
  const { cleanup } = require("./output/nxsOutputParams");
  const { blue, bold } = require("@nexssp/ansi");
  const util = require("util");
  const pipelineAsync = util.promisify(pipeline);

  // Below is for relative dirs in the .nexss files
  // This will need to be changed to the distributed systems
  console.time(blue("Nexss Programmer"));
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

  await pipelineAsync(
    // process.stdin,
    ...finalOperations
  )
    .then((e) => {
      if (process.argv.includes("--debug")) {
        process.stdout.write("\n");
        console.timeEnd(blue("Nexss Programmer"));
      }
    })
    .catch((err) => {
      // This is handled by nexss transform as all errors are parsed
      // based on language - this can be used maybe to better debug ?
      console.error(blue("\nNexss Programmer: "), err);
      // console.error("Nexss last error: ", process.cwd());
      process.exitCode = 1;
    });
  return;
}

module.exports.run = run;

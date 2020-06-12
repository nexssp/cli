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

const util = require("util");
const pipelineAsync = util.promisify(pipeline);

async function run(operations, options = {}) {
  await pipelineAsync(
    // process.stdin,
    ...operations.map((element) => {
      let streamName = element.stream || "transformNexss";
      let args = element.args || [];

      // Arguments from command line on run
      let paramsNumber = 4;
      if (process.argv[2] !== "s" && process.argv[2] !== "start") {
        paramsNumber = 3;
      }

      if (!options.build) args = args.concat(process.argv.slice(paramsNumber));

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

      // console.log(runOptions);
      // process.exit(1);
      // if (streamName === "transformValidation") {
      //   delete runOptions.env;
      //   // console.log("run options", runOptions);
      // }
      if (element.cmd) {
        // console.log("========================1");
        // let ro = runOptions;
        // delete ro.env;
        // console.error("first", ro);

        return eval(streamName)(element.cmd, args, runOptions);
      } else {
        if (typeof element === "function") {
          return eval(element)(runOptions);
          // console.error("second", strResult);
        } else {
          return eval(element)(runOptions);
        }
      }
    })
  )
    .then((e) => {
      // console.log(e);
      // if (!options.quiet) {
      //   spin.succeed("Completed Nexss Sequence.");
      //   spin.stop();
      //   console.timeEnd("nexss");
      // }
    })
    .catch((err) => {
      // This is handled by nexss transform as all errors are parsed
      // based on language - this can be used maybe to better debug ?
      console.error("Nexss last error: ", err);
      console.error("Nexss last error: ", process.cwd());
      process.exit();
    });

  // console.timeEnd("nexss");
  // WARNING!!!!! here was process.exit(0)
  // but didn't show the whole error so return (should be return not process.exit)
  return;
}

module.exports.run = run;

const { pipeline } = require("stream");
// Below must be like that! for EVAL
const { transformNexss } = require("./transformNexss");
const { transformError } = require("./transformError");
const { transformFile } = require("./transformFile");
const { writeableStdout } = require("./writeableStdout");
const { transformTest } = require("./transformTest");
const { transformValidation } = require("./transformValidation");
const { transformOutput } = require("./transformOutput");
const { transformHash } = require("./transformHash");
const { transformRequest } = require("./transformRequest");
const { readable } = require("./readable");

const util = require("util");
const pipelineAsync = util.promisify(pipeline);

async function run(operations, options = {}) {
  await pipelineAsync(
    // process.stdin,
    ...operations.map(element => {
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
        cwd: element.cwd
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
        // console.log("========================1");
        return eval(streamName)(element.cmd, args, runOptions);
        // console.error("first", strResult);
      } else {
        if (typeof element === "function") {
          return eval(element)(runOptions);
          // console.error("second", strResult);
        } else {
          return eval(element)();
        }
      }
    })
  )
    .then(e => {
      // console.log(e);
      // if (!options.quiet) {
      //   spin.succeed("Completed Nexss Sequence.");
      //   spin.stop();
      //   console.timeEnd("nexss");
      // }
    })
    .catch(err => {
      // This is handled by nexss transform as all errors are parsed
      // based on language - this can be used maybe to better debug ?
      console.error("Nexss last error: ", err);
      // process.exit();
    });

  // console.timeEnd("nexss");
  // WARNING!!!!! here was process.exit(0)
  // but didn't show the whole error so return (should be return not process.exit)
  return;
}

module.exports.run = run;

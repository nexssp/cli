const { pipeline } = require("stream");
const { transformNexss } = require("./transformNexss");
const { transformError } = require("./transformError");
const { transformFile } = require("./transformFile");
const { writeableStdout } = require("./writeableStdout");
const { transformTest } = require("./transformTest");
const { transformValidation } = require("./transformValidation");
const { transformOutput } = require("./transformOutput");
const { readable } = require("./readable");

const util = require("util");
const { is } = require("../../lib/data/guard");
const pipelineAsync = util.promisify(pipeline);
const compose = (...fns) => stream =>
  fns.reduce((transformed, fn) => transformed.pipe(fn), stream);
// options: quiet - no output to stdout
// const cliArgs = require("minimist")(process.argv.slice(3));

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
        args = args.filter(a => !a.startsWith("--nxs"));
        // runOptions.env = "disable this line to see env.";
        // console.log(
        //   "========================",
        //   streamName,
        //   args.filter(a => !a.startsWith("--nxs")),
        //   element.cmd,
        //   runOptions
        // );
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
      // Bellow will give undefined!!!!
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

// const operations = [
//   process.stdin, // or fs.createReadStream('/some/file/name.txt')
//   //   { stream: "transformNexss", cmd: "perl", args: ["testPerl.pl"] },
//   { stream: "transformNexss", cmd: "php", args: ["testPHP.php"] },
//   //   { stream: "transformNexss", cmd: "julia", args: ["testJulia.jl"] },
//   { stream: "transformNexss", cmd: "ruby", args: ["testRuby.rb"] },
//   { stream: "transformNexss", cmd: "node", args: ["testNode.js"] },
//   { stream: "transformError", cmd: "Some title" }
// ];

// run(operations, { quiet: false }).catch(e => console.error(e));

module.exports.run = run;

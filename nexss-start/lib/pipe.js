const { pipeline } = require("stream");
const { transformNexss } = require("./transformNexss");
const { transformError } = require("./transformError");
const { transformFile } = require("./transformFile");
const { writeableStdout } = require("./writeableStdout");
const util = require("util");
const { is } = require("../../lib/data/guard");
// const finishedP = util.promisify(finished);
const pipelineAsync = util.promisify(pipeline);
// const ora = require("ora");
// below doesnt work as is not sync like pipeline. To check ??
const compose = (...fns) => stream =>
  fns.reduce((transformed, fn) => transformed.pipe(fn), stream);
// options: quiet - no output to stdout
// const cliArgs = require("minimist")(process.argv.slice(3));
// let spin = ora(`Run Nexss Sequence..`);

async function run(operations, options = {}) {
  let result = await pipelineAsync(
    // process.stdin,
    ...operations.map(element => {
      // if (options.verbose) {
      //   console.log("VERBOSE: ", fileName, element);
      // }
      let streamName = element.stream || "nexssTransform";
      let args = element.args || [];
      // if (element.cwd) {
      //   process.chdir(element.cwd);
      //   console.log("CHANGED DIR", element.cwd);
      // }

      // Arguments from command line on run
      let paramsNumber = 4;
      if (process.argv[2] !== "s" && process.argv[2] !== "start") {
        paramsNumber = 3;
      }
      if (!options.build) args = args.concat(process.argv.slice(paramsNumber));

      const runOptions = Object.assign({}, options, {
        fileName: element.fileName
      });
      // console.log("eeeeeeeeeeeeeeeeeeeeeee", element);
      if (element.cmd) {
        // Why eval?
        // console.log(
        //   "command!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        //   streamName,
        //   element.cmd,
        //   args
        // );
        return eval(streamName)(element.cmd, args, runOptions);
      } else {
        if (typeof element === "function") {
          // console.log("FUUUUUUUUUUUUNNNCCTTTIONN", util.inspect(element));
          return eval(element(runOptions));
        }
        return element;
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
      // console.error("Nexss last error: ", err);
      // process.exit(1);
    });

  // console.timeEnd("nexss");
  // process.exit(0);
  // WARNING!!!!! here was process.exit(0)
  // but didn't show the whole error so return (should be return not process.exit)
  return;
  // spin.succeed("Completed Nexss Sequence.");
  // spin.stop();
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

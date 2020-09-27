const { Transform } = require("stream");
// NOTE: below showing that are not used, but they ARE!!!
const {
  dy,
  dbg,
  success,
  warn,
  error,
  ok,
  info,
  trace,
  isErrorPiped,
} = require("../../lib/log");
const { colorizer } = require("./colorizer");
const { bold, yellow, red } = require("@nexssp/ansi");
require("../../lib/arrays");
const { spawn } = require("child_process");
const { is } = require("../../lib/data/guard");
const { defaultExecuteOptions } = require("../../config/defaults");
const { Proc } = require("../../lib/proc");
const path = require("path");
// const { promisify } = require("util");
const { parseError } = require("./error");
const isDebug = process.argv.indexOf("--debug") >= 0;
const isLearningMode = process.argv.indexOf("--nxsLearning") >= 0;
const cliArgsParser = require("minimist");
const { nxsDebugTitle } = require("./output/nxsDebug");
const { timeElapsed } = require("../../nexss-start/lib/output/nxsTime");
module.exports.transformNexss = (
  cmd, // cmd = ls, node, php or whatever
  args = [], // arguments eg. ["--help", "myfile.php"]
  {
    quiet = false,
    fileName = undefined,
    inputData,
    cwd,
    env,
  } = defaultExecuteOptions
) => {
  return new Transform({
    transform(chunk, encoding, callback) {
      let startStreamTime;
      if (process.argv.includes("--nxsTime")) {
        startStreamTime = process.hrtime();
      }

      const self = this;
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }

      let options = Object.assign({});

      if (process.argv.includes("--nxsOnly")) {
        // We get stdin from user.
        options.stdio = ["inherit", "pipe", "pipe"];
      } else {
        options.stdio = ["pipe", "pipe", "pipe"];
      }

      options.detached = false;
      if (process.platform === "win32") {
        options.shell = true;
      } else {
        options.shell = "/bin/bash";
      }
      cwd = eval("`" + cwd.replace(/\\/g, "/") + "`");
      options.cwd = cwd;
      options.env = "SEE: process.env";

      if (!quiet) {
        dy("Current working dir: ", process.cwd());
        console.error(
          `Spawning ${cmd} ${args ? args.join(" ") : ""} options: `,
          JSON.stringify(options)
        );
      }
      if (isLearningMode) {
        args = args.remove("--nxsLearning");
        const commandLearning = `${cmd} ${args ? args.join(" ") : ""}`;
        console.error(`Execute: ${bold(commandLearning)}`);
      }

      options.env = env;
      // args = args.filter(e => e !== "--test");

      process.nexssCWD = cwd;

      args2 = args.remove("--nocache");
      args2 = args2.remove("--nxsPipeErrors");
      args2 = args2.remove("--nxsTest");

      let argsStrings;
      if (process.platform === "win32") {
        argsStrings = args2.map((a) =>
          a.indexOf("=") > -1 ? `${a.replace("=", '="')}"` : a
        );
      } else {
        argsStrings = args2.map((a) =>
          a.indexOf("=") > -1 ? `${a.replace("=", "='")}'` : a
        );
      }

      const nexssCommand = `${cmd} ${argsStrings.join(" ")}`;
      process.nexssCMD = nexssCommand;
      let startCompilerTime;
      //Yes startStreamTime below
      if (startStreamTime) {
        // nxsTime
        startCompilerTime = process.hrtime();
      }

      this.worker = spawn(cmd, argsStrings, options);
      this.worker.cmd = nexssCommand;
      this.worker.on("error", (err) => {
        // throw Error(err);
        switch (err.code) {
          case "ENOENT":
            throw `${err.path} not found. Command: ${cmd} ${args.join(" ")}`;
          default:
            throw `Failed to start subprocess. ${err}`;
        }
      });

      this.worker.stderr.on("data", function (err) {
        const errorString = err.toString();
        if (errorString.includes("NEXSS/")) {
          const exploded = errorString.split("NEXSS");
          exploded.forEach((element) => {
            if (!element) return;
            if (element.substring(0, 1) === "/") {
              let nexssError = element + "";
              nexssError = nexssError.substring(1);
              nexssError = nexssError.split(":");
              let type = nexssError.shift();
              if (isErrorPiped) {
                console.log(nexssError.join(":").trim());
              } else {
                switch (type) {
                  case "debug":
                    type = "dbg";
                    break;
                  default:
                    break;
                }
                eval(type)(colorizer(nexssError.join(":").trim()));
              }
            } else {
              parseError(
                fileName,
                element,
                args.includes("--nxsPipeErrors"),
                process.nexssCWD
              );
            }
          });
          // this.errBuffer = "";
        } else {
          process.nxsErrorExists = true;
          this.errBuffer = this.errBuffer || "";
          this.errBuffer += err.toString();
          // if (this.errBuffer)
          //   parseError(fileName, this.errBuffer, args.includes("--pipeerrors"));
          // this.errBuffer = "";
        }
      });

      this.worker.stdout.on("data", function (data) {
        // TODO: Check if trim is ok here
        timeElapsed(startCompilerTime, `Response from ${bold(nexssCommand)}`);

        if (cmd === "bash") {
          // self.push(data.toString().trim().replace(/\n/g, "\n\r"));
          self.push(data);
          return;
        }

        const outputString = data.toString("utf8");
        // On Powershellthere is additional extra line which cousing a lot of headache..
        // Anyways we do not want to run empty line through
        // console.log("outputString", outputString);
        if (outputString !== "\n") {
          self.push(outputString); //.trim removed (some distored output eg blender compiler)
        }
      });

      // self.pipe(this.worker);

      this.worker.stderr.on("end", function () {
        if (this.errBuffer) {
          parseError(
            fileName,
            this.errBuffer,
            args.includes("--nxsPipeErrors"),
            process.cwd()
          );
          if (!process.argv.includes("--nxsPipeErrors")) {
            callback(red("Error: ") + bold(nexssCommand));
          } else {
            // callback(null, "Error during5: " + nexssCommand);
          }
          this.errBuffer = "";
        }
      });

      //   this.worker.stdout.on("end", () => {
      //     this.bufferCompleted = true;
      //   });

      this.worker.on("exit", () => {
        self.end();
        // timeElapsed(startStreamTime, "End of Stream");
        if (
          process.nxsErrorExists &&
          !process.argv.includes("--nxsPipeErrors")
        ) {
          // console.log("There was an error during run..", this.worker.cmd);
          return;
        } else {
          callback();
        }
      });

      try {
        // console.error(chunk);
        j = JSON.parse(chunk.toString());

        const { expressionParser } = require("./expressionParser");
        Object.keys(j).forEach((e) => {
          j[e] = expressionParser(j, j[e]);
        });

        this.worker.stdin.write(Buffer.from(JSON.stringify(j)));
      } catch (error) {
        dbg(`ERROR WRITING TO PIPE: ${chunk}`);
      }

      nxsDebugTitle("Executed: " + this.worker.cmd, j, "yellow");

      if (this.worker.stdin) this.worker.stdin.end();

      dbg("waiting for ", this.worker.cmd);
    },
    flush(cb) {
      cb();
      // console.log("flush!!!!!");
    },
  });
};

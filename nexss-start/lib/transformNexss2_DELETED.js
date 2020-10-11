const { defaultExecuteOptions } = require("../../config/defaults");
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
  require("../../lib/arrays");
  const { spawn } = require("child_process");

  const { parseError } = require("./error");
  const learning = require("./learning");
  const { nxsDebugTitle } = require("./output/nxsDebug");
  const { timeElapsed } = require("./output/nxsTime");
  return new Transform({
    transform(chunk, encoding, callback) {
      const argsDisplay = args.filter((e) => !e.includes("--debug")).join(" ");

      if (process.NEXSS_CANCEL_STREAM) {
        log.dr(`× Canceled Stream: ${cmd} ${argsDisplay}`);
        callback(null, chunk);
        return;
      } else {
        log.di(`↳ Stream:transformNexss: ${cmd} ${argsDisplay}`);
      }
      let startStreamTime;
      if (process.argv.includes("--nxsTime")) {
        startStreamTime = process.hrtime();
      }

      const self = this;
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }

      let options = Object.assign({});

      if (process.argv.includes("--nxsI")) {
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

      // TODO: eval?
      if (cwd && cwd.replace) cwd = eval("`" + cwd.replace(/\\/g, "/") + "`");
      options.cwd = cwd;
      // Below just to hide on debug
      options.env = "SEE: process.env";

      if (!quiet) {
        log.dy("Current working dir: ", process.cwd());
        console.error(
          `Spawning ${cmd} ${args ? args.join(" ") : ""} options: `,
          JSON.stringify(options)
        );
      }

      learning.note(`Execute: ${bold(`${cmd} ${args ? args.join(" ") : ""}`)}`);

      options.env = env;
      process.nexssCWD = cwd;
      let args2 = args.remove("--nocache");
      args2 = args2.remove("--nxsPipeErrors");
      args2 = args2.remove("--nxsTest");

      let argsStrings;
      if (process.platform === "win32") {
        argsStrings = args2.map((a) =>
          ~a.indexOf("=") ? `${a.replace("=", '="')}"` : a
        );
      } else {
        argsStrings = args2.map((a) =>
          ~a.indexOf("=") ? `${a.replace("=", "='")}'` : a
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
      options.maxBuffer = 1024 * 1024 * 100;
      options.highWaterMark = 1024 * 1024 * 100;

      // dy(`Spawning ..${cmd}`, argsStrings.join(" "), "cwd: ", process.cwd());
      this.worker = spawn(cmd, argsStrings, options);
      this.worker.cmd = nexssCommand;
      this.worker.on("error", (err) => {
        // throw Error(err);
        switch (err.code) {
          case "ENOENT":
            throw `TRANSFORM_nexss:${
              err.path
            } not found. Command: ${cmd} ${args.join(" ")}`;
          default:
            throw `TRANSFORM_nexss:Failed to start subprocess. ${err}`;
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
      let totalData = "";
      this.worker.stdout.on("data", function (data) {
        // TODO: Check if trim is ok here
        // totalData += data.toString();
        // log.dg(
        //   `<< Data: ${bold(data.length + " B.")}, cmd: ${process.nexssCMD}`
        // );
        timeElapsed(startCompilerTime, `Response from ${bold(nexssCommand)}`);

        if (cmd === "bash") {
          // self.push(data.toString().trim().replace(/\n/g, "\n\r"));
          self.push(data);
          return;
        }
        const outputString = data.toString("utf8");
        // On Powershell there is additional extra line which cousing a lot of headache..
        // Anyways we do not want to run empty line through
        // console.log("outputString", outputString);
        if (outputString !== "\n") {
          self.push(outputString); //.trim removed (some distored output eg blender compiler)
        }
      });

      // self.pipe(this.worker);
      // !!NOTE: Below can't be 'finish' as it's not showing all errors.
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

      // this.worker.on("close", () => {
      //   timeElapsed(startCompilerTime, `Close Worker ${bold(nexssCommand)}`);
      // });

      this.worker.on("close", () => {
        timeElapsed(
          startCompilerTime,
          `Close/End Worker ${bold(nexssCommand)}`
        );
        self.push(totalData);
        self.end();

        if (
          process.nxsErrorExists &&
          !process.argv.includes("--nxsPipeErrors")
        ) {
          // console.log("There was an error during run..", this.worker.cmd);
          process.NEXSS_ERROR_STREAM = "Error.";
          process.NEXSS_CANCEL_STREAM = "Error.";
          return;
        } else {
          callback();
        }
      });

      const json = require("../../lib/data/json");
      j = json.parse(chunk.toString());
      try {
        // console.error(chunk);

        const { expressionParser } = require("./expressionParser");
        Object.keys(j).forEach((e) => {
          j[e] = expressionParser(j, j[e]);
        });

        this.worker.stdin.write(Buffer.from(JSON.stringify(j)));
      } catch (error) {
        log.dbg(`ERROR WRITING TO PIPE: ${chunk}`);
      }

      nxsDebugTitle(" ! Executed: " + this.worker.cmd, j, "yellow");

      if (this.worker.stdin) this.worker.stdin.end();

      log.dy(`${yellow(bold("⇋ Waiting for: " + this.worker.cmd))}`);
    },
    flush(cb) {
      cb();
    },
  });
};

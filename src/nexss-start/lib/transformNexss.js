const { db } = require("@nexssp/logdebug");
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
    objectMode: true,
    transform(chunk, encoding, callback) {
      const argsDisplay = args
        .filter((e) => !e.includes("--debug"))
        .filter((e) => !e.startsWith("--nxs"))
        .join(" ");

      if (chunk.stream === "cancel") {
        log.dr(`× Canceled Stream: ${cmd} ${argsDisplay}`);
        callback(null, chunk);
        return;
        // } else if (chunk.status === "platform-notmach") {
        //   log.dr(`× Canceled Stream:Nexss: platform-notmatch`);
        //   callback(null, chunk);
        //   return;
      } else {
        log.di(`↳ Stream: transformNexss: ${cmd} ${argsDisplay}`);
      }
      let startStreamTime;
      if (process.argv.includes("--nxsTime")) {
        startStreamTime = process.hrtime();
      }

      const self = this;

      let options = Object.assign({});
      if (process.argv.includes("--nxsI")) {
        // We get stdin from user.
        options.stdio = ["inherit", "pipe", "pipe"];
      } else {
        options.stdio = ["pipe", "pipe", "pipe"];
      }

      options.detached = false;
      options.shell = process.shell;

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
      // args2 = args2.remove("--debug");
      args2 = args2.remove("--nxsPipeErrors");
      args2 = args2.remove("--nxsTest");
      args2 = args2.remove("--nxsDebugData");
      args2 = args2.filter((e) => !e.startsWith("--nxsAs"));
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
      log.dc(
        bold(
          `  Adding cliArgs (argsStrings to the run command): Stream: Nexss..`
        ),
        argsStrings.join(" ")
      );
      // dy(`Spawning ..${cmd}`, argsStrings.join(" "), "cwd: ", process.cwd());
      this.worker = spawn(cmd, argsStrings, options);
      this.worker.cmd = nexssCommand;
      this.worker.on("error", (err) => {
        // throw Error(err);
        switch (err.code) {
          case "ENOENT":
            error(
              `TRANSFORM_nexss:${
                err.path
              } not found. Command: ${cmd} ${args.join(" ")}`
            );
            break;
          default:
            error(
              `TRANSFORM_nexss:Failed to start subprocess. ${err}. Maybe shell specified is not ok? process.shell: ${process.shell}`
            );
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
          if (this.errBuffer)
            parseError(fileName, this.errBuffer, args.includes("--pipeerrors"));
          this.errBuffer = "";
        }
      });

      this.worker.stdout.on("data", function (data) {
        this.emptyCall = false;
        data = data.toString();
        if (data === "\n") {
          this.emptyCall = true;
          // sometime we have \n
          // self.push({
          //   display: data, // Will just display the data at the end.
          //   stream: "cancel",
          //   command: nexssCommand,
          //   from: "transform-nexss",
          //   status: "ok",
          //   data,
          // });

          log.dy(
            "!!!!!!!!!!!!!! In the stdout there is '\\n' received from the transformNexss Worker.",
            "We didn't pass this as it would go through the whole stream"
          );
          return; // we do not want to pass through the whole stream \n
        }
        log.dg(
          `<< Data: ${bold(data.length + " B.")}, cmd:${process.nexssCMD}`
        );

        log.dg(
          "insp -->",
          data.length > 400
            ? require("util").inspect(data.substr(0, 400)) + "...(400chars)"
            : require("util").inspect(data)
        );

        timeElapsed(startCompilerTime, `Response from ${bold(nexssCommand)}`);

        // Checking if data is

        try {
          data = JSON.parse(data);
          if (data.nxsIn === "") {
            // Autohotkey - issue with delete object key - how to?
            delete data.nxsIn;
          }

          if (data.resultField_1 === "") {
            // Autohotkey - issue with delete object key - how to?
            delete data.resultField_1;
            delete data.nxsAs;
          }

          if (data.nxsAs === "") {
            // Autohotkey - issue with delete object key - how to?
            delete data.nxsAs;
          }

          if (!data.nxsStop) {
            self.push({
              display: chunk.display,
              command: nexssCommand,
              from: "transform-nexss",
              status: "ok",
              data,
            });
          } else {
            const reason = data.nxsStopReason;
            delete data.nxsStop;
            delete data.nxsStopReason;
            self.push({
              display: chunk.display,
              command: nexssCommand,
              from: "transform-nexss",
              stream: "stop",
              reason: reason ? reason : "reason not specified",
              status: "end",
              data,
              command: process.nexssCMD,
            });
          }
        } catch (e) {
          // if ((data && data.startsWith("{")) || ifLonger) {
          //   // it can be json but not completed
          //   ifLonger += data;
          // }
          self.push({
            display: chunk.display,
            command: nexssCommand,
            from: "transform-nexss",
            stream: "ok",
            error: "not a json",
            data,
            command: process.nexssCMD,
          });
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
        self.end();

        if (
          process.nxsErrorExists &&
          !process.argv.includes("--nxsPipeErrors")
        ) {
          // console.log("There was an error during run..", this.worker.cmd);
          // callback(null, { stream: "cancel", status: "error" });
        } else {
          callback(null);
        }
      });

      j = chunk.data;

      try {
        const { expressionParser } = require("./expressionParser");
        Object.keys(j).forEach((e) => {
          if (!["nexss", "cwd", "start"].includes(e)) {
            j[e] = expressionParser(j, j[e]);
          }
        });
      } catch (error) {
        log.dbg(`Error on parsing data: ${chunk}`);
      }

      try {
        // console.error(chunk);

        // ============================
        // Worker receive JSON
        this.worker.stdin.write(Buffer.from(JSON.stringify(j)));
        // =======================
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

const { defaultConsoleType } = require("@nexssp/logdebug");

module.exports.worker = function ({
  self,
  chunk,
  cmd,
  argsStrings,
  fileName,
  options,
  startStreamTime,
  callback,
  StreamCache,
} = {}) {
  options = options || {};
  argsStrings = argsStrings || [];

  const { nxsDebugTitle } = require("./output/nxsDebug");
  const { timeElapsed } = require("./output/nxsTime");
  const { pushData } = require("./transformNexssLib");
  const { spawn } = require("child_process");
  const { parseError } = require("./error");
  const { colorizer } = require("./colorizer");
  const { parseData } = require("@nexssp/expression-parser");
  // If nexssCache enabled, output will be cached first and then send out.
  // Output is passed to another stream after is send out partly.
  const nexssCache = StreamCache;

  let startCompilerTime;
  //Yes startStreamTime below
  if (startStreamTime) {
    // nxsTime
    startCompilerTime = process.hrtime();
  }
  options.maxBuffer = 1024 * 1024 * 100;
  options.highWaterMark = 1024 * 1024 * 100;
  log.dc(
    bold(`  Adding cliArgs (argsStrings to the run command): Stream: Nexss..`),
    argsStrings.join(" ")
  );
  log.dy(`Spawning ..${cmd}`, argsStrings.join(" "), "cwd: ", process.cwd());
  this.worker = spawn(cmd, argsStrings, options);

  const nexssCommand = `${cmd} ${argsStrings.join(" ").trim()}`;
  this.worker.cmd = nexssCommand;
  this.worker.on &&
    this.worker.on("error", (err) => {
      // throw Error(err);
      switch (err.code) {
        case "ENOENT":
          log.error(
            `TRANSFORM_nexss:${
              err.path
            } not found. Command: ${cmd} ${argsStrings.join(" ")}`
          );
          break;
        default:
          log.error(
            `TRANSFORM_nexss:Failed to start subprocess. ${err}. Maybe shell specified is not ok? process.shell: ${process.shell}`
          );
      }
    });

  this.worker.stderr &&
    this.worker.stderr.on &&
    this.worker.stderr.on("data", function (err) {
      console.log("DATA!!!!! ERROR!!!");
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
              eval(`log.${type}`)(colorizer(nexssError.join(":").trim()));
            }
          } else {
            parseError(
              fileName,
              element,
              argsStrings.includes("--nxsPipeErrors"),
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
          parseError(
            fileName,
            this.errBuffer,
            argsStrings.includes("--pipeerrors")
          );
        this.errBuffer = "";
      }
    });

  var nexssCacheData = "";
  this.worker.stdout &&
    this.worker.stdout.on &&
    this.worker.stdout.on("data", function (data) {
      console.log("DATA!!!!! NOERROR!!!");

      data = data.toString();

      if (nexssCache) {
        nexssCacheData += data;
      } else {
        log.dbg("\n\nOUT FROM STDOUT", require("util").inspect(data), "\n\n");
        if (data === "\n" || data === "\r\n") {
          log.dy(
            "In the stdout there is '\\n' received from the transformNexss Worker.",
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
        setImmediate(() => {
          // Checking if data is

          // First we check fast
          if (chunk) {
            chunk.nexssCommand = nexssCommand;
            const dataToPush = pushData(data, chunk);
            self.push(dataToPush);
          } else {
            callback(null, data);
          }

          timeElapsed(startCompilerTime, `Response from ${bold(nexssCommand)}`);
        });
      }
    });

  // self.pipe(this.worker);
  // !!NOTE: Below can't be 'finish' as it's not showing all errors.
  this.worker.stderr.on("end", function () {
    if (nexssCache) {
      chunk.nexssCommand = nexssCommand;
      const dataToPush = pushData(nexssCacheData, chunk);
      self.push(dataToPush);
    }

    if (this.errBuffer) {
      parseError(
        fileName,
        this.errBuffer,
        argsStrings.includes("--nxsPipeErrors"),
        process.cwd()
      );
      if (!cliArgs.nxsPipeErrors) {
        callback(red("Error: ") + bold(nexssCommand));
      } else {
        // callback(null, "Error during: " + nexssCommand);
      }

      process.exitCode = 1;

      this.errBuffer = "";
    }
  });

  //   this.worker.stdout.on("end", () => {
  //     this.bufferCompleted = true;
  //   });

  // this.worker.on("close", () => {
  //   timeElapsed(startCompilerTime, `Close Worker ${bold(nexssCommand)}`);
  // });
  this.worker.on &&
    this.worker.on("close", () => {
      console.log("WORKER CLOSED!!!");
      timeElapsed(startCompilerTime, `Close/End Worker ${bold(nexssCommand)}`);
      if (self) self.end();

      if (process.nxsErrorExists && !cliArgs.nxsPipeErrors) {
        // console.log("There was an error during run..", this.worker.cmd);
        // callback(null, { stream: "cancel", status: "error" });
      } else {
        callback(null);
      }
    });

  if (chunk) {
    j = chunk.data;
    try {
      j = parseData(j, ["nexss", "cwd", "start"]);
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
      log.dbg(`ERROR WRITING TO PIPE:`, chunk);
    }
    nxsDebugTitle(" ! Executed: " + cmd, j, "yellow");
  }

  process.nexssCMD = nexssCommand;

  if (this.worker.stdin) {
    console.log("WORKER STDIN!!");
    this.worker.stdin.end();
  }
  return this.worker;
};

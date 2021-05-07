module.exports.worker = function ({
  self,
  chunk,
  cmd,
  argsStrings,
  fileName,
  options,
  startStreamTime,
  callback,
} = {}) {
  const { nxsDebugTitle } = require("./output/nxsDebug");
  const { timeElapsed } = require("./output/nxsTime");
  const { pushData } = require("./transformNexssLib");
  const { spawn } = require("child_process");
  const { parseError } = require("./error");
  const { colorizer } = require("./colorizer");
  // NOTE: below showing that are not used, but they ARE!!!

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
  // dy(`Spawning ..${cmd}`, argsStrings.join(" "), "cwd: ", process.cwd());
  this.worker = spawn(cmd, argsStrings, options);

  const nexssCommand = `${cmd} ${argsStrings.join(" ")}`;
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
      this.emptyCall = false;
      data = data.toString();

      if (nexssCache) {
        nexssCacheData += data;
      } else {
        log.dbg("\n\nOUT FROM STDOUT", require("util").inspect(data), "\n\n");

        // Does below happen? to check
        // If it does then we need to create
        // New stream status: noparse, which will just display data
        if (data === "\n" || data === "\r\n") {
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
          chunk.nexssCommand = nexssCommand;
          const dataToPush = pushData(data, chunk);

          self.push(dataToPush);
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
  this.worker.on &&
    this.worker.on("close", () => {
      timeElapsed(startCompilerTime, `Close/End Worker ${bold(nexssCommand)}`);
      self.end();

      if (process.nxsErrorExists && !cliArgs.nxsPipeErrors) {
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
    log.dbg(`ERROR WRITING TO PIPE:`, chunk);
  }

  process.nexssCMD = nexssCommand;

  nxsDebugTitle(" ! Executed: " + cmd, j, "yellow");

  if (this.worker.stdin) this.worker.stdin.end();

  return this.worker;
};

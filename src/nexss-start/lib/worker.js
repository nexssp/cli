const { red, bold, yellow } = require("@nexssp/ansi");
const log = require("@nexssp/logdebug");

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
  isErrorPiped,
} = {}) {
  options = options || {};
  argsStrings = argsStrings || [];
  if (!fileName) {
    fileName = argsStrings[0];
  }

  if (!callback) {
    callback = (x) => {
      if (x) process.stdout.write(x);
    }; // custom function for callback (eg inside another stream)
  } else if (typeof callback !== "function") {
    throw new Error(
      "Callback needs to be a function. But received: " + typeof callback
    );
  }

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
  let dataOnError = [{ chunk_in: chunk }]; // just to display if end with error. Think about better way.
  let dataOnErrorCWD = chunk.data.cwd;
  let startCompilerTime;
  //Yes startStreamTime below
  if (startStreamTime) {
    // nxsTime
    startCompilerTime = process.hrtime();
  }
  options.maxBuffer = 1024 * 1024 * 100;
  options.highWaterMark = 1024 * 1024 * 100;
  log.dy(
    `Spawning ..${cmd}`,
    "with args ",
    argsStrings.join(" "),
    "cwd: ",
    process.cwd()
  );
  const Worker1 = spawn(cmd, argsStrings, options);

  const nexssCommand = `${cmd} ${argsStrings.join(" ").trim()}`;
  Worker1.cmd = nexssCommand;
  Worker1.on &&
    Worker1.on("error", (err) => {
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

  Worker1.stderr &&
    Worker1.stderr.on &&
    Worker1.stderr.on("data", function (err) {
      const errorString = err.toString();
      // Nexss Programmers messages go through stderr
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
            argsStrings.includes("--nxsPipeErrors")
          );
        this.errBuffer = "";
      }
    });

  var nexssCacheData = "";
  Worker1.stdout &&
    Worker1.stdout.on &&
    Worker1.stdout.on("data", function (data) {
      data = data.toString();
      const optionsWithoutEnv = Object.assign({}, options, { env: "hidden" });
      dataOnError.push({
        data_from_worker: data,
        command: nexssCommand,
        options: optionsWithoutEnv,
        cwd: dataOnErrorCWD,
      });

      if (nexssCache) {
        nexssCacheData += data;
      } else {
        log.dbg(
          `\n${nexssCommand}: `,
          require("util").inspect(data, {
            compact: true,
            depth: 5,
            breakLength: 80,
          }),
          "\n"
        );
        if (data === "\n" || data === "\r\n") {
          log.dy(
            "In the stdout there is '\\n' received from the transformNexss Worker.",
            "We didn't pass this as it would go through the whole stream"
          );
          return; // we do not want to pass through the whole stream \n
        }
        log.dg(`>> Data: ${bold(data.length + " B.")}, cmd:${nexssCommand}`);

        log.dg(
          "insp -->",
          data.length > 400
            ? require("util").inspect(data.substr(0, 400)) + "...(400chars)"
            : require("util").inspect(data)
        );

        setImmediate(() => {
          if (chunk) {
            chunk.nexssCommand = nexssCommand;
            const dataToPush = pushData(data, chunk);
            self.push(dataToPush);
            dataOnError.push({ chunk_out: dataToPush });
          } else {
            // It's not a stream, we output data
            dataOnError.push({ not_stream_push: dataToPush });
            callback(data);
          }

          timeElapsed(startCompilerTime, `Response from ${bold(nexssCommand)}`);
        });
      }
    });

  // self.pipe(Worker1);
  // !!NOTE: Below can't be 'finish' as it's not showing all errors.
  Worker1.stderr.on("end", function () {
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

  Worker1.on("exit", function (code) {
    if (code !== 0) {
      console.log(red(bold("\nNexss Programmer ERROR:")));
      console.log("\nCurrent Data: ");
      console.log(
        require("util").inspect(dataOnError, {
          compact: true,
          depth: 5,
          breakLength: 80,
          colors: true,
        })
      );

      log.error(
        `\n${bold(yellow(Worker1.cmd))} has ended with exitCode ${yellow(
          bold(code)
        )}. \n` + bold(`Nexss Programmer will not continue.`)
      );

      console.log(
        require("util").inspect(dataOnError.slice(1, -1), {
          compact: true,
          depth: 5,
          breakLength: 80,
          colors: true,
        })
      );
      process.exit(code);
    }
  });

  //   Worker1.stdout.on("end", () => {
  //     this.bufferCompleted = true;
  //   });

  // Worker1.on("close", () => {
  //   timeElapsed(startCompilerTime, `Close Worker ${bold(nexssCommand)}`);
  // });
  Worker1.on &&
    Worker1.on("close", () => {
      timeElapsed(startCompilerTime, `Close/End Worker ${bold(nexssCommand)}`);
      if (self) self.end();

      if (process.nxsErrorExists && !isErrorPiped) {
        // console.log("There was an error during run..", Worker1.cmd);
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
      Worker1.stdin.write(Buffer.from(JSON.stringify(j)));
      // =======================
    } catch (error) {
      log.dbg(`ERROR WRITING TO PIPE:`, chunk);
    }
    nxsDebugTitle(" ! Executed: " + cmd, j, "yellow");
  }

  if (Worker1.stdin) {
    Worker1.stdin.end();
  }
  return Worker1;
};

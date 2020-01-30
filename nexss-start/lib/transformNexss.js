const { Transform } = require("stream");
const { dy, dbg, success, warn, error, ok } = require("../../lib/log");
const { spawn } = require("child_process");
const { is } = require("../../lib/data/guard");
const { defaultExecuteOptions } = require("../../config/defaults");
const { Proc } = require("../../lib/proc");
const path = require("path");
// const { promisify } = require("util");
const { parseError } = require("./error");
const isDebug = process.argv.indexOf("--debug") >= 0;

module.exports.transformNexss = (
  cmd, // cmd = ls, node, php or whatever
  args = [], // arguments eg. ["--help", "myfile.php"]
  { quiet = false, fileName = undefined, inputData } = defaultExecuteOptions
) => {
  return new Transform({
    transform(chunk, encoding, callback) {
      const self = this;
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }

      dbg(`Chunk size: ${chunk.length}, trimmed: ${chunk.trim().length}`);

      if (chunk === "\u0003") {
        // process.exit();
        throw "User exited CTRL+C.";
      }

      let options = Object.assign({});

      options.stdio = "pipe";
      options.detached = false;
      options.shell = true;

      if (!quiet)
        dy(
          `Spawning ${cmd} ${args ? args.join(" ") : ""} options: `,
          JSON.stringify(options)
        );
      // console.log();
      // args = args.filter(e => e !== "--test");
      this.worker = spawn(cmd, args, options);
      this.worker.cmd = `${cmd} ${args.join(" ")} `;
      // console.log(this.worker.cmd);
      let proc = new Proc(this.worker.pid, {
        filePath: path.resolve(fileName)
      });
      proc.write();

      this.worker.on("error", err => {
        // throw Error(err);
        switch (err.code) {
          case "ENOENT":
            throw `${err.path} not found. Command: ${cmd} ${args.join(" ")}`;
          default:
            throw `Failed to start subprocess. ${err}`;
        }
      });

      this.worker.stderr.on("data", function(err) {
        this.errBuffer = this.errBuffer || "";
        this.errBuffer += err.toString();

        // console.log("ERRSTRING: " + err.toString());

        if (this.errBuffer.includes("NEXSS/")) {
          const exploded = this.errBuffer.split("NEXSS");
          exploded.forEach(element => {
            if (!element) return;
            // console.log("###################");
            // console.log(element);
            // console.log("##################");
            // console.log(element.substring(0, 1));
            // console.log("EEEEEEEEEEEEEEEENNNNNNNNNNNNNDDDDDDDD");
            if (element.substring(0, 1) === "/") {
              let nexssError = element + "";
              nexssError = nexssError.substring(1);
              nexssError = nexssError.split(":");
              const type = nexssError.shift();

              eval(type)(nexssError.join(":"));
            } else {
              parseError(fileName, element, args.includes("--pipeerrors"));
            }
            // console.error("##############element!!!", element);
          });
          this.errBuffer = "";
        } else {
          if (this.errBuffer)
            parseError(fileName, this.errBuffer, args.includes("--pipeerrors"));
          this.errBuffer = "";
        }
      });

      this.worker.stdout.on("data", function(data) {
        // TODO: Check if trim is ok here
        self.push(data.toString().trim());
      });

      this.worker.stderr.on("end", function() {
        if (this.errBuffer)
          parseError(fileName, this.errBuffer, args.includes("--pipeerrors"));
        this.errBuffer = "";
      });

      //   this.worker.stdout.on("end", () => {
      //     this.bufferCompleted = true;
      //   });

      this.worker.on("exit", () => {
        self.end();
        callback();
      });

      if (inputData) {
        // Later to review
        try {
          let j = JSON.parse(chunk.toString());
          const FinalData = Object.assign({}, j, inputData);
          this.worker.stdin.write(Buffer.from(JSON.stringify(FinalData)));
        } catch (error) {
          inputData.nexssStdin = chunk.toString();
          this.worker.stdin.write(Buffer.from(JSON.stringify(inputData)));
        }
      } else {
        try {
          this.worker.stdin.write(chunk);
        } catch (error) {
          dbg(`ERROR WRITING TO PIPE: ${chunk}`);
        }
      }

      //BElow maybe is in wrong placa but AutoIt doesn;t work if is not here!!!!!
      this.worker.stdin.end();

      dbg("waiting for ", this.worker.cmd);
    },
    flush(cb) {
      cb();
      // console.log("flush!!!!!");
    }
  });
};

const { Transform } = require("stream");
const { dy } = require("../../lib/log");
const { spawn } = require("child_process");
const { is } = require("../../lib/data/guard");
const { defaultExecuteOptions } = require("../../config/defaults");
const { Proc } = require("../../lib/proc");
const path = require("path");
// const { promisify } = require("util");
const { parseError } = require("./error");

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

      if (!quiet)
        console.log(
          `Chunk size: ${chunk.length}, trimmed: ${chunk.trim().length}`
        );

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
      });

      this.worker.stdout.on("data", function(data) {
        if (!quiet) {
          console.log("OUTPUT: ", data.toString().trim());
        }
        // TODO: Check if trim is ok here
        self.push(data.toString().trim());
      });

      this.worker.stderr.on("end", function() {
        if (this.errBuffer)
          parseError(fileName, this.errBuffer, args.includes("--pipeerrors"));
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
        this.worker.stdin.write(chunk);
      }

      //BElow maybe is in wrong placa but AutoIt doesn;t work if is not here!!!!!
      this.worker.stdin.end();

      if (!quiet) console.log("waiting for ", this.worker.cmd);
    },
    flush(cb) {
      cb();
      // console.log("flush!!!!!");
    }
  });
};

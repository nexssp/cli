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
  { quiet = false, fileName = undefined } = defaultExecuteOptions
) => {
  if (!is("Array", args)) {
    throw Error("args needs to be an Array");
  }
  return new Transform({
    bufferCompleted: false,
    transform(chunk, encoding, callback) {
      const self = this;
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }
      if (chunk === "\u0003") {
        // process.exit();
        throw "User exited CTRL+C.";
      }

      let options = {};
      options.input = chunk;
      options.stdio = "pipe";
      options.detached = false;
      options.shell = true;

      if (!quiet)
        dy(
          `Spawning ${cmd} ${args ? args.join(" ") : ""} options: `,
          JSON.stringify(options)
        );

      this.worker = spawn(cmd, args, options);
      this.worker.cmd = `${cmd} ${args.join(" ")} `;

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

      this.worker.stderr.on("data", function(data) {
        data = data.toString();
        parseError(fileName, data);
      });

      this.worker.stdout.on("data", function(data) {
        self.push(data.toString());
      });

      this.worker.stdout.on("end", () => {
        this.bufferCompleted = true;
      });

      this.worker.on("exit", () => {
        self.end();
        callback();
      });

      this.worker.stdin.write(chunk);
      //BElow maybe is in wrong placa but AutoIt doesn;t work if is not here!!!!!
      this.worker.stdin.end();
      // if (process.stdout.clearLine) {
      //   process.stdout.clearLine();
      //   process.stdout.cursorTo(0);
      // }

      // Handle on exit event

      if (!quiet) console.log("waiting for ", this.worker.cmd);
    },
    flush(cb) {
      cb();
      // console.log("flush!!!!!");
    }
  });
};

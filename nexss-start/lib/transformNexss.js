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
      //   console.log("start transform for ", cmd, args);
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }
      if (chunk === "\u0003") {
        // process.exit();
        throw "User exited CTRL+C.";
      }

      //   console.log("transform:", chunk);
      let options = {};
      options.input = chunk;
      options.stdio = "pipe";
      options.detached = false;
      options.shell = true;
      // options.timeout = 1;
      // if (process.stdout.clearLine) {
      //   process.stdout.clearLine();
      //   process.stdout.cursorTo(0);
      // }

      // TODO: This is a bit tricky - when there i no paths in the command it's check
      // TODO: if there are some in the first argument eg src/ etc. To make sure is ok.

      // let changingDir = path.dirname(cmd);
      // if (changingDir === ".") {
      //   // console.log("....................", args[0]);
      //   changingDir = path.dirname(args[0]);
      //   args[0] = path.basename(args[0]);
      // } else {
      //   cmd = path.basename(cmd);
      // }
      // console.log(`chanign driiiiiii: ${changingDir}`);
      // options.cwd = changingDir;
      // console.log("args!!!", args);
      if (!quiet)
        dy(
          `Spawning ${cmd} ${args ? args.join(" ") : ""} options: `,
          JSON.stringify(options)
        );

      // options.env = {
      //   PATH: process.env.PATH
      // };

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
        // console.error("WORKER [error]", data);
        parseError(fileName, data);

        // if callback it's exits and brakes pipe - to inverstigate
        // callback(data, null);

        // process.exit(1);
        //throw `error in ${data}`;
      });

      this.worker.stdout.on("data", function(data) {
        // console.log("DATA!!!!!!!!" + data.toString() + "!!!!!!!!!!!!!!!!!");
        // callback(null, data.toString());
        self.push(data.toString());
        // callback(); // ????????????????????????
      });

      this.worker.stdout.on("end", () => {
        // console.log(
        //   "EEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDDDDD"
        // );
        this.bufferCompleted = true;
        // this.worker.stdin.end();
        // console.log("CURRENT wdir", process.cwd());
      });

      this.worker.on("exit", () => {
        //(code, signal)
        // console.log(`finished worker!!!! code: ${code}, ${signal}`);
        // callback(null, null);
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

const { Transform } = require("stream");
const cliArgs = require("minimist")(process.argv);
const { dbg, warn, ok } = require("../../lib/log");
const { bold, red } = require("../../lib/color");
const request = require("request");
const { nxsDebugTitle } = require("../lib/output/nxsDebug");
module.exports.transformRequest = (url) =>
  new Transform({
    transform: (chunk, encoding, callback) => {
      let data;

      try {
        data = JSON.parse(chunk.toString());
      } catch (error) {
        console.error(
          "ERROR in JSON (start/tranformOutput.js): ",
          chunk.toString()
        );
        callback(null, JSON.stringify(data));
      }

      nxsDebugTitle("Nexss Request:" + bold(url), data, "red");

      let streamRead = request(url);

      // console.log(chunk.toString());
      let wholeData = "";
      streamRead.on("data", (d) => {
        wholeData += d;
        // callback(null, data);
      });

      streamRead.on("error", (er) => {
        callback(er);
      });

      streamRead.on("end", () => {
        data.nxsOut = wholeData;
        callback(null, Buffer.from(JSON.stringify(data)));
      });

      // streamRead.on("exit", (code, signal) => {
      //   // console.log(`finished worker!!!! code: ${code}, ${signal}`);
      //   // callback(null, null);
      //   self.end();
      //   callback();
      // });
    },
    flush(cb) {
      cb();
      // console.log("flush!!!!!");
    },
  });

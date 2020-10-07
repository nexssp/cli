/*
 * Title: Nexss PROGRAMMER 2.2
 * Description: Tranform File Stream Module
 * Author: Marcin Polak
 * 2018/08/14 initial version
 */

module.exports.transformFile = (file, x, y) => {
  const { Transform } = require("stream");
  const { createReadStream, existsSync } = require("fs");
  const { extname } = require("path");
  const { nxsDebugTitle } = require("./output/nxsDebug");
  const { timeElapsed } = require("../../nexss-start/lib/output/nxsTime");
  const { bold } = require("@nexssp/ansi");
  return new Transform({
    highWaterMark: require("../../config/defaults").highWaterMark,
    //  writableObjectMode: true,
    transform(chunk, encoding, callback) {
      if (process.NEXSS_CANCEL_STREAM) {
        callback(null, chunk);
        return;
      }
      process.chdir(y.cwd);
      process.nexssCWD = y.cwd;
      if (!existsSync(file)) {
        // Stop as first parameter is an error.
        callback(
          `File ${file} not found. Current dir (transformFile.js):${process.cwd()}`
        );
      }
      try {
        data = JSON.parse(chunk.toString());
      } catch (error) {
        console.error(
          "ERROR in JSON (start/trasformFile.js): ",
          chunk.toString()
        );
        callback(null, JSON.stringify(data));
      }

      let startCompilerTime = process.hrtime();

      nxsDebugTitle("Transforming File: " + file, data, "yellow");
      let streamRead = createReadStream(file);
      let wholeData = "";
      streamRead.on("data", (d) => {
        wholeData += d;
        // callback(null, data);
      });

      streamRead.on("error", (er) => {
        callback(er);
      });

      streamRead.on("end", () => {
        if (extname(file) === ".json") {
          try {
            const jsonToObj = JSON.parse(wholeData);
            data = Object.assign({}, data, jsonToObj);
          } catch (e) {
            data.nxsStopReason = `Issue with json file: ${file}\n ERROR: ${e}`;
            data.nxsStop = true;

            callback(JSON.stringify(data));
          }
        } else {
          data.nxsOut = wholeData;
        }
        data = JSON.stringify(data);
        // timeElapsed(startCompilerTime, `Read file from ${bold(file)}`);
        callback(null, Buffer.from(data));
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
};

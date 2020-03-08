/*
 * Title: Nexss PROGRAMMER 2.0.0
 * Description: Tranform File Stream Module
 * Author: Marcin Polak
 * 2018/08/14 initial version
 */

const { Transform } = require("stream");
const { createReadStream, existsSync } = require("fs");
const { extname } = require("path");

module.exports.transformFile = file => {
  return new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      if (!existsSync(file)) {
        callback(`File ${file} not found`);
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

      let streamRead = createReadStream(file);
      let wholeData = "";
      streamRead.on("data", d => {
        wholeData += d;
        // callback(null, data);
      });

      streamRead.on("error", er => {
        callback(er);
      });

      streamRead.on("end", () => {
        if (extname(file) === ".json") {
          const jsonToObj = JSON.parse(wholeData);
          data = Object.assign({}, data, jsonToObj);
        } else {
          data.nxsOut = wholeData;
        }

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
    }
  });
};

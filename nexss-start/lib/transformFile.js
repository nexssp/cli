/*
 * Title: Nexss PROGRAMMER 2.0.0
 * Description: Tranform File Stream Module
 * Author: Marcin Polak
 * 2018/08/14 initial version
 */

const { Transform } = require("stream");
const { createReadStream, existsSync } = require("fs");

module.exports.transformFile = file => {
  return new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      if (!existsSync(file)) {
        callback(`File ${file} not found`);
      }

      let streamRead = createReadStream(file);
      // console.log(chunk.toString());
      streamRead.on("data", data => {
        callback(null, data);
      });
      streamRead.on("error", er => {
        callback(er);
      });
      let self = this;
      streamRead.on("end", () => {
        console.log(
          "EEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDDDDD TRANFORM FILE SRC/EXE/"
        );
        self.end();
        this.end();
        // callback(1, null);
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

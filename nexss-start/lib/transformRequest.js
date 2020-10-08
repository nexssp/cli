module.exports.transformRequest = (url) => {
  const { Transform } = require("stream");
  const { bold } = require("@nexssp/ansi");
  const axios = require("axios");
  const { nxsDebugTitle } = require("../lib/output/nxsDebug");
  return new Transform({
    highWaterMark: require("../../config/defaults").highWaterMark,
    transform: (chunk, encoding, callback) => {
      log.di(`↳ Stream:transformRequest`);
      if (process.NEXSS_CANCEL_STREAM) {
        callback(null, chunk);
        return;
      }
      let data;
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }
      try {
        data = JSON.parse(chunk);
      } catch (error) {
        data = chunk;
      }

      nxsDebugTitle("Nexss Request:" + bold(url), data, "red");

      axios({ url, responseType: "stream" }).then((response) => {
        const axiosStream = response.data;

        let wholeData = "";
        axiosStream.on("data", (d) => {
          wholeData += d;
          // callback(null, data);
        });

        axiosStream.on("error", (er) => {
          callback(er);
        });

        axiosStream.on("end", () => {
          if (!data) {
            data = {};
          }

          try {
            data = JSON.parse(wholeData);
            callback(null, Buffer.from(wholeData));
          } catch (error) {
            data.nxsOut = wholeData;
            callback(null, Buffer.from(JSON.stringify(data)));
          }
        });
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
    },
  });
};

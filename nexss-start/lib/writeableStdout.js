const { Writable } = require("stream");
const { timeElapsed } = require("../lib/output/nxsTime");
module.exports.writeableStdout = () =>
  new Writable({
    write: (chunk, encoding, callback) => {
      // Display single value
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }

      if (chunk && chunk.startsWith("{")) {
        chunk = JSON.parse(chunk);
        delete chunk["nexssScript"];
        if (!chunk.nxsPretty) {
          console.log(JSON.stringify(chunk));
        } else {
          delete chunk["nxsPretty"];
          console.log(JSON.stringify(chunk, null, 2));
        }

        timeElapsed(chunk.nxsTime);
      } else {
        // data is not json but we want to show it to the stdout
        console.log(chunk);
      }
      // callback();
    }
  });

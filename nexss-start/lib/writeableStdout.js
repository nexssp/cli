const { Writable } = require("stream");
const { timeElapsed } = require("../lib/output/nxsTime");
// const isDebug = process.argv.indexOf("--validate") >= 0;
module.exports.writeableStdout = () =>
  new Writable({
    write: (chunk, encoding, callback) => {
      // Display single value
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }

      try {
        chunk = JSON.parse(chunk);
        delete chunk["nexssScript"];
        if (!chunk.nxsPretty) {
          console.log(JSON.stringify(chunk));
        } else {
          delete chunk["nxsPretty"];
          console.log(JSON.stringify(chunk, null, 2));
        }

        timeElapsed(chunk.nxsTime);
      } catch (error) {
        process.stdout.write(chunk);
      }

      // Below must be here as for example Blender will not display
      // Progress of rendering, some stdout will be cut etc.
      callback();
    },
  });

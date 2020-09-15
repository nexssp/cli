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

        // We hide variables started with _
        // like username, password etc. replaced by ****
        // Object.keys(chunk).forEach((e) => {
        //   if (e.length > 1 && e.startsWith("_")) chunk[e] = "*****";
        // });

        delete chunk["nexssScript"];
        if (!chunk.nxsPretty) {
          if (chunk["nxsDataDisplay"]) {
            let color = "\u001b[35m"; //grey

            console.error(
              `${color}Display below only Object keys (--nxsDataDisplay):\x1b[0m`
            );
            console.error(JSON.stringify(Object.keys(chunk)));
          } else {
            console.log(
              typeof chunk === "object" ? JSON.stringify(chunk) : chunk
            );
          }
        } else {
          delete chunk["nxsPretty"];
          console.log(JSON.stringify(chunk, null, 2));
        }

        timeElapsed(chunk.nxsTime);
      } catch (error) {
        if (process.argv.indexOf("--nxsModule") >= 0) {
          console.log(JSON.stringify({ nxsOut: chunk }));
        } else {
          console.log(
            typeof chunk === "object" ? JSON.stringify(chunk) : chunk
          );
        }
      }

      // Below must be here as for example Blender will not display
      // Progress of rendering, some stdout will be cut etc.
      callback();
    },
  });

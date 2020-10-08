module.exports.writeableStdout = () => {
  const { Writable } = require("stream");
  const { timeElapsed } = require("../lib/output/nxsTime");
  // const isDebug = process.argv.indexOf("--validate") >= 0;
  const { isJson } = require("../../lib/data/json");

  return new Writable({
    highWaterMark: require("../../config/defaults").highWaterMark,
    write: (chunk, encoding, callback) => {
      log.di(`↳ Stream:writeableStdout`);
      if (encoding === "buffer") {
        chunk = chunk.toString();
      }
      // Display single value
      if (process.NEXSS_NO_TRANSFORM) {
        // console.log(process.NEXSS_NO_TRANSFORM);
        console.log(chunk);
      } else {
        try {
          chunk = JSON.parse(chunk);

          // Cleanup display
          if (process.stdout.isTTY) {
            delete chunk.cwd;
            delete chunk.start;
            // delete chunk.nexss;
            delete chunk.__dirname;
            delete chunk.nxsLearning;
          }
          delete chunk.nxsPlatform;
          delete chunk["nexssScript"];
          if (!chunk.nxsPretty) {
            if (chunk["nxsDataDisplay"]) {
              let color = "\u001b[35m"; //grey

              console.error(
                `${color}Display below only Object keys (--nxsDataDisplay):\x1b[0m`
              );
              console.error(JSON.stringify(Object.keys(chunk)));
            } else {
              chunk =
                typeof chunk === "object" || typeof chunk === "number"
                  ? JSON.stringify(chunk)
                  : chunk;

              if (isJson(chunk)) {
                const coloredJson = require("json-colorizer")(chunk + "", {
                  colors: {
                    STRING_KEY: "green.bold",
                    STRING_LITERAL: "yellow.bold",
                    NUMBER_LITERAL: "blue.bold",
                  },
                });
                if (process.platform === "win32") {
                  process.stdout.write(coloredJson);
                } else {
                  console.log(coloredJson);
                }
              } else {
                process.stdout.write(chunk + "");
              }
            }
          } else {
            delete chunk["nxsPretty"];
            console.log(chunk);
          }

          timeElapsed(chunk.nxsTime);
        } catch (error) {
          // console.log("-------------------------------------------error", error);
          if (process.argv.indexOf("--nxsModule") >= 0) {
            process.stdout.write(JSON.stringify({ nxsOut: chunk }));
          } else {
            chunk =
              typeof chunk === "object" || typeof chunk === "number"
                ? JSON.stringify(chunk)
                : chunk;
            if (isJson(chunk)) {
              process.stdout.write(require("json-colorizer")(chunk));
            } else {
              process.stdout.write(chunk);
            }
          }
        }
        // console.log(process.dataFlow);
        // Below must be here as for example Blender will not display
        // Progress of rendering, some stdout will be cut etc.
        callback();
      }
    },
  });
};

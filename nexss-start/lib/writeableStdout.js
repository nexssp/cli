module.exports.writeableStdout = () => {
  const { Writable } = require("stream");
  const { timeElapsed } = require("../lib/output/nxsTime");
  // const isDebug = ~process.argv.indexOf("--validate");
  const { isJson } = require("../../lib/data/json");

  return new Writable({
    objectMode: true,
    highWaterMark: require("../../config/defaults").highWaterMark,
    write: (chunk, encoding, callback) => {
      if (chunk.stream === "cancel") {
        log.dr(`× Stream:Cancelled Writeable stdout`);
        if (chunk.status !== "end") {
          console.log(chunk.data);
        }
      } else {
        chunk = chunk.data;
        if (cliArgs.nxsOut && typeof cliArgs.nxsOut == "boolean") {
          console.log(data["nxsOut"]);
        }
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

        // Below display not ok on stream, progress bars etc.
        // see example: cd @nexssp\ansi\examples\ && nexss .\example-other.js
        // process.stdout.write("\n");

        timeElapsed(process.nxsTime);
        // console.log(process.dataFlow);
        // Below must be here as for example Blender will not display
        // Progress of rendering, some stdout will be cut etc.
        // callback();
      }
    },
  });
};

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
        log.dr(`× Stream: Cancelled Writeable stdout`);
        if (chunk.status !== "end") {
          console.log(chunk.data);
        } else if (chunk.display) {
          console.log(bold(yellow(chunk.display)));
        } else {
          process.stdout.write(chunk.data);
        }
      } else if (chunk.stream === "stop") {
        console.log(bold(red("× Stream: Stopped by: ", chunk.command)));
        console.log(bold(red("↳ Reason:")));
        console.log(bold(red(chunk.reason)));
      } else {
        log.dg(`↳ Stream: Writeable stdout`);
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

          // We delete all arguments which are use to specific nexss
        }

        // Clear all nexss arguments (only for one nexss command)
        // nexss-core\arguments.js
        const outputKeys = chunk[nexss["output:keys"]];
        const outputPretty = chunk[nexss["output:pretty"]] || chunk.nxsPretty;

        Object.keys(global.nexss).forEach((e) => delete chunk[global.nexss[e]]);

        delete chunk.nxsPlatform;
        delete chunk["nexssScript"];
        if (!outputPretty) {
          if (chunk[outputKeys]) {
            let color = "\u001b[35m"; //grey

            console.error(
              `${color}Display below only Object keys (${outputKeys}):\x1b[0m`
            );
            console.error(JSON.stringify(Object.keys(chunk)));
          } else {
            chunk =
              typeof chunk === "object" || typeof chunk === "number"
                ? JSON.stringify(chunk)
                : chunk;

            if (isJson(chunk)) {
              let outputJson = chunk + "";

              if (
                (process.nexssGlobalConfig.colors &&
                  process.nexssGlobalConfig.colors.output) ||
                cliArgs[nexss["output:colors"]]
              ) {
                outputJson = require("json-colorizer")(outputJson, {
                  colors: {
                    STRING_KEY: "green.bold",
                    STRING_LITERAL: "yellow.bold",
                    NUMBER_LITERAL: "blue.bold",
                  },
                });
              }

              if (process.platform === "win32") {
                process.stdout.write(outputJson);
              } else {
                console.log(outputJson);
              }
            } else {
              process.stdout.write(chunk + "");
            }
          }
        } else {
          delete chunk[nexss["output:pretty"]];
          delete chunk["nxsPretty"];

          chunk = JSON.stringify(chunk, null, 4);

          if (
            (process.nexssGlobalConfig.colors &&
              process.nexssGlobalConfig.colors.output) ||
            cliArgs[nexss["output:colors"]]
          ) {
            chunk = require("json-colorizer")(chunk, {
              colors: {
                STRING_KEY: "green.bold",
                STRING_LITERAL: "yellow.bold",
                NUMBER_LITERAL: "blue.bold",
              },
            });
          }

          console.log(chunk);

          // console.log(JSON.stringify(chunk, null, 4));
        }

        // Below display not ok on stream, progress bars etc.
        // see example: cd @nexssp\ansi\examples\ && nexss .\example-other.js
        // process.stdout.write("\n");
        if (chunk.display) {
          console.log(bold(yellow(chunk.display)));
        }
        timeElapsed(process.nxsTime);
        // Below must be here as for example Blender will not display
        // Progress of rendering, some stdout will be cut etc.

        callback();
      }
    },
  });
};

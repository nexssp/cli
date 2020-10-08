module.exports.transformTest = (
  title = "no title",
  args = [],
  options = {}
) => {
  const { Transform } = require("stream");
  const { red, bold } = require("@nexssp/ansi");
  const { warn, ok, error } = require("../../lib/log");
  const cliArgs = require("minimist")(process.argv);
  const { inspect } = require("util");
  const { cleanTerminalColors } = require("../../lib/terminal");
  return new Transform({
    highWaterMark: require("../../config/defaults").highWaterMark,
    // writableObjectMode: true,
    // readableObjectMode: true,
    transform(chunk, encoding, callback) {
      log.di(`↳ Stream:transformTest`);
      // Not a json data so we don't do anything here
      if (process.NEXSS_CANCEL_STREAM) {
        callback(null, chunk);
        return;
      }
      if (cliArgs.nxsTest) {
        const testingData = require("../../config/testingData.json");
        let data = "";
        try {
          data = JSON.parse(chunk.toString());
        } catch (er) {
          error(
            `There was an issue with JSON going out from file ${bold(
              process.nexssFilename ? process.nexssFilename : "unknown"
            )}:`
          );
          error(data);
        }
        if (data) {
          let errorExists;
          Object.keys(testingData).forEach((k) => {
            if (
              cleanTerminalColors(testingData[k] + "") !==
              cleanTerminalColors(data[k] + "")
            ) {
              error(bold(red(testingData[k])), `Not Equal to`);
              error(bold(red(data[k])));
              errorExists = true;
            } else {
              ok(bold(`Field ${k} is correct:`, data[k]));
            }
          });
          if (errorExists) {
            warn("Program has been terminated.");
            process.exit();
          }
        }
      }
      if (chunk) callback(null, chunk);
      //   process.stdout.write(`END ERROR TRANSFORMER ${title}\n\n `);
    },
  });
};

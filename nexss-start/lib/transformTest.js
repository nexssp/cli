const { Transform } = require("stream");
const { red, bold } = require("../../lib/ansi");
const { warn, ok, error } = require("../../lib/log");
const cliArgs = require("minimist")(process.argv);
const { inspect } = require("util");
module.exports.transformTest = (
  title = "no title",
  args = [],
  options = {}
) => {
  return new Transform({
    // writableObjectMode: true,
    // readableObjectMode: true,
    transform(chunk, encoding, callback) {
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
            if (testingData[k] !== data[k]) {
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

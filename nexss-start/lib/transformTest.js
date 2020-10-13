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
    objectMode: true,
    highWaterMark: require("../../config/defaults").highWaterMark,
    transform(chunk, encoding, callback) {
      // Not a json data so we don't do anything here
      if (cliArgs.nxsTest) {
        if (chunk.stream === "cancel") {
          log.dr(`× Stream:Cancelled transformTest`);
          callback(null, chunk);
          return;
          // } else if (chunk.status === "platform-notmach") {
          //   log.dr(`× Canceled Stream:Test: platform-notmatch`);
          //   callback(null, chunk);
          //   return;
        }

        log.di(`↳ Stream:transformTest`);

        const testingData = require("../../config/testingData.json");
        let data = chunk.data;

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
    },
  });
};

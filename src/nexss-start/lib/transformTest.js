module.exports.transformTest = (
  title = "no title",
  args = [],
  options = {}
) => {
  const { Transform } = require("stream");
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
          //   log.dr(`× Canceled Stream: Test: platform-notmatch`);
          //   callback(null, chunk);
          //   return;
        }

        log.di(`↳ Stream: transformTest`);

        const testingData = require("../../config/testingData.json");
        let data = chunk.data;

        if (data) {
          let errorExists;
          Object.keys(testingData).forEach((k) => {
            if (
              cleanTerminalColors(testingData[k] + "") !==
              cleanTerminalColors(data[k] + "")
            ) {
              log.error(bold(red(testingData[k])), `Not Equal to`);
              log.error(bold(red(data[k])));
              errorExists = true;
            } else {
              log.ok(bold(`Field ${k} is correct:`, data[k]));
            }
          });
          if (errorExists) {
            log.warn("Program has been terminated.");
            process.exit();
          }
        }
      }

      if (chunk) callback(null, chunk);
    },
  });
};

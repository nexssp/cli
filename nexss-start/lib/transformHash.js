module.exports.transformHash = (cmd, inputData, options) => {
  const { Transform } = require("stream");
  const cliArgs = require("minimist")(process.argv.slice(2));
  const { info, warn, error } = require("../../lib/log");
  const { NEXSS_SPECIAL_CHAR } = require("../../config/defaults");
  const { nxsDebugData } = require("./output/nxsDebug");
  return new Transform({
    highWaterMark: require("../../config/defaults").highWaterMark,
    // writableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      log.di(`↳ Stream:transformHash`);
      if (process.NEXSS_CANCEL_STREAM) {
        callback(null, chunk);
        return;
      }
      const n = cmd.name.replace(NEXSS_SPECIAL_CHAR, "");

      if (cliArgs.nxsComments) {
        if (n.length === 0) {
          info(inputData._.join(" "));
        } else {
          const splitter = n.split(":");
          if (splitter.length === 1) {
            info(splitter[0]);
          } else {
            switch (splitter[0]) {
              case "warn":
                warn(splitter[1]);
                break;
              default:
                error(splitter[1], "Command not found.");
                break;
            }
          }
        }
      }
      let newData = JSON.parse(chunk.toString());

      newData = Object.assign(newData, options.inputData);
      const { expressionParser } = require("./expressionParser");
      Object.keys(newData).forEach((e) => {
        newData[e] = expressionParser(newData, newData[e]);
      });

      // This stream allow to make vars eg. $#
      if (newData.nxsAs) {
        if (Array.isArray(newData.nxsIn)) {
          const nxsInData = newData.nxsIn;

          newData[newData.nxsAs] =
            nxsInData.length > 1 ? nxsInData : nxsInData[0];

          console.log(newData[newData.nxsAs]);
        } else {
          newData.nxsOut = newData.nxsIn;
        }

        delete newData.nxsIn;
      }

      nxsDebugData(newData, "$#", "magenta");
      callback(null, Buffer.from(JSON.stringify(newData)));
    },
  });
};

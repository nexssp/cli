const { Transform } = require("stream");
const cliArgs = require("minimist")(process.argv.slice(2));
const { info, warn, error } = require("../../lib/log");
const { NEXSS_SPECIAL_CHAR } = require("../../config/defaults");

module.exports.transformHash = (cmd, inputData, options) =>
  new Transform({
    highWaterMark: require("../../config/defaults").highWaterMark,
    // writableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      const n = cmd.name.replace(NEXSS_SPECIAL_CHAR, "");

      if (cliArgs.nxsComments) {
        if (n.length === 0) {
          info(xxx.inputData._.join(" "));
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
      callback(null, Buffer.from(JSON.stringify(newData)));

      //console.log(n);
      //const zzz = minimist(inputData);

      // console.log(minimist(inputData));
      // console.log(xxx);
      // console.error(chunk.toString());

      // callback(null, chunk);

      // callback(null, JSON.stringify(data));
    },

    // if (chunk) callback(null, chunk);
  });

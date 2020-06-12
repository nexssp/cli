const { Transform } = require("stream");
const cliArgs = require("minimist")(process.argv);
const { error, warn, ok } = require("../../lib/log");
const { bold, red } = require("../../lib/color");
const nxsInModule = require("./input/nxsIn");
const { nxsDebugData } = require("./output/nxsDebug");
require("../../lib/strings"); //we load string interpolate
const { expressionParser } = require("./expressionParser");

module.exports.transformInput = () =>
  new Transform({
    // writableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      let data = chunk.toString();

      try {
        data = JSON.parse(data);
      } catch (error) {
        if (process.argv.indexOf("--pipeerrors") >= 0) {
          console.log(data);
        } else {
          callback(null, data);
        }

        return;
      }

      if (data) {
        Object.keys(data).forEach((e) => {
          data[e] = expressionParser(data, data[e]);
        });

        nxsDebugData(data, "Input", "blue");

        data = nxsInModule(data);

        callback(null, JSON.stringify(data));
      }
    },
  });

module.exports.transformInput = (x, y, params) => {
  const { Transform } = require("stream");
  const cliArgs = require("minimist")(process.argv);
  const { error, warn, ok, isErrorPiped } = require("../../lib/log");
  const { bold, red } = require("@nexssp/ansi");
  const nxsInModule = require("./input/nxsIn");
  const { nxsDebugData } = require("./output/nxsDebug");
  require("../../lib/strings"); //we load string interpolate
  const { expressionParser } = require("./expressionParser");
  const cliArgsParser = require("minimist");
  const nxsStop = require("./start/nxsStop");
  const nxsGlobal = require("./input/nxsGlobal");
  const nxsLocal = require("./input/nxsLocal");
  return new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    readableHighWaterMark: require("../../config/defaults").highWaterMark,
    writableHighWaterMark: require("../../config/defaults").highWaterMark,
    transform: (chunk, encoding, callback) => {
      let data = chunk.toString();

      try {
        data = JSON.parse(data);
      } catch (error) {
        if (isErrorPiped) {
          console.log(data);
        } else {
          try {
            callback(null, data);
          } catch (e) {
            error(`ERRROOORRR:`, e);
          }
        }

        return;
      }

      delete params.env;
      // console.log("#######################", params);
      if (data) {
        // We add inputData from the parameters
        // This is added here as the validation is needed
        if (params.inputData) {
          // FIXME: later to make sure everywever is the object, not array.
          // Array is used on args parameter
          if (Array.isArray(params.inputData)) {
            params.inputData = cliArgsParser(params.inputData);
          }

          Object.assign(data, params.inputData);
        }

        Object.keys(data).forEach((e) => {
          data[e] = expressionParser(data, data[e]);
        });

        // if (params && params.inputData && params.inputData.nxsInFrom) {
        //   data.nxsInFrom = params.inputData.nxsInFrom;
        // }

        data = nxsInModule(data);

        nxsDebugData(data, "Input", "blue");
        nxsGlobal(data);
        nxsLocal(data);
        nxsStop(data);

        data.globalTestTInput = "This is input!!!!";
        data.globalTestTInputFunction = () => 1234;

        // The library below also stores functions..
        const json = require("../../lib/data/json");
        callback(null, json.stringify(data));
      }
    },
  });
};

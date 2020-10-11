module.exports.transformInput = (x, y, params) => {
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
  const { checkPlatform } = require("../../lib/platform");

  return new require("stream").Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      if (
        chunk.stream === "cancel" ||
        (params.inputData && !checkPlatform(params.inputData.nxsPlatform))
      ) {
        log.dr(`× Stream:Cancelled transformInput`);
        callback(null, chunk);
        return;
      } else {
        log.di(`↳ Stream:transformInput`);
      }

      if (!chunk.data) {
        callback(null, { status: "error", data: chunk });
        return;
      }

      let data = chunk.data;

      if (data) {
        // We add inputData from the parameters
        // This is added here as the validation is needed
        if (params.inputData) {
          // FIXME: later to make sure everywever is the object, not array.
          // Array is used on args parameter
          if (Array.isArray(params.inputData)) {
            params.inputData = cliArgsParser(params.inputData);
          }

          if (params.inputData._ && params.inputData._.length === 0) {
            delete params.inputData._;
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

        // data.globalTestTInput = "This is input!!!!";
        // data.nxsGlobalTestTInputFunction = () => {
        //   return require("fs").existsSync(".");
        // };

        callback(null, { status: "ok", data });
      }
    },
  });
};

const { parseData } = require("@nexssp/expression-parser");
module.exports.transformHash = (cmd, inputData, options) => {
  const { Transform } = require("stream");
  const { nxsDebugData } = require("./output/nxsDebug");
  return new Transform({
    objectMode: true,
    highWaterMark: require("../../config/defaults").highWaterMark,
    // writableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      if (chunk.stream === "cancel") {
        callback(null, chunk);
        return;
      }

      log.di(`↳ Stream: ${__filename}: ${require("util").inspect(cmd)}`);

      const n = cmd.name.replace("", "");

      if (cliArgs.nxsComments) {
        //??
        if (n.length === 0) {
          log.info(inputData._.join(" "));
        } else {
          const splitter = n.split(":");
          if (splitter.length === 1) {
            log.info(splitter[0]);
          } else {
            switch (splitter[0]) {
              case "warn":
                log.warn(splitter[1]);
                break;
              default:
                log.error(splitter[1], "Command not found.");
                callback(null, { status: "error", data: chunk.data });
                return;
            }
          }
        }
      }
      let newData = chunk.data;

      newData = Object.assign(newData, options.inputData);

      newData = parseData(newData, ["nexss", "cwd", "start"]);

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

      nxsDebugData(newData, bold(`Special char. ${n}`), "magenta");

      callback(null, { from: "transform-hash", status: "ok", data: newData });
    },
  });
};

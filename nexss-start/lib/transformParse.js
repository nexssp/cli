const { di } = require("../../lib/log");

module.exports.transformParse = () => {
  const { isErrorPiped } = require("@nexssp/logdebug");
  const { cleanup } = require("./output/nxsOutputParams");
  return new require("stream").Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      log.di(`↳ Stream:transformParse`);
      if (Buffer.isBuffer(chunk)) {
        data = chunk.toString();
      }
      try {
        data = JSON.parse(data);
      } catch (error) {
        log.di(yellow(`?! Stream:Warning: Input is not a JSON type file.`));
        if (isErrorPiped) {
          console.log(data);
        } else {
          const result = {
            // status: undefined - means not ok
            stream: "cancel",
            error: "Input is not a JSON type",
            data,
          };
          callback(null, result);
        }

        return;
      }

      if (cliArgs._ && cliArgs._.shift) {
        cliArgs._.shift();
        if (cliArgs._.length === 0) {
          delete cliArgs._;
        }
      }

      cliArgsCleaned = cleanup(cliArgs);

      const nexssVersion = require("../../package.json").version;
      let startData = {};
      startData.nexss = `${nexssVersion}`;
      startData.start = +new Date();
      startData.cwd = process.nexssGlobalCWD;

      if (process.NexssFilePath && process.NexssFilePath !== ".") {
        // data.__dirname = process.NexssFilePath;
        if (!startData["__dirname"]) startData["__dirname"] = process.cwd();
        startData.cwd = process.NexssFilePath;
      }

      const result = {
        status: "ok",
        data: Object.assign(startData, cliArgsCleaned, data),
      };
      callback(null, result);
    },
  });
};

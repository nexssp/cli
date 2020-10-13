module.exports.transformOutput = (x, y, z) => {
  const { Transform } = require("stream");

  const { error, warn, ok, isErrorPiped } = require("../../lib/log");
  const { bold, red } = require("@nexssp/ansi");
  const nxsFieldModule = require("./output/nxsField");
  const nxsFieldsModule = require("./output/nxsFields");
  const nxsConcatModule = require("./output/nxsConcat");
  const nxsGlueModule = require("./output/nxsGlue");
  const nxsConcatAsModule = require("./output/nxsConcatAs");
  const nxsDeleteModule = require("./output/nxsDelete");
  const nxsRenameModule = require("./output/nxsRename");
  const nxsSelectModule = require("./output/nxsSelect");
  // const nxsInModule = require("./input/nxsIn");
  const { nxsDebugData } = require("./output/nxsDebug");
  require("../../lib/strings"); //we load string interpolate
  const { expressionParser } = require("./expressionParser");
  const { cleanup } = require("./output/nxsOutputParams");
  const nxsStop = require("./start/nxsStop");
  return new Transform({
    objectMode: true,
    highWaterMark: require("../../config/defaults").highWaterMark,
    // writableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      // nxsDebugData(chunk.data, "Output", "magenta");
      if (chunk.stream === "cancel") {
        log.dr(`× Stream:Cancelled transformOutput`);
        if (chunk.command) {
          log.dr(`! Cancelled by: `, bold(chunk.command));
        }
        // process.NEXSS_CANCEL_STREAM = false; // this is for next streams.
        callback(null, chunk);
        return;
        // } else if (chunk.status === "platform-notmach") {
        //   log.dr(`× Canceled Stream:Output: platform-notmatch`);
        //   callback(null, chunk);
        //   return;
      } else {
        log.di(`↳ Stream:transformOutput`);
      }

      if (Buffer.isBuffer(chunk)) {
        chunk = chunk.toString();
      }

      // Not a json data so we don't do anything here
      let data = chunk.data;

      let cliArgs = require("minimist")(y);
      delete cliArgs._;

      delete cliArgs.nxsTime;
      delete cliArgs.nxsLocal;
      delete cliArgs.nxsLocalForce;
      delete cliArgs.nxsGlobal;
      delete cliArgs.nxsGlobalForce;
      delete cliArgs.nxsPlatform;

      Object.assign(data, cliArgs);
      // Parsing values insde the template !!
      // You can use variables now!!!

      Object.keys(data).forEach((e) => {
        if (!e.startsWith("__") && e.startsWith("_")) {
          // All vars which starts with _ are automatically cleaned up
          // as they are local for execute one Nexss Programmer Node.
          delete data[e];
        } else {
          data[e] = expressionParser(data, data[e]);
        }
      });

      // VERSION 2 MUCH MORE EFFICIENT
      // Twice as if is used for example:
      // nexss $# '${process.env.NEXSS_CACHE_PATH}' --y='${_[0]}'
      if (data !== undefined) {
        // console.log("DATA BEFORE: ", data);
        // data = expressionParser(data);
        // data = expressionParser(data);
        // console.log("DATA AFTER: ", data);
        // Because there is Select module and when use SelectOnly it
        // wipes out the nxsDelete, so we cache this here.

        // data = nxsInModule(data);

        // This is handy if you need to execute some command after node.
        // Like dropbox
        if (data.nxsExecute) {
          const nxsExecute = require("./output/nxsExecute");
          data = nxsExecute(data);
        }

        const nxsDeleteCache = data.nxsDelete;

        if (data.nxsConcat || data.nxsConcatFields) {
          const nxsConcat = data.nxsConcat || data.nxsConcatFields;
          data = nxsConcatModule(data, nxsConcat);
        }

        if (data.nxsGlue || data.nxsJoin) {
          const nxsJoinFields = data.nxsGlue || data.nxsJoin;
          data = nxsGlueModule(data, nxsJoinFields);
        }

        if (data.nxsConcatAs) {
          data = nxsConcatAsModule(data, data.nxsConcatAs);
        }

        if (data.nxsRenameFrom || data.nxsRenameTo) {
          data = nxsRenameModule(data, data.nxsRenameFrom, data.nxsRenameTo);
        }

        if (data.nxsSelect) {
          data = nxsSelectModule(data, data.nxsSelect);
        }

        if (nxsDeleteCache) {
          data = nxsDeleteModule(data, nxsDeleteCache);
        }

        if (data.nxsOutAs || data.nxsAs) {
          if (data.nxsIn) {
            data = nxsRenameModule(data, "nxsIn", data.nxsOutAs || data.nxsAs);
          } else if (data.nxsOut) {
            data = nxsRenameModule(data, "nxsOut", data.nxsOutAs || data.nxsAs);
          }

          delete data.nxsOutAs;
          delete data.nxsAs;
        }

        if (data.nxsField && data) {
          nxsFieldModule(data, data.nxsField);
          //process.exit(0) in the module as this is only one field as text
        }

        if (data.nxsFields) {
          // below couldn't get to working with nxsFieldsModule
          data = nxsFieldsModule(data, data.nxsFields);
        }

        delete data["nxsConcat"];
        delete data["nxsJoin"];

        delete data["nxsLocal"];
        delete data["nxsLocalForce"];
        delete data["nxsGlobal"];
        delete data["nxsGlobalForce"];

        delete data["nxsInfo"]; // nxsInfo is used in the packages to info about variables
        // if (!cliArgs.nxsPretty) {
        //   console.log(JSON.stringify(data));
        // } else {
        //   delete data["nxsPretty"];
        //   console.log(JSON.stringify(data, null, 2));
        // }

        // console.log(data);
        // self.push(data.toString("utf8").trim());
        if (process.argv.includes("--nxsDataSize")) {
          const {
            dataSize,
          } = require("../../nexss-start/lib/output/nxsDataSize");
          dataSize(data);
        }
        nxsDebugData(data, "Output", "cyan");

        // if (typeof data === "object") {
        //   data = JSON.stringify(data);
        // }
        // data += ""; //Incase it is not a string

        callback(null, { from: "transform-output", status: "ok", data });
      }
      // } else {
      //   callback(null, data);
      // }
      // if (chunk) callback(null, chunk);
    },
  });
};

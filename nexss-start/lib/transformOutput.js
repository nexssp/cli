const { Transform } = require("stream");
const cliArgs = require("minimist")(process.argv);
const { error, warn, ok } = require("../../lib/log");
const { bold, red } = require("../../lib/color");
const nxsFieldModule = require("./output/nxsField");
const nxsFieldsModule = require("./output/nxsFields");
const nxsConcatModule = require("./output/nxsConcat");
const nxsGlueModule = require("./output/nxsGlue");
const nxsConcatAsModule = require("./output/nxsConcatAs");
const nxsDeleteModule = require("./output/nxsDelete");
const nxsRenameModule = require("./output/nxsRename");
const nxsSelectModule = require("./output/nxsSelect");

require("../../lib/strings"); //we load string interpolate
const { expressionParser } = require("./expressionParser");

module.exports.transformOutput = () =>
  new Transform({
    // writableObjectMode: true,
    transform: (chunk, encoding, callback) => {
      let data = chunk.toString();

      if (data && data.startsWith("{")) {
        try {
          data = JSON.parse(data);
        } catch (error) {
          console.error(
            "ERROR in JSON (start/tranformOutput.js): ",
            chunk.toString()
          );

          callback(null, JSON.stringify(data));
        }

        // Parsing values insde the template !!
        // You can use variables now!!!

        // VERSION 1 LESS EFFICIENT(VERSION2 to fix)

        Object.keys(data).forEach(e => {
          data[e] = expressionParser(data, data[e]);
        });

        // VERSION 2 MUCH MORE EFFICIENT
        // Twice as if is used for example:
        // nexss $# '${process.env.NEXSS_CACHE_PATH}' --y='${_[0]}'
        if (data) {
          // console.log("DATA BEFORE: ", data);
          // data = expressionParser(data);
          // data = expressionParser(data);

          // console.log("DATA AFTER: ", data);
          // Because there is Select module and when use SelectOnly it
          // wipes out the nxsDelete, so we cache this here.
          const nxsDeleteCache = data.nxsDelete;
          if (data.nxsField && data) {
            nxsFieldModule(data, data.nxsField);
            //process.exit(0) in the module as this is only one field as text
          }

          if (data.nxsFields) {
            // below couldn't get to working with nxsFieldsModule
            data = nxsFieldsModule(data, data.nxsFields);
          }

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

          if (data.nxsAs) {
            data = nxsRenameModule(data, "nxsOut", data.nxsAs);
            delete data.nxsAs;
          }

          delete data["nxsConcat"];
          delete data["nxsJoin"];

          // if (!cliArgs.nxsPretty) {
          //   console.log(JSON.stringify(data));
          // } else {
          //   delete data["nxsPretty"];
          //   console.log(JSON.stringify(data, null, 2));
          // }

          // console.log(data);
          // self.push(data.toString("utf8").trim());

          callback(null, JSON.stringify(data));
        }
      } else {
        callback(null, data);
      }
      // if (chunk) callback(null, chunk);
    }
  });
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
const parserSyntax = require("./output/parserSyntax");
require("../../lib/strings"); //we load string interpolate

const expressionParser2 = data => {
  if (!data) return data;
  let jsON = JSON.stringify(data);

  parserSyntax.forEach(ps => {
    jsON = jsON.replace(ps.match, ps.replace);
  });

  // console.log("!!!JSON!!!!!", jsON);
  let errors = new Set();
  let inter;
  try {
    inter = jsON.interpolate(data);
  } catch (er) {
    let maybe = [];
    if (er.message.includes("is not defined")) {
      const undefinedVar = er.message.split(" ")[0];

      Object.keys(data).forEach(k => {
        if (undefinedVar.similarity(k) > 50) {
          maybe.push(k);
        }
      });
    }
    errors.add(
      `Some of your \$\{\} expression has an error.\nError message: ${bold(
        er.message
      )} ${maybe ? `\nDid you meant: ${bold(maybe.join(" or "))}?` : ""}`
    );
  }

  if (errors.size > 0) {
    errors.forEach(se => {
      error(se);
    });
    process.exit(0);
  }

  // console.log("!!!!!!!!!!!!", inter);
  return JSON.parse(inter.replace(/\\/g, "\\\\"));
};

const expressionParser = (data, exp) => {
  // console.log(data);

  // if (!exp) exp = data;
  // if (Object.prototype.toString.call(exp) === `[object Object]`) {
  //   return Object.assign(
  //     {},
  //     Object.keys(exp).map(ex => expressionParser(data, ex))
  //   );
  // }
  if (Array.isArray(exp)) {
    return exp.map(subexpr => expressionParser(data, subexpr));
  }

  let errors = new Set();
  if (exp && isNaN(exp) && exp.includes && exp.includes("${")) {
    try {
      return exp.interpolate(data);
    } catch (er) {
      let maybe = [];
      if (er.message.includes("is not defined")) {
        const undefinedVar = er.message.split(" ")[0];

        Object.keys(data).forEach(k => {
          if (undefinedVar.similarity(k) > 50) {
            maybe.push(k);
          }
        });
      }
      errors.add(
        `Error in parsing expression: ${exp},\nError message: ${er.message} ${
          maybe ? `\nDid you meant: ${maybe.join(" or ")}?` : ""
        }`
      );
    }
  }

  if (errors.size > 0) {
    errors.forEach(se => {
      error(se);
    });
    process.exit(0);
  }

  return exp;
};

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

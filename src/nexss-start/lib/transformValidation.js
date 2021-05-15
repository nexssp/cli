/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.transformValidation = (area = "input", options = {}) => {
  const { Transform } = require("stream");
  const validationMessages = require("./validationMessages");
  return new Transform({
    objectMode: true,
    highWaterMark: require("../../config/defaults").highWaterMark,
    // readableObjectMode: true,
    transform(chunk, encoding, callback) {
      // Not a json data so we don't do anything here
      if (chunk.stream === "cancel" || chunk.stream === "stop") {
        callback(null, chunk);
        return;
      }
      if (!cliArgs.nxsNoValidation) {
        let data = chunk.data;
        const opts = options;
        if (opts && Array.isArray(opts)) {
          let errorExists = [];
          // more: https://github.com/nexssp/cli/wiki/Data-Validation

          opts.forEach((k) => {
            if (k.validate) {
              k.validate.forEach((validation) => {
                let message;
                if (validation.message) {
                  message = validation.message.replace(
                    "<Field>",
                    "'" + k.name + "'"
                  );
                } else if (validationMessages[validation.type]) {
                  message = validationMessages[validation.type].message.replace(
                    "<Field>",
                    "'" + k.name + "'"
                  );
                } else {
                  log.error(
                    bold(
                      `Specify validation type or correct to the right one on the _nexss.yml: '${validation.type}' `
                    )
                  );
                  process.exit();
                }
                switch (validation.type) {
                  case "required":
                  case "Required":
                    if (
                      !data[k.name] ||
                      !(data[k.name] + "").match(
                        validationMessages[validation.type].regexp
                      )
                    ) {
                      errorExists.push(message);
                    }
                    break;
                  default:
                    if (
                      data[k.name] &&
                      !(data[k.name] + "").match(
                        validationMessages[validation.type].regexp
                      )
                    ) {
                      errorExists.push(message);
                    }
                    break;
                }
              });
            }
          });
          if (errorExists.length > 0) {
            log.error(
              `${bold("File/Package:")} ${process.nexssCWD}\\${
                process.nexssFilename
              }`
            );
            log.error(`${red("Data (" + area + ") Validation Error(s)")}`);
            console.log(bold(errorExists.join("\n")));
            console.log(bold("DATA:"));
            console.log(JSON.stringify(data, null, 2));
            process.exit(0);
          }
        }
      }
      if (chunk)
        callback(null, {
          from: "transform-validation",
          status: "ok",
          data: chunk.data,
        });
    },
  });
};

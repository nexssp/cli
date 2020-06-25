const { Transform } = require("stream");
const { red, bold } = require("../../lib/color");
const { di, ok, error } = require("../../lib/log");
const cliArgs = require("minimist")(process.argv);
const { inspect } = require("util");
const validationMessages = require("./validationMessages");
module.exports.transformValidation = (area = "input", options = {}) => {
  return new Transform({
    writableObjectMode: true,
    // readableObjectMode: true,
    transform(chunk, encoding, callback) {
      if (!cliArgs.nxsNoValidation) {
        let data = chunk.toString();
        const opts = options;
        if (opts && Array.isArray(opts)) {
          try {
            data = JSON.parse(data);
          } catch (er) {
            error(
              `There was an issue with JSON going out from command: ${bold(
                process.nexssCMD ? process.nexssCMD : "unknown"
              )}:`
            );
            error(
              `Current dir: ${bold(
                process.nexssCWD ? process.nexssCWD : "unknown"
              )}:`
            );
            error(data);
          }

          let errorExists = [];
          // more: https://github.com/nexssp/cli/wiki/Data-Validation

          opts.forEach((k) => {
            if (k.validate) {
              k.validate.forEach((validation) => {
                // console.log("VALIDATION!!!!!:", validation, "kname!!", k.name);
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
                  error(
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
            error(
              `${bold("File/Package:")} ${process.nexssCWD}\\${
                process.nexssFilename
              }`
            );
            error(`${red("Data (" + area + ") Validation Error(s)")}`);
            console.log(bold(errorExists.join("\n")));
            console.log(bold("DATA:"));
            console.log(JSON.stringify(data, null, 2));
            process.exit(0);
          }
        }
      }
      if (chunk) callback(null, chunk);
      //   process.stdout.write(`END ERROR TRANSFORMER ${title}\n\n `);
    },
  });
};

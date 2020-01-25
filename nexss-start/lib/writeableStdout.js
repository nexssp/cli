const { Writable } = require("stream");
const cliArgs = require("minimist")(process.argv);
const { error, warn, ok } = require("../../lib/log");
const { bold, red } = require("../../lib/color");

module.exports.writeableStdout = () =>
  new Writable({
    write: (chunk, encoding, callback) => {
      // Display single value

      if (cliArgs.test) {
        const testingData = require("../testingData.json");
        let data = "";
        try {
          data = JSON.parse(chunk.toString());
        } catch (er) {
          error(
            `There was an issue with JSON going out from file ${bold(
              process.nexssFilename ? process.nexssFilename : "unknown"
            )}:`
          );
          error(data);
        }
        if (data) {
          let errorExists;
          Object.keys(testingData).forEach(k => {
            if (testingData[k] !== data[k]) {
              error(bold(red(testingData[k])), `Not Equal to`);
              error(bold(red(data[k])));
              errorExists = true;
            } else {
              ok(bold(`Field ${k} is correct:`, data[k]));
            }
          });
          if (errorExists) {
            warn("Program has been terminated.");
            process.exit(1);
          }
        }
      }

      const field = cliArgs.field;
      // Display, selectm multuple values
      let fields = cliArgs.fields;
      if (cliArgs.field) {
        const data = JSON.parse(chunk.toString());
        if (!data[field]) {
          console.error(`'${field} does not exist'`);
        } else console.log(data[field]);
      } else if (fields && fields.split) {
        values = fields.split(",").map(e => {
          return JSON.parse(chunk.toString())[e];
        });
        const merged = fields
          .split(",")
          .reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
        console.log(JSON.stringify(merged));
      } else {
        console.log(chunk.toString());
      }

      callback();
    }
  });

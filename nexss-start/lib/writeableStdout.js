const { Writable } = require("stream");
const cliArgs = require("minimist")(process.argv);
const { error, warn, ok } = require("../../lib/log");
const { bold, red } = require("../../lib/color");

module.exports.writeableStdout = () =>
  new Writable({
    write: (chunk, encoding, callback) => {
      // Display single value

      const field = cliArgs.nxsField;
      // Display, selectm multuple values
      let fields = cliArgs.nxsFields;
      if (field) {
        const data = JSON.parse(chunk.toString());

        if (!data[field]) {
          console.error(`'${field} does not exist'`);
        } else {
          console.log(data[field]);
        }
      } else if (fields && fields.split) {
        const parsed = JSON.parse(chunk.toString());
        values = fields.split(",").map(e => {
          return parsed[e];
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

const { Writable } = require("stream");
const cliArgs = require("minimist")(process.argv);

module.exports.writeableStdout = () =>
  new Writable({
    write: (chunk, encoding, callback) => {
      // Display single value
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

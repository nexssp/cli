const { Writable } = require("stream");
const cliArgs = require("minimist")(process.argv);

module.exports.writeableStdout = () =>
  new Writable({
    write: (chunk, encoding, callback) => {
      let fields = cliArgs.fields;
      if (fields) {
        values = fields.split(",").map(e => {
          return JSON.parse(chunk.toString())[e];
        });
        const merged = fields
          .split(",")
          .reduce((obj, key, index) => ({ ...obj, [key]: values[index] }), {});
        console.log(merged);
      } else {
        console.log(chunk.toString());
      }

      callback();
    }
  });

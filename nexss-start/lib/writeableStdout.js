const { Writable } = require("stream");
const cliArgs = require("minimist")(process.argv);

module.exports.writeableStdout = () =>
  new Writable({
    write: (chunk, encoding, callback) => {
      let fields = cliArgs.fields;
      if (fields && fields.split) {
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

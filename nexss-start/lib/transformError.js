const { Transform } = require("stream");
const { yellow } = require("@nexssp/ansi");
const { di } = require("../../lib/log");
const { inspect } = require("util");
module.exports.transformError = (
  title = "no title",
  args = [],
  options = {}
) => {
  return new Transform({
    highWaterMark: require("../../config/defaults").highWaterMark,
    writableObjectMode: true,
    // readableObjectMode: true,
    transform(chunk, encoding, callback) {
      // if (process.stdout.clearLine) {
      //   process.stdout.clearLine();
      //   process.stdout.cursorTo(0);
      // }
      chunk = chunk.toString();
      // const data = JSON.parse(chunk);
      // di("111111111", data);
      di(`${yellow(title)} \n ${inspect(chunk)}\n${yellow(title)} \n`);
      //chunk.teeeeeeet = "works!!";
      //   process.stdout.write(
      //     `ERROR TRANSFORMER:${title}\n================\n${chunk}======================\n`
      //   );
      if (chunk) callback(null, chunk);
      //   process.stdout.write(`END ERROR TRANSFORMER ${title}\n\n `);
    },
  });
};

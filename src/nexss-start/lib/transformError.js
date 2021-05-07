module.exports.transformError = (
  title = "no title",
  args = [],
  options = {}
) => {
  const { Transform } = require("stream");
  const { inspect } = require("util");
  return new Transform({
    highWaterMark: require("../../config/defaults").highWaterMark,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
      if (process.NEXSS_CANCEL_STREAM) {
        callback(null, chunk);
        return;
      }
      // if (process.stdout.clearLine) {
      //   process.stdout.clearLine();
      //   process.stdout.cursorTo(0);
      // }
      chunk = chunk.toString();
      log.di(`${yellow(title)} \n ${inspect(chunk)}\n${yellow(title)} \n`);
      //chunk.teeeeeeet = "works!!";
      //   process.stdout.write(
      //     `ERROR TRANSFORMER:${title}\n================\n${chunk}======================\n`
      //   );
      if (chunk) callback(null, chunk);
      //   process.stdout.write(`END ERROR TRANSFORMER ${title}\n\n `);
    },
  });
};

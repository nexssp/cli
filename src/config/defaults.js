const { nConst } = require("@nexssp/const");

module.exports.defaultExecuteOptions = {
  quiet: false,
};

module.exports.highWaterMark = 200 * 1024;

// Special char is used to make special streams
// For example ! is for run system commands.
// It can be also used to create new one in the future
// for special operations and still be in the stream
// ddd(process.argv);

nConst("isSpecialChar", function (char) {
  const firstChar = char;
  const specialChars = ["$#", "$", ":", "::", "!", "%", "*"]; // $# is depracated
  if (specialChars.includes(firstChar)) {
    return firstChar;
  }
});

nConst("startWithSpecialChar", function (char) {
  const specialChars = ["$#", "$", "::", ":", "!!", "!", "%", "***", "**", "*"]; // $# is depracated
  for (let index = 0; index < specialChars.length; index++) {
    if (char.startsWith(specialChars[index])) {
      return specialChars[index];
    }
  }
});

nConst("getStreamBasedOnSpecialChar", function (char) {
  return "transformHash";
});

const { nConst } = require("@nexssp/const");

module.exports.defaultExecuteOptions = {
  quiet: false,
};

module.exports.highWaterMark = 200 * 1024;

// Special char is used to make special streams
// For example ! is for run system commands.
// It can be also used to create new one in the future
// for special operations and still be in the stream
let isSC;
// ddd(process.argv);

nConst("isSpecialChar", function () {
  if (isSC && isSC !== undefined) return isSC;
  const firstChar = cliArgs._[0];
  const specialChars = ["$#", "$", ":", "::", "!", "%", "*"]; // $# is depracated
  if (specialChars.includes(firstChar)) {
    isSC = firstChar;
    return firstChar;
  } else {
    isSC = false;
  }
});

module.exports.NEXSS_SPECIAL_CHAR = isSpecialChar() || "$#";

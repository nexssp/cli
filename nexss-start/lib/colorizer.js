const { red, yellow, green, bold } = require("../../lib/color");
module.exports.colorizer = txt => {
  if (txt.startsWith("OK")) {
    return green(txt);
  } else if (txt.startsWith("INFO")) {
    return bold(txt);
  } else if (txt.startsWith("WARN")) {
    return yellow(txt);
  }

  return txt;
};

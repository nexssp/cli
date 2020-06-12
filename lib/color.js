const {
  grey,
  bold,
  red,
  green,
  blue,
  yellow,
  white,
  magenta,
  cyan,
} = require("chalk");

module.exports = {
  purple: (...args) => `\x1b[35m${args.join("")}\x1b[0m`,
  underscore: (...args) => `\x1b[4m${args.join("")}\x1b[0m`,
  grey,
  bold,
  red: (...args) => args.map((e) => red(bold(e))).join(""),
  green,
  blue,
  yellow,
  magenta,
  cyan,
  white,
};

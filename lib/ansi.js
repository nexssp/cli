const ansi = (color, bold) => (...args) =>
  `${bold ? "\x1b[1m" : ""}${color ? "\x1b[" + color : ""}${args.join(
    ""
  )}\x1b[0m`;

const colors = {
  bold: (...args) => ansi("1m")(...args),
  grey: (...args) => ansi("90m")(...args),
  greyBG: (...args) => ansi("100m")(...args),
  purple: (...args) => ansi("35m")(...args),
  purpleBG: (...args) => ansi("45m")(...args),
  underscore: (...args) => ansi("4m")(...args),
  red: (...args) => ansi("31m")(...args),
  redBG: (...args) => ansi("41m")(...args),
  redBG2: (...args) => ansi("101m")(...args),
  green: (...args) => ansi("32m")(args),
  greenBG: (...args) => ansi("42m")(...args),
  greenBG2: (...args) => ansi("102m")(...args),
  blue: (...args) => ansi("34m")(...args),
  blueBG: (...args) => ansi("44m")(...args),
  blueBG2: (...args) => ansi("104m")(...args),
  yellow: (...args) => ansi("33m")(...args),
  yellowBG: (...args) => ansi("43m")(...args),
  yellowBG2: (...args) => ansi("103m")(...args),
  magenta: (...args) => ansi("35m")(...args),
  magentaBG: (...args) => ansi("45m")(...args),
  magentaBG2: (...args) => ansi("105m")(...args),
  cyan: (...args) => ansi("36m")(...args),
  cyanBG: (...args) => ansi("46m")(...args),
  orangeBG: (...args) => ansi("106m")(...args),
  white: (...args) => ansi("30m")(ansi("37m")(...args)),
  whiteBG: (...args) => ansi("47m")(...args),
  black: (...args) => ansi("30m")(...args),
  blackBG: (...args) => ansi("40m")(...args),
};

module.exports = Object.assign({}, colors);

Object.assign(module.exports, {
  // Cursor moves
  up: (...args) => ansi("1A")(...args),
  down: (...args) => ansi("1B")(...args),
  right: (...args) => ansi("1C")(...args),
  left: (...args) => ansi("1D")(...args),
  saveCursor: (...args) => ansi("s")(...args),
  restoreCursor: (...args) => ansi("u")(...args),
  clearScreen: (...args) => ansi("2J")(...args),
});

module.exports.colors = Object.keys(colors);
module.exports.ansi = ansi;

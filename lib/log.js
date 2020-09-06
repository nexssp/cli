/*
 * Title: Log/Debug - Nexss Framework
 * Description: Log and Debug options
 * Author: Marcin Polak
 * 2018/02/01 initial version
 * 2019/08/05 modify to 'curry' function
 * usage: eg. dy("my message");
 */

const {
  yellow,
  red,
  green,
  blue,
  bold,
  underscore,
  white,
} = require("./color");

const isVerbose = process.argv.indexOf("--verbose") >= 0;
const isDebug = process.argv.indexOf("--debug") >= 0;
// display only end result
const isResult = process.argv.indexOf("--result") >= 0;
const isErrorPiped = process.argv.indexOf("--nxsPipeErrors") >= 0;
const nexssLog = (consoleType) => (pre) => (color = bold) => (...args) => {
  if (consoleType === "error") {
    if (isErrorPiped) consoleType = "log"; // Pipe erorrs to stdout (eg for testing purposes)
  }

  console[consoleType](color(`${pre} `), ...args); //.map(e => color(bold(e)))
};

const nexssDebug = (consoleType) => (pre) => (color = bold) => (...args) => {
  if (!isDebug) return;
  if ((isVerbose || consoleType === "error") && !isResult) {
    if (isErrorPiped) consoleType = "log"; // Pipe erorrs to stdout (eg for testing purposes)
    console[consoleType](color(`${pre} `), ...args);
  }
};

const dbg = (...args) => {
  if (isDebug) {
    console.log(...args);
  }
};

module.exports = {
  dbg,
  d: nexssDebug("error")("DEBUG")(), // debug normal
  dy: nexssDebug("error")("DEBUG")(yellow), // debug yellow
  dr: nexssDebug("error")("DEBUG")(red), // debug red
  dg: nexssDebug("error")("DEBUG")(green), // debug green
  db: nexssDebug("error")("DEBUG")(blue), // debug blue
  di: nexssDebug("error")("DEBUG")(bold), // debug info/bolds
  du: nexssDebug("error")("DEBUG")(underscore), // debug info/bolds
  // Log
  warn: nexssLog("error")("WARN")(yellow),
  error: nexssLog("error")("ERROR")(red),
  info: nexssLog("error")("INFO")(white),
  success: nexssLog("error")("SUCCESS")(green),
  ok: nexssLog("error")("OK")(green),
  trace: nexssLog("error")("TRACE")(green),
  header: (...args) =>
    console.log(
      bold(`======================== ${args.join("")} ========================`)
    ),
  isErrorPiped,
};

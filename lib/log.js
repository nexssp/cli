/*
 * Title: Log/Debug - Nexss Framework
 * Description: Log and Debug options
 * Author: Marcin Polak
 * 2018/02/01 initial version
 * 2019/08/05 modify to 'curry' function
 * usage: eg. dy("my message");
 */

const { yellow, red, green, blue, bold, underscore } = require("./color");

const isVerbose = process.argv.indexOf("--verbose") >= 0;
const isDebug = process.argv.indexOf("--debug") >= 0;
// display only end result
const isResult = process.argv.indexOf("--result") >= 0;
const isErrorPiped = process.argv.indexOf("--pipeerrors") >= 0;
const nexssLog = consoleType => pre => (color = bold) => (...args) => {
  if (consoleType === "error") {
    if (isErrorPiped) consoleType = "log"; // Pipe erorrs to stdout (eg for testing purposes)
  }

  console[consoleType](color(`${pre} `), ...args.map(e => bold(color(e))));
};

const nexssDebug = consoleType => pre => (color = bold) => (...args) => {
  if ((isVerbose || consoleType === "error") && !isResult) {
    if (isErrorPiped) consoleType = "log"; // Pipe erorrs to stdout (eg for testing purposes)
    console[consoleType](color(`${pre} `), ...args.map(e => color(bold(e))));
  }
};

const dbg = (...args) => {
  if (isDebug) {
    console.log(...args);
  }
};

module.exports = {
  dbg,
  d: nexssDebug("debug")("DEBUG")(), // debug normal
  dy: nexssDebug("debug")("DEBUG")(yellow), // debug yellow
  dr: nexssDebug("debug")("DEBUG")(red), // debug red
  dg: nexssDebug("debug")("DEBUG")(green), // debug green
  db: nexssDebug("debug")("DEBUG")(blue), // debug blue
  di: nexssDebug("debug")("DEBUG")(bold), // debug info/bolds
  du: nexssDebug("debug")("DEBUG")(underscore), // debug info/bolds
  // Log
  warn: nexssLog("warn")("WARN")(yellow),
  error: nexssLog("error")("ERROR")(red),
  info: nexssLog("info")("INFO")(green),
  success: nexssLog("info")("SUCCESS")(green),
  ok: nexssLog("info")("OK")(green),
  trace: nexssLog("trace")("TRACE")(green),
  header: (...args) => console.log(bold(` --- ${args.join("")} ---`))
};

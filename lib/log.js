/*
 * Title: Log/Debug - Nexss Framework
 * Description: Log and Debug options
 * Author: Marcin Polak
 * 2018/02/01 initial version
 * 2019/08/05 modify to 'curry' function
 * usage: eg. dy("my message");
 */

const { yellow, red, green, blue, bold, underscore } = require("./color");

const isVerbose = process.argv.indexOf("--quiet") < 0;
// display only end result
const isResult = process.argv.indexOf("--result") >= 0;
const isErrorPiped = process.argv.indexOf("--pipeerrors") >= 0;
const nexssLog = consoleType => pre => (color = bold) => (...args) => {
  if ((isVerbose || consoleType === "error") && !isResult) {
    if (isErrorPiped) consoleType = "log"; // Pipe erors to stdout (eg for testing purposes)
    console[consoleType](color(`${pre} `), ...args);
  }
};

module.exports = {
  d: nexssLog("debug")("DEBUG")(), // debug normal
  dy: nexssLog("debug")("DEBUG")(yellow), // debug yellow
  dr: nexssLog("debug")("DEBUG")(red), // debug red
  dg: nexssLog("debug")("DEBUG")(green), // debug green
  db: nexssLog("debug")("DEBUG")(blue), // debug blue
  di: nexssLog("debug")("DEBUG")(bold), // debug info/bolds
  du: nexssLog("debug")("DEBUG")(underscore), // debug info/bolds
  // Log
  warn: nexssLog("warn")("WARN")(yellow),
  error: nexssLog("error")("ERROR")(red),
  info: nexssLog("info")("INFO")(green),
  success: nexssLog("info")("SUCCESS")(green),
  ok: nexssLog("info")("OK")(green),
  trace: nexssLog("trace")("TRACE")(green),
  header: (...args) => console.log(bold(` --- ${args.join("")} ---`))
};

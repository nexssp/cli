module.exports = () => {
  const { ok } = require("../../lib/log");
  const { bold } = require("../../lib/color");
  const { nohup } = require("../nohup.js");
  let argv = process.argv.slice(3);
  const command = "nexss " + argv.join(" ");
  ok("Execute in the background: " + bold(command));
  nohup(command);
};

module.exports = () => {
  const { ok } = require("../../lib/log");
  const { bold } = require("../../lib/color");
  process.argv = process.argv;
  const { nohup } = require("../nohup.js");
  let argv = process.argv.slice(3);
  const command = "nexss " + argv.join(" ");
  ok("Execute in the background: " + bold(command));
  nohup("nexss " + argv.join(" "));
};

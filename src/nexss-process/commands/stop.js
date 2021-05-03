const { success, error } = require("../../lib/log");
const { bold } = require("@nexssp/ansi");
const { stop } = require("../../lib/proc");
const pid = process.argv[4];

const example = `nexss ps stop 12345`;

if (pid && isNaN(pid)) {
  error(`Port must be a number: eg ${bold(example)}`);
  process.exit();
}

if (process.argv.length > 5) {
  error(`To many arguments (${process.argv.length}). try eg. ${bold(example)}`);
  process.exit();
}
stop(pid);
success("done.");

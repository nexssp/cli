const { success, error } = require("../../lib/log");
const { bold } = require("../../lib/color");
const { stop } = require("../../lib/proc");
const pid = process.argv[4];

const example = `nexss ps stop 12345`;

if (pid && isNaN(pid)) {
  error(`Port must be a number: eg ${bold(example)}`);
  process.exit(1);
}

if (process.argv.length > 5) {
  error(`To many arguments (${process.argv.length}). try eg. ${bold(example)}`);
  process.exit(1);
}
stop(pid);
success("done.");

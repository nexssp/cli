// console.log(
//   "There is a default file (the same name as plugin - if exists then run it rather then help)"
// );
const { yellow } = require("../../lib/ansi");
const { info } = require("../../lib/log");
const { displayProcesses } = require("../../lib/proc");

info(yellow(`Nexss Processes`));
displayProcesses();

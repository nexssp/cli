// console.log(
//   "There is a default file (the same name as plugin - if exists then run it rather then help)"
// );
const { blue } = require("../../lib/color");
const { info } = require("../../lib/log");
const { displayProcesses } = require("../../lib/proc");

info(blue(`Nexss Processes`));
displayProcesses();

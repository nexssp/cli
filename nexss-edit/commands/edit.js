const { error } = require("../../lib/log");
const cliArgs = require("minimist")(process.argv.slice(3));
var options = {};
options.fileName = cliArgs._[0] || options.fileName || "";

const { edit } = require("../lib/edit");
edit(options.fileName);

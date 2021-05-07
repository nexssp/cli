var options = {};
options.fileName = cliArgs._[1] || options.fileName || "";

const { edit } = require("../lib/edit");
edit(options.fileName);

const { success } = require("../../lib/log");
const { cleanProcesses } = require("../../lib/proc");

cleanProcesses();
success("done.");

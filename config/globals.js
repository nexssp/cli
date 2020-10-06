if (!process.dataFlow) process.dataFlow = [];

Object.assign(global, require("@nexssp/ansi"));

global.nConst = (name, value, where) => {
  if (!where) {
    where = global; // process, any Object ..
  }
  Object.defineProperty(where, name, {
    set: function (v) {
      console.error(
        red(bold("PROGRAM TERMINATED:")),
        green(
          ` ${bold(name)} is a ${yellow(
            bold("constant")
          )}. You cannot change it.\n${bold(name)}\nhas a value:`
        ),
        green(bold(value)) + "\nnew value:",
        red(bold(v))
      );
      process.exit(1);
    },
    get: function () {
      return value;
    },
  });
  return value;
};

// TODO: cache for below
const os = require("@nexssp/os");
nConst("distro", os.name(), process);
nConst("distroVersion", os.v(), process);
nConst("distroSudo", os.sudo(), process);
nConst("replacePMByDistro", os.replacePMByDistro, process);
const tags = os.tags();
// Below tags are for distro recognition.
nConst("distroTag1", tags[0], process);
nConst("distroTag2", tags[1], process);
nConst("mem", process.memoryUsage().rss, process); // https://nodejs.org/api/process.html#process_process_memoryusage

// if (process.argv.includes("--nxsLoad")) {
// }
// Later to make usage below on whole system.
nConst("fs", require("fs"));
nConst("path", require("path"));
nConst("cliArgs", require("minimist")(process.argv));
// nConst("require", require);
nConst("child_process", require("child_process"));
// nConst("dev_colors", require("../lib/core/-dev-colors"));
nConst("PROCESS_CWD", process.cwd());

const globalConfigPath = require("os").homedir() + "/.nexss/config.json";

if (fs.existsSync(globalConfigPath)) {
  process.nexssGlobalConfig = require(globalConfigPath);
} else {
  process.nexssGlobalConfig = { languages: {} };
}

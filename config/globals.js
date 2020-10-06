Object.assign(global, require("@nexssp/ansi"));

global.nConst = (name, value) => {
  Object.defineProperty(global, name, {
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

const os = require("@nexssp/os");
nConst("distro", os.name());
nConst("distroVersion", os.v());

nConst("fs", require("fs"));
nConst("path", require("path"));
nConst("child_process", require("child_process"));
nConst("dev_colors", require("../lib/core/-dev-colors"));
nConst("mem", process.memoryUsage); // https://nodejs.org/api/process.html#process_process_memoryusage
nConst("PROCESS_CWD", process.cwd());

const globalConfigPath = require("os").homedir() + "/.nexss/config.json";

if (fs.existsSync(globalConfigPath)) {
  process.nexssGlobalConfig = require(globalConfigPath);
} else {
  process.nexssGlobalConfig = { languages: {} };
}

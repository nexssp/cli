if (!process.dataFlow) process.dataFlow = [];

Object.assign(global, require("@nexssp/ansi")); // Cli tool
global.log = require("@nexssp/logdebug"); //  Cli tool

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

nConst("aliases", require("../config/aliases"), process);

// TODO: cache for below
const os = require("@nexssp/os");
nConst("distro", os.name(), process);
nConst("distroVersion", os.v(), process);
nConst("sudo", os.sudo(), process);
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
nConst("cliArgs", require("minimist")(process.argv.slice(2)));
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

const { checkPlatform } = require("../lib/platform");

if (cliArgs.nxsPlatform && cliArgs.nxsPlatform.split) {
  const platforms = cliArgs.nxsPlatform.split(",");
  if (!checkPlatform(platforms)) {
    console.log(
      `${yellow("Nexss Programmer: ")}${bold(
        red(platforms.join(", "))
      )} did not match with your platform ${green(
        bold(process.platform)
      )}, ${green(bold(process.distroTag1))} or ${green(
        bold(process.distroTag2)
      )}. Program will not continue.`
    );

    // process.NEXSS_ARG_CHECK_PLATFORM_FAILED = true;
    process.exit(1);
  }
}

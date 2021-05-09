const { nConst } = require("@nexssp/const");
// We load nConst as global function
nConst("nConst", nConst);

require("./defaults");

nConst("NEXSSP_VERSION", require("../../package.json").version);

// Adding colors to global as they are used very often.
Object.assign(global, require("@nexssp/ansi"));
global.log = require("@nexssp/logdebug");

nConst("aliases", require("../config/aliases"), process);

nConst("ddd", require("@nexssp/dddebug").ddd);

// Get only keys but validate them
nConst("stack", require("@nexssp/stack").stack, process);
nConst("nexss", require("../nexss-core/arguments").keys);

const os = require("@nexssp/os");
nConst("distro", os.name(), process);
nConst("distroVersion", os.v(), process);
nConst("sudo", os.sudo(), process);
nConst("distros", os.distros, process);
nConst("replacePMByDistro", os.replacePMByDistro, process);
const tags = os.tags();
// Below tags are for distro recognition.
nConst("distroTag1", tags[0], process);
nConst("distroTag2", tags[1], process);
try {
  nConst("mem", process.memoryUsage().rss, process); // https://nodejs.org/api/process.html#process_process_memoryusage
} catch (error) {
  nConst("mem", 0, process); // https://nodejs.org/api/process.html#process_process_memoryusage
}

// Later to make usage below on whole system.
nConst("fs", require("fs"));
nConst("path", require("path"));

nConst("cliArgs", require("minimist")(process.argv.slice(2)));
nConst("isErrorPiped", cliArgs.nxsPipeErrors || cliArgs[nexss["error:pipe"]]);

nConst("PROCESS_CWD", process.cwd());
nConst("shell", os.getShell(), process);
const globalConfigPath = path.normalize(
  require("os").homedir() + "/.nexss/config.json"
);
nConst("nexssGlobalConfigPath", globalConfigPath, process);

if (fs.existsSync(process.nexssGlobalConfigPath)) {
  process.nexssGlobalConfig = require(process.nexssGlobalConfigPath);
} else {
  process.nexssGlobalConfig = { languages: {} };
}

const { checkPlatform } = require("../lib/platform");

const nxsPlatform = cliArgs.nxsPlatform || cliArgs[nexss["platform:check"]];

if (nxsPlatform && nxsPlatform.split) {
  const platforms = nxsPlatform.split(",");
  if (!checkPlatform(platforms)) {
    const info = `${yellow("Nexss Programmer: ")}${bold(
      red(platforms.join(", "))
    )} did not match with your platform ${green(
      bold(process.platform)
    )}, ${green(bold(process.distroTag1))} or ${green(
      bold(process.distroTag2)
    )}. Program will NOT continue.`;

    if (!cliArgs[nexss["platform:noerror"]]) {
      console.error(info);
      process.exit(1);
    } else {
      log.warn(
        `WARN: `,
        info.replace("Program will NOT continue", "But program WILL continue")
      );
      process.exit(0);
    }
  }
}

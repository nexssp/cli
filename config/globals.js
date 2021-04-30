const { nConst } = require("@nexssp/const");
const os = require("@nexssp/os");

// Adding colors to global as they are used very often.
Object.assign(global, require("@nexssp/ansi"));
global.log = require("@nexssp/logdebug");

nConst("aliases", require("../config/aliases"), process);
nConst("ddd", (...args) => {
  args.map((e) => {
    process.stdout.write(yellow(bold(require("util").inspect(e) + "\n")));
  });

  console.log(yellow(`Stopped by ddd Function at:`));
  const getCallerFile = require("get-caller-file");
  console.log(bold(getCallerFile()));
  const timeDiff = process.hrtime(process.startTime);
  console.log(
    bold("exec time: " + green(`${timeDiff[0]}s ${timeDiff[1] / 1000000}ms`))
  );
  console.log(bold("cwd: ", green(bold(process.cwd()))));
  process.exit(0);
});
// Get only keys but validate them
nConst("stack", require("../lib/error").stack, process);
nConst("nexss", require("../nexss-core/arguments").keys);
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
// nConst("require", require);
nConst("child_process", require("child_process"));
// nConst("dev_colors", require("../lib/core/-dev-colors"));
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

    process.exit(1);
  }
}

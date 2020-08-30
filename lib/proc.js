const { dirname, basename, join } = require("path");
// const { NEXSS_PROCESS_PATH } = require("../config/config");
const { unlinkSync, writeFileSync, readFileSync } = require("fs");
const fg = require("fast-glob");
const { bold, green, red, yellow } = require("./color");
const { error } = require("./log");
const path = require("path");

module.exports.displayProcesses = () => {
  const Table = require("cli-table3");
  const processes = getProcesses();

  var table = new Table({
    head: [
      green("pid"),
      green("name"),
      green("version"),
      green("cpu"),
      green("status"),
    ],
  });
  processes.forEach((item) => {
    const regExp = new RegExp(
      /^nexss \((?<version>.*?):(?<pid>\d+?)\) (?<command>.*?) (?<port>\d+?)$/,
      "gis"
    );

    let match = item.description.matchAll(regExp);
    const ArrayMatch = Array.from(match);

    if (ArrayMatch && ArrayMatch[0] && ArrayMatch[0].groups) {
      let groups = ArrayMatch[0].groups;

      table.push([
        bold(yellow(groups.pid)),
        bold(yellow(groups.command)),
        bold(groups.version),
        bold(item.cpu),
        item.status == "Running" ? green(item.status) : item.status,
        // module.exports.isRunning(item.pid, item.filename)
        //   ? green("running")
        //   : red("stopped"),
      ]);
    }
  });
  console.log(table.toString());
};

//removes stopped processes
module.exports.cleanProcesses = () => {
  const processes = module.exports.getProcessesFiles();
  processes.forEach((procFile) => {
    const procObj = require(procFile);
    if (!isRunning(procObj.pid)) {
      unlinkSync(procFile);
    }
  });
};

// process signal https://nodejs.org/api/process.html#process_signal_events
module.exports.kill = (pid) => {
  // - means detached process
  process.kill(-pid);
};

module.exports.stop = (pid) => {
  try {
    if (process.platform === "win32") {
      process.kill(pid, "SIGTERM");
    } else {
      process.kill(pid, "SIGSTOP");
    }
  } catch (err) {
    switch (err.code) {
      case "ESRCH":
        error(
          bold(
            "No process or process group can be found corresponding to that specified by pid."
          )
        );
        process.exit();
        break;

      default:
        error(bold(err));
        break;
    }
    console.log(err);
  }
};
var taskListCache;
function getLines() {
  var execSync = require("child_process").execSync;
  if (!taskListCache) {
    taskListCache = execSync("tasklist /v /NH");
  }

  return taskListCache;
}
// Below could be done task list /fo csv (maybe later to change?)
function getProcesses(search) {
  const lines = getLines().toString().split("\n");

  let processes = [];
  for (var line of lines) {
    var parts = line.split("=");
    for (var i of parts) {
      const item = i.toString();

      if (item.indexOf("nexss (") > -1) {
        if (search && item.indexOf(search) === -1) {
          continue;
        }

        //   const afterNexss = items.toString().split("nexss")[1];
        //   console.log(afterNexss);
        const regExp = new RegExp(
          /^(?<name>.*?)\s+(?<pid>\d+?)\s+(?<sessionName>.*?)\s+(?<session>\d?)\s+(?<mem>\d+.\d+ .?)\s+(?<status>.*?)\s+(?<user>.*?)\s+(?<cpu>.*?)\s+(?<description>.*?)$/,
          "gis"
        );
        let match = item.matchAll(regExp);
        const ArrayMatch = Array.from(match);

        if (ArrayMatch && ArrayMatch[0] && ArrayMatch[0].groups) {
          let groups = ArrayMatch[0].groups;
          groups.description = groups.description.trim();
          if (groups.name === "conhost.exe") {
            groups.name = "nexss";
          }
          processes.push(Object.assign({ line: item }, groups));
        }
      }
    }
  }

  return processes;
}

module.exports.processSendSignal = (pid, sig) => {
  process.kill(pid, sig);
};

module.exports.isRunning = (pid, fileName) => {
  if (!pid) {
    return false;
  }
  const procs = getProcesses();
  for (var pItem of procs) {
    if (pItem["pid"] == pid) {
      const file = pItem["description"].split(" ")[2];
      // console.log("file", file);
      // console.log("fileName", fileName);
      // console.log(file.indexOf(fileName));
      if (!fileName || file.indexOf(fileName) > -1) {
        return pItem;
      }
    }
  }
};

const { dirname, basename, join } = require("path");
const { NEXSS_PROCESS_PATH } = require("../config/config");
const { unlinkSync, writeFileSync, readFileSync } = require("fs");
const isRunning = require("is-running");
const fg = require("fast-glob");
const { bold, green, red, yellow } = require("./color");
const { error } = require("./log");

class Proc {
  constructor(pid, { filePath, code, type, detached } = {}) {
    if (!pid) {
      throw new Error("You need to pass pid");
    }
    if (!filePath) {
      throw new Error(
        `You need to pass filePath as second argument 
        eg. new Proc(12, {filePath:"myfilepath"})`
      );
    }

    this.data = {};
    this.data.pid = pid;
    this.data.path = filePath ? dirname(filePath) : "";
    this.data.filename = filePath ? basename(filePath) : "";
    this.data.started = new Date().toISOString();
    this.data.code = code; // eg 0, 1, 2
    this.data.type = type || "sync";
    this.data.detached = detached;
    this._filePath = join(
      NEXSS_PROCESS_PATH,
      filePath
        .replace(/\\/g, "_")
        .replace(/\//g, "_")
        .replace(":", "_") + ".pid.json"
    );
    //console.log(this._filePath);
  }

  get() {
    return this.data;
  }

  write() {
    // We make sure we have the latest status of the process
    if (!this.data.code && this.data.code !== 0)
      this.data.status = this.status();
    writeFileSync(this._filePath, JSON.stringify(this.data));
  }

  status() {
    if (this.data.code) {
      // Process has returned status code (sync)
      if (this.data.code === 0) {
        return "completed";
      } else if (this.data.code === 1) {
        return `error`;
      } else if (this.data.code > 1) {
        return `error:${this.data.code}`;
      }
    }

    return isRunning(this.pid) ? "running" : "stopped";
  }

  load() {
    this.data = JSON.parse(readFileSync(this._filePath));
    return this.data;
  }
}

module.exports.getProcessesFiles = () => {
  return fg.sync([`${NEXSS_PROCESS_PATH.replace(/\\/g, "/")}/*`]);
};

module.exports.displayProcesses = () => {
  const Table = require("cli-table3");
  const processes = module.exports.getProcessesFiles();
  var table = new Table({
    head: [
      green("pid"),
      green("filename"),
      green("path"),
      green("started"),
      green("status")
    ]
  });
  processes.forEach(procFile => {
    const json = require(procFile);
    table.push([
      bold(yellow(json.pid)),
      bold(json.filename),
      bold(json.path),
      json.started
        ? json.started
            .replace(/T/, " ") // replace T with a space
            .replace(/\..+/, "")
        : "-",
      isRunning(json.pid) ? green("running") : red("stopped")
    ]);
  });
  console.log(table.toString());
};

//removes stopped processes
module.exports.cleanProcesses = () => {
  const processes = module.exports.getProcessesFiles();
  processes.forEach(procFile => {
    const procObj = require(procFile);
    if (!isRunning(procObj.pid)) {
      unlinkSync(procFile);
    }
  });
};

// process signal https://nodejs.org/api/process.html#process_signal_events
module.exports.kill = pid => {
  // - means detached process
  process.kill(-pid);
};

module.exports.stop = pid => {
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

module.exports.processSendSignal = (pid, sig) => {
  process.kill(pid, sig);
};

module.exports.Proc = Proc;
module.exports.NEXSS_PROCESS_PATH = NEXSS_PROCESS_PATH;
// const p = new Proc(1234, { pidd: 123, filePath: "/zz/tty/xxx" });
// console.log(p.get());
// console.log(p.write());
// console.log(p.load());

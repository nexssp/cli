module.exports.x = () => {
  const { bold } = require("@nexssp/ansi");
  const { nohup } = require("../nohup.js");
  const { title } = require("../../lib/proc");
  let argv = process.argv.slice(3);
  const command = "nexss " + argv.join(" ");
  process.title = title();
  log.ok("Execute in the background: " + bold(command));
  nohup(command);
};

module.exports = () => {
  const { title } = require("../../lib/proc");
  const { spawn } = require("child_process");
  const out = fs.openSync("./out.log", "a");
  const err = fs.openSync("./out.log", "a");

  let argv = process.argv.slice(3);
  // const command = "nexss " + argv.join(" ");

  process.title = title();
  const opts = {
    detached: true,
    stdio: ["ignore", out, err],
  };

  if (process.platform === "win32") {
    opts.shell = true;
  } else {
    opts.shell = "/bin/bash";
  }
  if (!process.argv.includes("--nxsWindow")) {
    opts.windowsHide = true;
  } else {
    process.argv.filter((e) => e !== "--nxsWindow");
  }

  const command = process.argv.shift();
  const arguments = process.argv.filter((e) => e !== "--bg");
  const subprocess = spawn(command, arguments, opts);

  log.ok("Execute in the background: " + command + " " + bold(argv.join(" ")));
  subprocess.unref();

  if (typeof subprocess.pid !== "undefined") {
    fs.writeFileSync(".server.pid", subprocess.pid, {
      encoding: "utf8",
    });
    log.ok("Detached.");
  } else {
    log.error("Failed.");
  }
};

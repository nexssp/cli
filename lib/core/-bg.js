module.exports.x = () => {
  const { ok, error } = require("../../lib/log");
  const { bold } = require("@nexssp/ansi");
  const { nohup } = require("../nohup.js");
  const { title } = require("../../lib/proc");
  let argv = process.argv.slice(3);
  const command = "nexss " + argv.join(" ");
  process.title = title();
  ok("Execute in the background: " + bold(command));
  nohup(command);
};

module.exports = () => {
  const { ok } = require("../../lib/log");
  const { bold } = require("@nexssp/ansi");
  const { title } = require("../../lib/proc");
  const fs = require("fs");
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

  ok("Execute in the background: " + command + " " + bold(argv.join(" ")));
  subprocess.unref();

  if (typeof subprocess.pid !== "undefined") {
    fs.writeFileSync(".server.pid", subprocess.pid, {
      encoding: "utf8",
    });
    ok("Detached.");
  } else {
    error("Failed.");
  }
};

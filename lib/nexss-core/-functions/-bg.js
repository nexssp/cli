const { remove } = require("@nexssp/extend/array")
const { arrArgvAddQuotes } = require('@nexssp/extend/array')
process.argv = remove(process.argv, "-bg")

const title = (pid) => {
  let param = 2;
  if (cliArgs._[2] === "-bg") {
    param = 3;
  }

  return (
    "nexss (" +
    NEXSSP_VERSION +
    ":" +
    pid +
    ") " +
    process.argv.slice(param).join(" ") +
    ""
  );
};

module.exports.x = () => {
  const { nohup } = require("../nohup.js");
  const { title } = require("../../lib/proc");
  let argv = process.argv.slice(3);
  const command = "nexss " + argv.join(" ");
  process.title = title(process.pid);
  log.ok("Execute in the background: " + bold(command));
  nohup(command);
};

module.exports = () => {
  console.log()


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

  opts.shell = process.shell;

  if (!cliArgs.nxsWindow) {
    opts.windowsHide = true;
  } else {
    process.argv.filter((e) => e !== "--nxsWindow");
  }

  const command = process.argv.shift();
  // Below - this function must ommit this filename because it will run itself and a lot of spawn processes will be created.
  // Make sure you are not running this function with again -bg parameter as it will spawn all the time.
  // You may want to use: Get–Process "node" | Stop–Process
  const ommitArg = path.basename(__filename).replace(".js", "");
  const arguments = process.argv.filter((e) => e !== ommitArg);



  if (arguments.length < 2) {
    log.error("Nothing to run. Use nexss -bg YourProgram");
    process.exit(1);
  }
  
  // When develop this below stops to run and run -bg commands (even hang computer after a while)
  if (command.indexOf("-bg") >= 0) {
    console.log("-bg cannot exist as it would create infinite loop. Check above code")
    process.exit(1)
  }
  
  const subprocess = spawn(command, arrArgvAddQuotes(arguments), opts);

  log.ok("Execute in the background: " + command + " " + bold(argv.join(" ")));
  subprocess.unref();

  if (typeof subprocess.pid !== "undefined") {
    log.ok("PID: " + bold(title(subprocess.pid)));
    fs.writeFileSync(`${subprocess.pid}.server.pid`, subprocess.pid + "", {
      encoding: "utf8",
    });
    log.ok("Detached.");
  } else {
    log.error("Failed.");
  }
};

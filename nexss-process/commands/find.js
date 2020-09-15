const find = require("find-process");
const { green, bold, yellow } = require("../../lib/ansi");
const { error } = require("../../lib/log");
let whatToFind = process.argv[4];

if (!["port", "pid", "name"].includes(whatToFind)) {
  if (isNaN(whatToFind)) {
    // You don't have to specify the 'name' after find
    // eg this is equal nexss ps find myproc AND nexss ps find name myproc
    console.log(`Finding process '${whatToFind}'..`);
    process.argv[5] = whatToFind;
    whatToFind = "name";
  } else {
    console.log(`Finding process with id '${whatToFind}'..`);
    process.argv[5] = whatToFind;
    whatToFind = "pid";
  }
  console.log();
}
// https://www.npmjs.com/package/find-process
switch (whatToFind) {
  case "port":
    const port = process.argv[5];
    find("port", port).then(function (list) {
      const Table = require("cli-table3");

      var table = new Table({
        head: [green("pid"), green("ppid"), green("name"), green("cmd")],
      });
      list.forEach((proc) => {
        table.push([
          bold(yellow(proc.pid)),
          bold(proc.ppid),
          bold(proc.name),
          bold(proc.cmd),
        ]);
      });

      console.log(table.toString());
    });
    break;
  case "pid":
    const pid = process.argv[5];
    find("pid", pid).then(function (list) {
      const Table = require("cli-table3");

      var table = new Table({
        head: [green("pid"), green("ppid"), green("cmd")],
      });
      list.forEach((proc) => {
        table.push([bold(yellow(proc.pid)), bold(proc.ppid), bold(proc.cmd)]);
      });

      console.log(table.toString());
    });
    break;
  case "name":
    const name = process.argv[5];
    find("name", name, true).then(function (list) {
      const Table = require("cli-table3");
      var table = new Table({
        head: [green("pid"), green("ppid"), yellow("name"), green("cmd")],
      });
      list.forEach((proc) => {
        if (proc.name.indexOf(name) >= 0) {
          table.push([
            bold(yellow(proc.pid)),
            bold(proc.ppid),
            bold(proc.name),
            bold(proc.cmd),
          ]);
        }
      });

      console.log(table.toString());
    });
    break;
  default:
    error(`Only find pid, name or port is available for searching.`);
    error(`eg: nexss ps find port 8000 or nexss ps find name node`);
    process.exit();
    break;
}

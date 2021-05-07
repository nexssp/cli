/*
 * Title: Language - Nexss PROGRAMMER 2.x
 * Description: Managing Languages
 * Author: Marcin Polak
 * 2018/10/01 initial version
 * 2019/08/12 modified for version 2.
 */
const languages = require("../lib/language");

const comma = cliArgs.comma;
const list = cliArgs.list;

(async () => {
  let languagesList = await languages.getLanguages();

  if (list) {
    for (var key in languagesList) {
      let details = languagesList[key];
      console.log(details.title);
    }
    process.exit();
  } else if (comma) {
    let l = [];
    for (var key in languagesList) {
      let details = languagesList[key];
      l.push(details.title);
    }
    const s = new Set(l);
    const arr = Array.from(s);
    console.log(arr.join(", "));
    console.log(arr.length);
    process.exit();
  }

  log.info(`Installed languages`);
  const Table = require("cli-table3");
  var table = new Table({
    head: [green("extension"), green("name"), green("descr"), green("url")],
    colWidths: [7, 20, 60, 30],
  });
  for (var key in languagesList) {
    let details = languagesList[key];

    table.push([
      bold(yellow(key)),
      bold(details.title),
      details.description,
      green(details.url),
    ]);
  }

  console.log(table.toString());
})();

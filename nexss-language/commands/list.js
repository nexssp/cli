/*
 * Title: Language - Nexss PROGRAMMER 2.0.0
 * Description: Managing Languages
 * Author: Marcin Polak
 * 2018/10/01 initial version
 * 2019/08/12 modified for version 2.
 */

const { bold, yellow, green } = require("@nexssp/ansi");
const { info } = require("../../lib/log");

const languages = require("../lib/language");
(async () => {
  let languagesList = await languages.getLanguages();
  info(`Installed languages`);
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

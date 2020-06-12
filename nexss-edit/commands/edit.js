const { error } = require("../../lib/log");
const { bold } = require("../../lib/color");
const { ensureInstalled } = require("../../lib/terminal");
const cliArgs = require("minimist")(process.argv.slice(3));
var options = {};
options.fileName = cliArgs._[0] || options.fileName || "";
const extension = require("path").extname(options.fileName);
const { getLangByFilename } = require("../../nexss-language/lib/language");
const languageSelected = getLangByFilename(`example.${extension}`, true);

const editorId =
  (languageSelected.editors && Object.keys(languageSelected.editors)[0]) ||
  "vscode";
const editors = require("../editors");
if (!editors[editorId]) {
  // use vscode as default
  editorId = "vscode";
}

const editorSelected = editors[editorId];
ensureInstalled(editorSelected.command, editorSelected.install);

if (!options.fileName) {
  options.fileName = ".";
} else {
  if (!require("fs").existsSync(options.fileName)) {
    error(`${bold(options.fileName)} not found.`);
    process.exit(1);
  }
}

try {
  require("child_process").execSync(
    `${editorSelected.command} ${options.fileName}`,
    {
      stdio: "inherit",
    }
  );
} catch (error) {
  console.log(error);
}

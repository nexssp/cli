const { bold, blue, yellow, grey } = require("@nexssp/ansi");
const { pack } = require("@nexssp/packunpack");
const minimist = require("minimist");
const program = "nexss";
const example = `${program} myfile.ext myfolder myarchive.tar.gz`;
module.exports = () => {
  let opts = {};
  const what = process.argv.slice(3);
  if (what.length < 1) {
    console.error(`Enter parameters eg: ${example}`);
  } else if (what.length < 2) {
    console.error(`Last parameter is the archive name for example: ${example}`);
  }

  if (!what) {
    console.error(example);
    return;
  }

  const params = minimist(what);
  if (params.force) {
    opts.force = true;
  }
  const archiveName = params._.pop();
  const result = pack(params._, archiveName, opts);
  console.log(`Archive: ${archiveName}`);
  console.log(result);
};

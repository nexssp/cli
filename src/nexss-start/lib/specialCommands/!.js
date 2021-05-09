const { nSpawn } = require("@nexssp/system");

function execExclamationMark(cmd, data) {
  const result = nSpawn(cmd, { stdio: "inherit" });
  // !! will adds to the data
  return result;
}

module.exports.execExclamationMark = execExclamationMark;

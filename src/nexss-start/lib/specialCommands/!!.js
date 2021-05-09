const { nSpawn } = require("@nexssp/system");

function execDoubleExclamationMark(cmd, data) {
  const result = nSpawn(cmd);
  Object.assign(data, result);
  return data;
}

module.exports.execDoubleExclamationMark = execDoubleExclamationMark;

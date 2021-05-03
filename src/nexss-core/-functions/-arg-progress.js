const changeConfig = require("../lib/changeConfig");

module.exports = () => {
  const argumentFromFilename = process.argv[2];
  const valueOfArgument = process.argv[3];
  changeConfig(argumentFromFilename, valueOfArgument);
};

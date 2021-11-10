const changeConfig = require('../lib/changeConfig')
// This module modify config based on the filename so it is easier to make another one with docs.
// For example this one changes arg:progress
module.exports = () => {
  const argumentFromFilename = process.argv[2]
  const valueOfArgument = cliArgs._[0]

  changeConfig(argumentFromFilename, valueOfArgument)
  process.exit(0)
}

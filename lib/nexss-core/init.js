// Speedup
// require('v8-compile-cache')

module.exports = (nexssArgs) => {
  Object.defineProperty(process, 'startTime', {
    configurable: false,
    enumerable: true,
    value: process.hrtime(),
  })

  Object.defineProperty(process, 'nexssGlobalCWD', {
    configurable: false,
    enumerable: true,
    value: process.cwd(),
  })

  process.on('unhandledRejection', (err, promise) => {
    console.log({ err, promise })
  })

  process.on('rejectionHandled', (err, promise) => {
    console.log({ promise })
  })

  // We make sure application is installed
  // EDIT: Application is installed through npm or npx
  // This was also cousing issues on SHARED SERVERS
  // const { npmInstallRun } = require("./lib/npm");
  // npmInstallRun();

  require('../config/globals.js')(nexssArgs)
  require('../config/nexss-paths')
}

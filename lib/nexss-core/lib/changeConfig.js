const { ddd } = require('@nexssp/dddebug')
const validateEnableDisable = require('./validateEnableDisable')
// Parameters are validated through nexss (nexss-core/arguments.js)

module.exports = (arg, value, validator = validateEnableDisable) => {
  const params = arg.split('-')
  params.shift()
  const mainArg = params[0]
  const subArg = params[1]
  const fullArg = `${mainArg}:${subArg}`

  const v = eval(validator)(value)
  const { JSONstringify } = require('@nexssp/extend')

  const newConfig = { ...process.nexssGlobalConfig }
  // get first element args:progress

  if (!newConfig[mainArg]) {
    newConfig[mainArg] = {}
  }

  if (v) {
    Object.assign(newConfig, {
      [nexss[fullArg]]: v * 1,
    })

    console.log(nexss[fullArg], newConfig[nexss[fullArg]])
    fs.writeFileSync(process.nexssGlobalConfigPath, JSONstringify(newConfig))
  }
}

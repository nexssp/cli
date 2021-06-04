#!/usr/bin/env node
'use strict'
/**
 * @fileoverview Over 50 programming languages together..
 * @author Marcin Polak / Nexss.com
 * @email mapoart@gmail.com
 */
// When $# is passed on Linux it becomes 0 when arguments are parsed.
if (process.platform !== 'win32' && `${process.argv[2]}` === '0') {
  process.argv[2] = '$#'
}

require('./nexss-core/init.js')

log.dc(bold('∞ Starting Nexss Programmer..'))

const { NEXSS_SRC_PATH, NEXSS_PACKAGES_PATH } = process.env

if (!cliArgs[nexss['process:title']]) {
  process.title = `nexss (${NEXSSP_VERSION}:${process.pid}) ${process.argv.slice(2).join(' ')}`
} else {
  process.title = cliArgs[nexss['process:title']]
  delete cliArgs[nexss['process:title']]
}

log.d('⊛ Set the process title: ', process.title)

if (process.argv[2] && process.argv[2].startsWith('-')) {
  require('./nexss-core/-functions')
}

// Get first parameter as plugin name.
let PARAM0 = cliArgs._[0]

if (PARAM0) {
  const aliases = require('./aliases.json')

  if (aliases[`${PARAM0}`]) {
    PARAM0 = aliases[`${PARAM0}`]
    process.argv[2] = PARAM0
  }
} else {
  PARAM0 = '$#'
}

// During development you can create package name as PARAM0 which is not allowed.
require('./nexss-dev').checkValidPluginName(PARAM0)

// Replacer so you can build shortcuts like P
if (process.aliases[`${PARAM0}`]) {
  PARAM0 = process.aliases[`${PARAM0}`]
}

const { is } = require('@nexssp/data')

const packageName = PARAM0.split('/')[0]

let fileOrFolderExists
const { package1 } = require('./config/package')

if (cliArgs._[1] === 'help' && fs.existsSync(`${NEXSS_PACKAGES_PATH}/${PARAM0}/README.md`)) {
  const helpContent = fs.readFileSync(`${NEXSS_PACKAGES_PATH}/${PARAM0}/README.md`)
  require('./nexss-core/markdown').displayMarkdown(helpContent.toString())
  return
}

const { myExistsSync } = require('./lib/fs')
if (startWithSpecialChar(PARAM0) || myExistsSync(`${PARAM0}`) || is('url', PARAM0)) {
  cliArgs._.shift()
  cliArgs._.unshift('start', PARAM0)
  PARAM0 = 'start'
} else if (package1.isAvailable(`${packageName}`)) {
  // Install Package if not exists
  if (!myExistsSync(`${NEXSS_PACKAGES_PATH}/Nexss`)) {
    // Make sure Nexss main package is installed.
    package1.install('Nexss')
  }
  if (!myExistsSync(`${NEXSS_PACKAGES_PATH}/${packageName}`)) {
    // Installs package if is not downloaded.
    package1.install(packageName)
  }

  // Test if maybe help is there:

  cliArgs._.shift()
  cliArgs._.unshift('start', `${PARAM0}`)
  PARAM0 = 'start'
}

// else if (!myExistsSync(`${NEXSS_SRC_PATH}/nexss-${PARAM0}/nexssPlugin.js`)) {

//   const { perLanguage } = require('./nexss-language/lib/perLanguage')
//   perLanguage(PARAM0)
//   process.exit(0)
// }

let command = cliArgs._[1] || undefined

// Aliases for commands like nexss file [add] -> nexss file [a]
let commandAliases = {}
const aliasesPluginPath = `${NEXSS_SRC_PATH}/nexss-${PARAM0}/aliases.json`
if (myExistsSync(aliasesPluginPath)) {
  commandAliases = require(aliasesPluginPath)
  if (commandAliases[`${command}`]) {
    command = commandAliases[`${command}`]
    process.argv[3] = command
  }
}

if (PARAM0 === 'start' || PARAM0 === 's') {
  require(`./main/start.js`)
} else {
  const { plugins } = require('./nexss-plugin-impl')
  if (plugins()) {
    return
  }
}

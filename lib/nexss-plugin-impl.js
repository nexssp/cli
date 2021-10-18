/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

function plugins() {
  // process.argv.shift()
  const nexssPlugin = require('@nexssp/plugin')
  // ============ PLUGINS
  // args = args.filter((e) => !['--debug'].includes(e))
  // console.log(process.argv)
  let helpFiles = []
  let [, , cmd, ...args] = process.argv
  // ============ LANGUAGES
  if (
    !['command', 'cmd', 'project', 'p', 'file', 'f', 'config', 'os', 'ensure'].includes(cmd) ||
    cmd === 'help'
  ) {
    // if (cmd !== 'l' && cmd !== 'language' && cmd !== 'languages') {
    //   const pluginLanguages0 = nexssPlugin({
    //     plugin: '@nexssp/language' /*for now is required*/,
    //     // commandsPath: 'src/cli/default/commands',
    //     ommit: ['format1'],
    //     through: true,
    //   })
    //   if (cmd === 'help') {
    //     helpFiles.push(pluginLanguages0.helpContent())
    //   } else {
    //     pluginLanguages0.start()
    //     if (pluginLanguages0.runCommand(cmd, args)) {
    //       return
    //     }
    //   }
    // } else {
    // YES ==== ,,, for languages as php is there as first param
    // log.dm('@nexss|plugins cmd, args:', cmd, args)
    // const pluginLanguages = nexssPlugin({
    //   plugin: '@nexssp/language' /*for now is required*/,
    //   // trigger: /.?[a-z][0-9]/,
    //   // aliases: ['l'],
    //   ommit: ['format1'],
    //   through: true,
    // })
    // if (cmd === 'help') {
    //   helpFiles.push(pluginLanguages.helpContent())
    // } else {
    //   if (pluginLanguages.start) {
    //     pluginLanguages.start()
    //     if (pluginLanguages.runCommand(cmd, args)) {
    //       return
    //     }
    //   }
    // }
    // }
  }
  // ;[, , , cmd, ...args] = process.argv
  const plugins = require('./plugins.json')
  const r = plugins.reduce((acc, plg) => {
    const pluginInstance = nexssPlugin(plg)
    if (cmd === 'help') {
      acc.push(pluginInstance.helpContent())
      return acc
    } else {
      if (pluginInstance.start) {
        pluginInstance.start()
        if (pluginInstance.runCommand(cmd, args)) {
          return
        }
      }
    }
  }, [])
  if (cmd === 'help') {
    nexssPlugin.helpDisplay(r.flat())
  }
}

module.exports = { plugins }

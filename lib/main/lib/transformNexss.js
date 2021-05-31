/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.transformNexss = (
  cmd, // cmd = ls, node, php or whatever
  args = [], // arguments eg. ["--help", "myfile.php"]
  { quiet = false, fileName = undefined, inputData, cwd, env, StreamCache } = defaultExecuteOptions
) => {
  const { defaultExecuteOptions } = require('../../config/defaults')

  const { Transform } = require('stream')
  const { worker } = require('./worker')
  const { arrArgvAddQuotes } = require('@nexssp/extend/array')
  const { cleanNexssArgs } = require('./cleanNexssArgs')
  const learning = require('./learning')

  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const argsDisplay = args
        .filter((e) => !e.includes('--debug'))
        .filter((e) => !e.startsWith('--nxs'))
        .join(' ')

      if (chunk.stream === 'cancel') {
        log.dr(`× Canceled Stream: ${cmd} ${argsDisplay}`)
        callback(null, chunk)
        return
      }
      log.di(`↳ Stream: transformNexss: ${cmd} ${argsDisplay}`)

      let startStreamTime
      if (cliArgs.nxsTime) {
        startStreamTime = process.hrtime()
      }

      const self = this

      const options = {}

      if (cliArgs[nexss[':i']] || cliArgs.nxsI) {
        // We get stdin from user.
        options.stdio = ['inherit', 'inherit', 'pipe']
      } else {
        options.stdio = ['pipe', 'pipe', 'pipe']
      }

      options.detached = false
      options.shell = process.shell

      // TODO: eval?
      if (cwd && cwd.replace) cwd = eval(`\`${cwd.replace(/\\/g, '/')}\``)
      options.cwd = cwd
      // Below just to hide on debug
      options.env = 'SEE: process.env'

      if (!quiet) {
        log.dy('Current working dir: ', process.cwd())
        console.error(
          `Spawning ${cmd} ${args ? args.join(' ') : ''} options: `,
          JSON.stringify(options)
        )
      }

      learning.note(`Execute: ${bold(`${cmd} ${args ? args.join(' ') : ''}`)}`)

      options.env = env
      process.nexssCWD = cwd

      let argsStrings = cleanNexssArgs(args)

      argsStrings = arrArgvAddQuotes(argsStrings)

      this.worker = worker({
        self,
        chunk,
        cmd,
        argsStrings,
        fileName,
        options,
        startStreamTime,
        StreamCache: cliArgs[nexss['stream:cache']],
        callback,
      })

      log.dy(`${yellow(bold(`⇋ Waiting for: ${cmd}`))}`)

      if (this.worker.stdin) this.worker.stdin.end()
    },

    flush(cb) {
      cb()
    },
  })
}

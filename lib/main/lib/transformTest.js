/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.transformTest = (title = 'no title', args = [], options = {}) => {
  const { Transform } = require('stream')
  const { stripTerminalColors } = require('@nexssp/extend/string') // stripTerminalColors
  return new Transform({
    objectMode: true,
    highWaterMark: require('../../config/defaults').highWaterMark,
    transform(chunk, encoding, callback) {
      // Not a json data so we don't do anything here
      if (cliArgs.nxsTest) {
        if (chunk.stream === 'cancel') {
          log.dr(`× Stream:Cancelled transformTest`)
          callback(null, chunk)
          return
        }

        log.di(`↳ Stream: transformTest`)

        const testingData = require('../../config/testingData.json')
        const { data } = chunk

        if (data) {
          let errorExists
          Object.keys(testingData).forEach((k) => {
            if (stripTerminalColors(`${testingData[k]}`) !== stripTerminalColors(`${data[k]}`)) {
              log.error(bold(red(testingData[k])), `Not Equal to`)
              log.error(bold(red(data[k])))
              errorExists = true
            } else {
              log.ok(bold(`Field ${k} is correct:`, data[k]))
            }
          })
          if (errorExists) {
            log.warn('Program has been terminated.')
            process.exit()
          }
        }
      }

      if (chunk) callback(null, chunk)
    },
  })
}

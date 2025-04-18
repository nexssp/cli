/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.transformInput = (cmd, currentArgs, params) => {
  const nxsInModule = require('./input/nxsIn')
  const { nxsDebugData } = require('./output/nxsDebug')
  const { } = require('@nexssp/extend')
  const cliArgsParser = require('minimist')
  const nxsStop = require('./start/nxsStop')
  const nxsGlobal = require('./input/nxsGlobal')
  const nxsLocal = require('./input/nxsLocal')
  const { checkPlatform } = require('../../lib/platform')
  const stream = require('stream')
  return new stream.Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      log.dr(chunk)
      if (chunk.stream === 'cancel') {
        log.dr(`× Stream: Cancelled transformInput`)

        callback(null, {
          from: 'transform-input',
          stream: 'cancel',
          status: 'ok',
          data: chunk.data,
          // display: chunk.display,
        })
        return
        // } else if (
        //   params.inputData &&
        //   params.inputData.nxsPlatform &&
        //   !checkPlatform(params.inputData.nxsPlatform)
        // ) {
        //   log.dg(
        //     `× Stream: Cancelled platform not match. ${
        //       params.inputData.nxsPlatform !== process.distro
        //     }`
        //   );
        //   callback(null, {
        //     from: "transform-input",
        //     status: "platform-notmach",
        //     data: chunk.data,
        //   });
        //   return;
      }
      log.di(`↳ Stream: transformInput`)

      if (!chunk.data) {
        callback(null, {
          status: 'error',
          data: chunk,
          // display: chunk.display,
        })
        return
      }

      let { data } = chunk

      if (data) {
        // We add inputData from the parameters
        // This is added here as the validation is needed
        if (params.inputData) {
          // FIXME: later to make sure everywever is the object, not array.
          // Array is used on args parameter

          log.dc(bold(`  Adding cliArgs (inputData): Stream: Input..`), params.inputData)

          if (Array.isArray(params.inputData)) {
            params.inputData = cliArgsParser(params.inputData)
          }

          if (params.inputData._ && params.inputData._.length === 0) {
            delete params.inputData._
          }

          Object.assign(data, params.inputData)
        }

        const { parseData } = require('@nexssp/expression-parser')
        data = parseData(data, ['nexss', 'cwd', 'start'])

        // if (params && params.inputData && params.inputData.nxsInFrom) {
        //   data.nxsInFrom = params.inputData.nxsInFrom;
        // }

        data = nxsInModule(data)

        nxsDebugData(data, 'Input', 'blue')
        nxsGlobal(data)
        nxsLocal(data)

        nxsStop(data)

        // data.globalTestTInput = "This is input!!!!";
        // data.nxsGlobalTestTInputFunction = () => {
        //   return require("fs").existsSync(".");
        // };
        callback(null, {
          from: 'transform-input',
          status: 'ok',
          data,
          // display: chunk.display,
        })
      }
    },
  })
}

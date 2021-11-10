/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports.transformRequest = (url) => {
  const { Transform } = require('stream')
  const axios = require('axios')
  const { nxsDebugTitle } = require('./output/nxsDebug')
  const { checkPlatform } = require('../../lib/platform')
  return new Transform({
    objectMode: true,
    highWaterMark: require('../../config/defaults').highWaterMark,
    transform: (chunk, encoding, callback) => {
      if (chunk.stream === 'cancel') {
        log.dr(`× Stream: Cancelled transformInput`)

        callback(null, {
          from: 'transform-input',
          status: 'ok',
          data: chunk.data,
        })
      } else if (!checkPlatform(chunk.data.nxsPlatform)) {
        log.dg(`× Stream: Cancelled platform not match. ${cliArgs.nxsPlaftorm}`)
        callback(null, {
          from: 'transform-input',
          status: 'platform-notmach',
          data: chunk.data,
        })
        return
      } else {
        log.di(`↳ Stream: transformRequest`)
      }

      let data
      if (encoding === 'buffer') {
        chunk = chunk.toString()
      }
      try {
        data = JSON.parse(chunk)
      } catch (error) {
        data = chunk
      }

      nxsDebugTitle(`Nexss Request:${bold(url)}`, data, 'red')

      axios({ url, responseType: 'stream' }).then((response) => {
        const axiosStream = response.data

        let wholeData = ''
        axiosStream.on('data', (d) => {
          wholeData += d
          // callback(null, data);
        })

        axiosStream.on('error', (er) => {
          callback(er)
        })

        axiosStream.on('end', () => {
          if (!data) {
            data = {}
          }

          // try {
          //   data = JSON.parse(wholeData);
          //   callback(null, Buffer.from(wholeData));
          // } catch (error) {
          //   data.nxsOut = wholeData;
          //   callback(null, Buffer.from(JSON.stringify(data)));
          // }
          data.data.nxsOut = wholeData
          callback(null, {
            from: 'transform-request',
            status: 'ok',
            data: data.data,
          })
        })
      })

      // streamRead.on("exit", (code, signal) => {
      //   // console.log(`finished worker!!!! code: ${code}, ${signal}`);
      //   // callback(null, null);
      //   self.end();
      //   callback();
      // });
    },
    flush(cb) {
      cb()
    },
  })
}

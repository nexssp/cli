/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const { CONCAT_RESULTS } = require('./nxsConstants')

module.exports = (data, concatFields) => {
  if (concatFields && concatFields.split) {
    data[CONCAT_RESULTS] = concatFields.split(',').map((element) => {
      if (!data[element]) {
        console.log(`output/nxsConcat.js: There is no ${element} field in the data.`)
        if (element.startsWith('"')) {
          console.error(
            `Your element ${element} starts with " so it might be an issue with passing arguments.\n` +
              'For example on Windows param="val1" should be ok.'
          )
        }
        console.log(data)
        process.exit(0)
      }

      return data[element]
    })

    data[CONCAT_RESULTS] = data[CONCAT_RESULTS].flat()
    return data
  }
}

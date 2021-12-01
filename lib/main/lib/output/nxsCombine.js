/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

// Combine nxsOut

module.exports = (data) => {
  let combineData
  try {
    combineData = JSON.parse(data['nxsOut'])
  } catch (error) {
    log.error(`nxsStopCombine:${error}`)
    log.error('Program has been terminated.')

    process.exit(1)
  }

  let toCombine
  if (typeof data.nxsOutCombine == 'boolean') {
    // just combine without selection of data
    toCombine = combineData
  } else {
    fields = data.nxsOutCombine.split(',')
    toCombine = fields.reduce((acc, el) => {
      acc[el] = combineData[el]
      return acc
    }, {})
  }

  data = Object.assign(data, toCombine)
  delete data.nxsOutCombine
  delete data.nxsOut

  return data
}

/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const { CONCAT_RESULTS } = require('./nxsConstants')

module.exports = (data, asField) => {
  if (!data.nxsConcat && !data.nxsConcatFields) {
    console.error("There is no '--nxsConcat' or '--nxsConcatFields'.")
    process.exit(0)
  }

  data[asField] = data[CONCAT_RESULTS]
  delete data[CONCAT_RESULTS]
  delete data.nxsConcatAs
  return data
}

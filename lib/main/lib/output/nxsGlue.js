/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const { CONCAT_RESULTS } = require('./nxsConstants');

module.exports = (data, concatSeparator) => {
  if (typeof concatSeparator === 'boolean') {
    concatSeparator = ',';
  }
  if (concatSeparator) {
    switch (concatSeparator) {
      case 'EOL':
        concatSeparator = require('os').EOL;
        break;
      case 'PATH':
      case 'PTH':
        concatSeparator = require('path').sep;
        break;
      case 'SPACE':
      case 'SPC':
        concatSeparator = ' ';
        break;
      default:
        break;
    }
  } else {
    concatSeparator = '';
  }
  delete data.nxsGlue;
  delete data.nxsJoin;
  data[CONCAT_RESULTS] =
    data[CONCAT_RESULTS] && data[CONCAT_RESULTS].join
      ? data[CONCAT_RESULTS].join(concatSeparator)
      : CONCAT_RESULTS;
  return data;
};

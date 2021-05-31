/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */
module.exports = (data) => {
  if (data.nxsInFrom) {
    // We have the nxsIn changed field, so we move it to the nxsIn
    if (data[data.nxsInFrom]) {
      data.nxsIn = data[data.nxsInFrom];
      delete data.nxsInFrom;
      delete data[data.nxsInFrom];
    } else {
      console.error(
        `You have passed nxsInFrom: ${data.nxsInFrom} however this field does not exist.
If you are using | with multiple nexss commands make sure you are not using --debug option. 
use nxsDebug instead.`
      );
      process.exit(0);
    }
    delete data.nxsInFrom;
  }

  if (!data.nxsIn && data.nxsOut) {
    data.nxsIn = data.nxsOut;
    delete data.nxsOut;
  }

  // We dont have nxsInFrom so it is nxsIn
  // But if there are other parames in the command
  // we combine them accodingly
  if (data._ && data._[0]) {
    if (!data.nxsIn) {
      data.nxsIn = data._;
      delete data._;
    } else if (Array.isArray(data.nxsIn)) {
      data.nxsIn = data._.concat(data.nxsIn);
    } else {
      data.nxsIn = data._.concat([data.nxsIn]);
    }
    delete data._;
  }
  return data;
};

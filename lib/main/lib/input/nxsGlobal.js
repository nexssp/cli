/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */
module.exports = (data) => {
  if (data.nxsGlobal) {
    let { nxsGlobal } = data;
    if (!Array.isArray(nxsGlobal)) {
      nxsGlobal = data.nxsGlobal.split(',');
    }

    for (glob of nxsGlobal) {
      let errorMessage;
      if (!data[`_${glob}`]) {
        errorMessage = `nxsGlobal:Local var '_${glob}' does not exist. Remove nxsGlobal=${glob}`;
        log.error(errorMessage);
        data.nxsStop = true;
        data.nxsStopReason = errorMessage;
        process.exitCode = 1;
      } else if (data[glob] && !data.nxsGlobalForce) {
        errorMessage = `You have used nxsGlobal however there is data with name ${glob} already. 
Use nxsGlobalForce if you don't want to see this message`;
        log.error(errorMessage);
        data.nxsStopReason(errorMessage);
        data.nxsStop = true;
        process.exitCode = 1;
      } else if (data[`_${glob}`]) {
        data[glob] = data[`_${glob}`];
        delete data[`_${glob}`];
      }
    }
  }

  return data;
};

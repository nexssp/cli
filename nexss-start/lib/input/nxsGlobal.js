module.exports = (data) => {
  const { error } = require("@nexssp/logdebug");
  if (data.nxsGlobal) {
    let nxsGlobal = data.nxsGlobal;
    if (!Array.isArray(nxsGlobal)) {
      nxsGlobal = data.nxsGlobal.split(",");
    }

    for (glob of nxsGlobal) {
      if (!data[`_${glob}`]) {
        error(
          `nxsGlobal:Local var '_${glob}' does not exist. Remove nxsGlobal=${glob}`
        );
        data.nxsStop = true;
      } else if (data[glob] && !data.nxsGlobalForce) {
        error(
          `You have used nxsGlobal however there is data with name ${glob} already. 
Use nxsGlobalForce if you don't want to see this message`
        );
        data.nxsStop = true;
      } else if (data[`_${glob}`]) {
        data[glob] = data[`_${glob}`];
        delete data[`_${glob}`];
      }
    }
  }

  return data;
};

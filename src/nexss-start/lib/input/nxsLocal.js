module.exports = (data) => {
  if (data.nxsLocal) {
    let nxsLocal = data.nxsLocal;
    if (!Array.isArray(nxsLocal)) {
      nxsLocal = data.nxsLocal.split(",");
    }

    for (local of nxsLocal) {
      if (!data[local]) {
        log.error(
          `nxsLocal:Global var '${local}' does not exist. Remove nxsLocal=${local}`
        );
        data.nxsStop = true;
      }

      if (data[`_${local}`] && !data.nxsLocalForce) {
        log.error(
          `You have used nxsLocal however there is data with name ${local} already. 
Use nxsLocalForce if you don't want to see this message`
        );
        data.nxsStop = true;
      } else if (data[local]) {
        data[`_${local}`] = data[local];
        delete data[local];
      }
    }
  }

  return data;
};

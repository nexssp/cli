module.exports = (data, nxsSelect = "nxsOut") => {
  if (typeof nxsSelect === "boolean") {
    nxsSelect = "nxsOut";
  }

  let result = {};
  const nxsSelectFieldPrefix = "Select";
  let nxsSelectField = nxsSelectFieldPrefix;
  if (nxsSelect.split) {
    let cnt = 0;
    nxsSelect.split(",").forEach((element) => {
      if (Array.isArray(data[element])) {
        data[element].forEach((subElement) => {
          cnt++;
          if (cnt > 1) {
            nxsSelectField = `${nxsSelectFieldPrefix}_${cnt}`;
          }

          result[nxsSelectField] = subElement;
        });
      } else {
        cnt++;
        if (cnt > 1) {
          nxsSelectField = `${nxsSelectFieldPrefix}_${cnt}`;
        }

        result[nxsSelectField] = data[element];
      }

      delete data[element];
    });
  }

  delete nxsSelect;
  if (data.nxsSelectOnly) {
    data = Object.assign({}, result);
    delete data.nxsSelectOnly;
  } else {
    data = Object.assign(data, result);
  }

  delete data["nxsSelect"];
  return data;
};

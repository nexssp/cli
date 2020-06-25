module.exports = (data) => {
  let nxsExecuteFieldAs = data.nxsExecuteFieldAs;
  delete data.nxsExecuteFieldAs;

  var sss = require("child_process").spawnSync;
  var arrayCommands = data.nxsExecute.trim().split(" ");
  delete data.nxsExecute;
  const command = arrayCommands.shift();

  var ExecuteCommandObject = sss(command, arrayCommands, {
    detached: false,
    shell: true,
    input: JSON.stringify(data),
    stdio: "pipe",
  });

  newData = ExecuteCommandObject.output[1].toString().trim();
  let newDataParsed;
  try {
    newDataParsed = JSON.parse(newData);

    if (!nxsExecuteFieldAs) {
      data = newDataParsed;
    } else {
      data[nxsExecuteFieldAs] = newDataParsed;
    }
  } catch (error) {
    if (!nxsExecuteFieldAs) {
      nxsExecuteFieldAs = "nxsExecuteOutput";
    }

    data[nxsExecuteFieldAs] = newData;
  }

  return data;
};

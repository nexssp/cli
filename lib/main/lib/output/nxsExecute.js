/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

module.exports = (data) => {
  let { nxsExecuteFieldAs } = data
  delete data.nxsExecuteFieldAs

  const { spawnSync } = require('child_process')
  const arrayCommands = data.nxsExecute.trim().split(' ')
  delete data.nxsExecute
  const command = arrayCommands.shift()

  const ExecuteCommandObject = spawnSync(command, arrayCommands, {
    detached: false,
    shell: process.shell,
    input: JSON.stringify(data),
    stdio: 'pipe',
  })

  newData = ExecuteCommandObject.output[1].toString().trim()
  let newDataParsed
  try {
    newDataParsed = JSON.parse(newData)

    if (!nxsExecuteFieldAs) {
      data = newDataParsed
    } else {
      data[nxsExecuteFieldAs] = newDataParsed
    }
  } catch (error) {
    if (!nxsExecuteFieldAs) {
      nxsExecuteFieldAs = 'nxsExecuteOutput'
    }

    data[nxsExecuteFieldAs] = newData
  }

  return data
}

// function from https://gist.github.com/supersha/6913695 by shupersha
const fs = require('fs')
const { exec } = require('child_process')

const isWin = process.platform.indexOf('win') === 0

function nohup(cmd, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = null
  }
  if (isWin) {
    const cmdEscape = cmd.replace(/"/g, '""')
    const file = '.nohup.cmd.vbs'
    let script = ''
    script += 'Dim shell\n'
    script += 'Set shell=Wscript.CreateObject("WScript.Shell")\n'
    script += `shell.Run "cmd.exe /c start /b ${cmdEscape}", 0, TRUE`
    fs.writeFileSync(file, script)
    exec(`cscript.exe /nologo "${file}"`, options, () => {
      fs.unlinkSync(file)
      if (callback) callback()
    })
  } else {
    exec(`nohup ${cmd} > /dev/null 2>&1 &`, options, callback)
  }
}

module.exports.nohup = nohup

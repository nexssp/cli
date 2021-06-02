const { nSpawn } = require('@nexssp/system')

// CIRCUMFLEX ACCENT

function execDoubleCircAccent(cmd, data) {
  // after -- we pass --nxs commands
  cmd = cmd.split(' -- ')[0]

  const result = nSpawn(cmd)

  if (result.exitCode !== 0) {
    log.error(bold(`^^${cmd} failed! Exit code: ${result.exitCode}`))
    process.exit()
  }

  if (result.stdout) {
    result.nxsOut = result.stdout
    delete result.stdout
  }

  if (result.exitCode === 0) {
    delete result.exitCode
  }

  if (!result.stderr) {
    delete result.stderr
  }

  if (!result.stdout) {
    delete result.stdout
  }
  Object.assign(data, result)
  return data
}

module.exports.execDoubleCircAccent = execDoubleCircAccent

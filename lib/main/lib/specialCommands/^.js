const { nSpawn } = require('@nexssp/system');
require('@nexssp/extend')('array');

function execCircAccent(cmd, args = [], data) {
  if (!Array.isArray(args)) {
    throw new Error(`args must be an Array.`);
  }
  const result = nSpawn(cmd, { stdio: 'inherit' });

  if (result.exitCode !== 0) {
    log.error(bold(`!${cmd} failed! Exit code: ${result.exitCode}`));
    process.exit();
  }

  // !! will adds to the data
  return result;
}

module.exports.execCircAccent = execCircAccent;

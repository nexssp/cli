const { remove } = require('@nexssp/extend/array')
function cleanNexssArgs(args) {
  args = remove(args, '--nocache')
  // args2 = args2.remove("--debug");
  args = remove(args, '--nxsPipeErrors')
  args = remove(args, '--nxsBuild')
  args = remove(args, '--nxsTest')
  args = remove(args, '--nxsDebugData')
  args = remove(args, '--nxsDebug')
  args = remove(args, '--nxsI')
  args = remove(args, '--debug')
  args = remove(args, '--nxsDry')
  args = remove(args, '--nexssScript')

  args = args.filter((e) => !e.startsWith('--nxsAs'))
  return args
}

module.exports.cleanNexssArgs = cleanNexssArgs

function cleanNexssArgs(args) {
  args = args.remove("--nocache");
  // args2 = args2.remove("--debug");
  args = args.remove("--nxsPipeErrors");
  args = args.remove("--nxsBuild");
  args = args.remove("--nxsTest");
  args = args.remove("--nxsDebugData");
  args = args.remove("--nxsDebug");
  args = args.remove("--nxsI");
  args = args.remove("--debug");
  args = args.remove("--nxsDry");
  args = args.remove("--nexssScript");

  args = args.filter((e) => !e.startsWith("--nxsAs"));
  return args;
}

module.exports.cleanNexssArgs = cleanNexssArgs;

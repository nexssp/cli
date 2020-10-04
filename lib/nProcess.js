const defaultOptions = {};
if (process.platform !== "win32") {
  Object.assign(defaultOptions, { shell: "/bin/bash" });
}

const getResults = (stderr, stdout) => {
  const outputString = stdout && stdout.toString();
  const errorString = stderr && stderr.toString();
  const separator = outputString && errorString ? "\n" : "";

  return outputString + (errorString ? separator + errorString : "");
};

module.exports.nSpawnSync = (command, opts) => {
  opts = Object.assign({}, defaultOptions, opts) || defaultOptions;
  const { spawnSync } = require("child_process");

  try {
    const result = spawnSync(`${command} --nxsPipeErrors`, opts);
    return getResults(result.stderr, result.stdout);
  } catch (er) {
    return getResults(er.stderr, er.stdout);
  }
};

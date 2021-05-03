module.exports = (opts) => {
  let result = {};
  if (process.platform === "win32") {
    Object.assign(result, { stdio: "inherit" }, opts);
  } else {
    Object.assign(result, { stdio: "inherit", shell: process.shell }, opts);
  }

  return result;
};

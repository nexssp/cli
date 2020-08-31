module.exports = (opts) => {
  let result = {};
  if (process.platform === "win32") {
    Object.assign(result, { stdio: "inherit" }, opts);
  } else {
    Object.assign(result, { stdio: "inherit", shell: "/bin/bash" }, opts);
  }

  return result;
};

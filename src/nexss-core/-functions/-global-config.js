const { ddd } = require("@nexssp/dddebug");

module.exports = () => {
  console.log(`Global config path:`, process.nexssGlobalConfigPath);

  if (process.argv[3] === "reset") {
    process.nexssGlobalConfig = {};
    fs.writeFileSync(process.nexssGlobalConfigPath, "{}");
  }

  console.log(process.nexssGlobalConfig);
};

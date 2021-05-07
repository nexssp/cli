module.exports = () => {
  console.log(`Global config path:`, process.nexssGlobalConfigPath);

  if (cliArgs._[3] === "reset") {
    process.nexssGlobalConfig = {};
    fs.writeFileSync(process.nexssGlobalConfigPath, "{}");
  }

  console.log(process.nexssGlobalConfig);
};

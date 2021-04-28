module.exports = () => {
  const json = require("../../lib/data/json");
  let newConfig = Object.assign({}, process.nexssGlobalConfig);
  if (!newConfig.colors) {
    newConfig.colors = {};
  }

  let value = process.argv[3];

  const validParameters = ["enable", "1", "disable", "0"];
  if (!validParameters.includes(value)) {
    log.error(`You can only use: ${validParameters.join(", ")}`);
  } else {
    switch (value) {
      case "enable":
        value = 1;
        break;
      case "disable":
        value = 0;
        break;
      default:
        break;
    }

    Object.assign(newConfig, { colors: { output: value * 1 } });
    console.log("colors: ", newConfig.colors);
    fs.writeFileSync(process.nexssGlobalConfigPath, json.stringify(newConfig));
  }
};

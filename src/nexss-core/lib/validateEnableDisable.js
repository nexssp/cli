module.exports = (val) => {
  const validParameters = ["enable", "1", "disable", "0"];
  val += "";
  if (!validParameters.includes(val)) {
    log.error(
      `You can only use: ${validParameters.join(", ")}. Your value: ${val}`
    );
    process.exit(1);
  } else {
    switch (val) {
      case "enable":
        val = 1;
        break;
      case "disable":
        val = 0;
        break;
      default:
        break;
    }
  }

  return val;
};

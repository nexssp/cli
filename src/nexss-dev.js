module.exports.checkValidPluginName = (pluginName) => {
  if (
    fs.existsSync(`${process.env.NEXSS_SRC_PATH}/nexss-${pluginName}/`) &&
    fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${pluginName}`)
  ) {
    log.error("NEXSS DEVELOPER WARNING !");
    log.error(
      `THE PLUGIN ${process.env.NEXSS_SRC_PATH}/nexss-${pluginName} colide with package ${process.env.NEXSS_PACKAGES_PATH}/${pluginName}`
    );
    log.error(
      `There CANNOT be the same name for plugin and package. PLEASE CHANGE THE PACKAGE NAME!`
    );
    log.error(`Nexss Programmer will not continue until it is done.`);
    process.exit(1);
  }
};

/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

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

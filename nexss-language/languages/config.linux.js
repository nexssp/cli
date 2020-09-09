let c = require("./config.base");
c.osPackageManagers = {
  apt: {
    installation: "installed.",
    installCommand: "apt-get -y install",
  },
};
c.errors = {
  "1: (.*?): not found": `apt-get -y install`,
};

c.compilerInstallation = "apt-get -y install";
c.dist = "Ubuntu";
module.exports = c;

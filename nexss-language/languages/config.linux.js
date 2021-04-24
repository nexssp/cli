let c = require("./config.base");

c.osPackageManagers = {
  apt: {
    installation: "installed.",
    installCommand: process.replacePMByDistro("apt-get -y install"),
  },
};

c.errors = {
  "1: (.*?): not found": process.replacePMByDistro(`apt-get -y install`),
};

c.compilerInstallation = process.replacePMByDistro("apt-get -y install");
c.dist = "Ubuntu";
module.exports = c;

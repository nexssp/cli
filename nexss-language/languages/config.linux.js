let c = require("./config.base");
c.osPackageManagers = {
  "apt-get": {
    installation: "installed.",
    install: "apt-get -y install <args>"
  }
};
c.errors = {
  "1: (.*?): not found": `apt-get -y install <args>`
};

c.compilerInstallation = "apt-get -y install <args>";

module.exports = c;

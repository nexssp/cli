let c = require("./config.base");
let {
  replaceCommandByDist,
} = require(`${process.env.NEXSS_SRC_PATH}/lib/osys`);
c.osPackageManagers = {
  apt: {
    installation: "installed.",
    installCommand: replaceCommandByDist("apt-get -y install"),
  },
};
c.errors = {
  "1: (.*?): not found": replaceCommandByDist(`apt-get -y install`),
};

c.compilerInstallation = replaceCommandByDist("apt-get -y install");
c.dist = "Ubuntu";
module.exports = c;

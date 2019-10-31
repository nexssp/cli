let c = require("./config.base");
c.osPackageManagers = {
  brew: {
    installation:
      '/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"'
  }
};
c.compilerInstallation = "brew install <args>";

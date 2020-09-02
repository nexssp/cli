let c = require('./config.base');
c.osPackageManagers = {
  'apt-get': {
    installation: 'installed.',
    install: 'apt-get -y install',
  },
};
c.errors = {
  '1: (.*?): not found': `apt-get -y install`,
};

c.compilerInstallation = 'apt-get -y install';

module.exports = c;

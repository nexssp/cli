let c = require('./config.base');
c.osPackageManagers = {
  scoop: {
    installation:
      'Set-ExecutionPolicy RemoteSigned -scope CurrentUser ; powershell -command "iex (new-object net.webclient).downloadstring(\'https://get.scoop.sh\')"',
    installCommand: 'scoop install',
  },
  choco: {
    installation:
      '@"%SystemRoot%System32WindowsPowerShell\v1.0powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString(\'https://chocolatey.org/install.ps1\'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%chocolatey\bin"',
    installCommand: 'choco install',
  },
};
c.compilerInstallation = 'scoop install';

module.exports = c;

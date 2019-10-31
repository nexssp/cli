module.exports = {
  url: "https://nexss.com",
  // extension: null, use extensions instead
  title: null,
  description: null,
  // compiler: null, use compilers instead
  executeCommandLine: null,
  interactiveShell: null,
  printCommandLine: null,
  checkSyntax: null,
  author: "mapoart@gmail.com",
  osPackageManagers: null,
  languagePackageManagers: null,
  languagePackageManagersMessages: {
    installation: "Installing..",
    installed: "List of installed Packages:",
    search: "Search for packages: ",
    install: "Installing package <arg3> for <arg2>",
    uninstall: "Removing package <arg3> from <arg2>",
    help: "Help for ",
    version: "Version of package"
  },
  compilerInstallation: null,
  // customCompiler: "customCompiler.win32.cpp.cmd"
  // terminals: [{"cmd", `C:\Windows\System32\cmd.exe /k "C:\Program Files\nodejs\nodevars.bat`}],
  builders: {},
  get(str) {
    // return config value in this order
    // this[str].win32 || this[str].all || this[str]
    try {
      return eval(
        `this.${str}.${process.platform} || this.${str}.all || this.${str}`
      );
    } catch (e) {
      return undefined;
    }
  },
  getFirst(str) {
    const temp = this.get(str);
    if (!temp) return undefined;
    let item;
    for (item in temp) break;
    if (!item) return undefined;
    let r = temp[item];
    // key of item
    r.keyOfItem = item;
    return r;
  }
};

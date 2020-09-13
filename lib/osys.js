module.exports.dist = () => {
  if (process.platform == "linux") {
    const distName = require("child_process")
      .execSync("cat /etc/*release | grep -E ^NAME")
      .toString()
      .trim();
    return distName
      .replace('NAME="', "")
      .replace('"', "")
      .trim()
      .replace("NAME=", ""); // On the fedora;
  } else {
    return false;
  }
};

module.exports.version = () => {
  if (process.platform == "linux") {
    const distName = require("child_process")
      .execSync("cat /etc/*release | grep -E ^VERSION_ID")
      .toString()
      .trim();
    return distName
      .replace('VERSION_ID="', "")
      .replace('"', "")
      .replace("VERSION_ID=", "");
  } else {
    return false;
  }
};

module.exports.replaceCommandByDist = (cmd) => {
  const replacerInstall = module.exports.getInstallCommandByDist();
  const replacerUpdate = module.exports.getInstallCommandByDist(true);
  return cmd
    .replace(
      new RegExp(
        "(?:sudo?:(.*))?(apt -y install|apt-get -y install|apt-get install -y|apt install -y|apt install|apt-get install)",
        "gs"
      ),
      replacerInstall
    )
    .replace(
      new RegExp(
        "(?:sudo?:(.*))?(apt -y update|apt-get -y update|apt-get update -y|apt update -y|apt update|apt-get update)",
        "gs"
      ),
      replacerUpdate
    );
};

module.exports.getInstallCommandByDist = (update) => {
  let operation = "install";
  if (update) {
    operation = "update";
  }

  if (process.platform === "win32") {
    return `scoop ${operation}`;
  }

  let sudo = "sudo ";
  if (process.getuid && process.getuid() === 0) {
    sudo = "";
  }

  const distName = module.exports.dist();
  switch (distName) {
    case "Oracle":
    case "Oracle Linux Server":
      const distVersion = module.exports.version() * 1; // *1 converts to number
      if (distVersion >= 8) {
        // TODO: recognize the slim version
        return `${sudo}dnf ${operation}`;
      } else {
        return `${sudo}yum ${operation} -y`;
      }
    case "Alpine Linux":
      return `${sudo}apk ${operation === "install" ? "add" : "update"}`;
    case "Arch Linux":
      return `${sudo}${
        operation === "install"
          ? "pacman -S --noconfirm"
          : "pacman -Syu --noconfirm"
      }`;
    case "Fedora":
      return `${sudo}dnf ${operation} -y`; // Also yum works
    case "CentOS Linux":
    case "RHEL Linux":
      return `${sudo}yum ${operation} -y`;
    default:
      return `${sudo}apt-get ${operation} -y`;
  }
};

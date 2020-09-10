module.exports.dist = () => {
  if (process.platform == "linux") {
    const distName = require("child_process")
      .execSync("cat /etc/*release | grep -E ^NAME")
      .toString()
      .trim();
    return distName.replace('NAME="', "").replace('"', "");
  } else {
    return false;
  }
};

module.exports.replaceCommandByDist = (cmd) => {
  const replacer = module.exports.getInstallCommandByDist();
  return cmd.replace(
    new RegExp(
      "(?:sudo?:(.*))?(apt install|apt-get install|apt -y install|apt-get -y install|apt-get -y install)",
      "gs"
    ),
    replacer
  );
};

module.exports.getInstallCommandByDist = (update) => {
  let sudo = "sudo ";
  if (process.getuid && process.getuid() === 0) {
    sudo = "";
  }

  let operation = "install";
  if (update) {
    operation = "update";
  }

  const distName = module.exports.dist();
  switch (distName) {
    case "Oracle":
    case "Oracle Linux Server":
      return `${sudo}microdnf ${operation}`;
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

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

module.exports.getInstallCommandByDist = () => {
  let sudo = "sudo ";
  if (process.getuid && process.getuid() === 0) {
    sudo = "";
  }

  const distName = module.exports.dist();
  switch (distName) {
    case "Oracle":
    case "Oracle Linux Server":
      return `${sudo}microdnf install`;
    case "Alpine Linux":
      return `${sudo}apk add`;
    case "Arch Linux":
      return `${sudo}pacman -S --noconfirm`;
    case "Fedora":
      return `${sudo}dnf install -y`; // Also yum works
    case "CentOS Linux":
    case "RHEL Linux":
      return `${sudo}yum install -y`;
    default:
      return `${sudo}apt-get install -y`;
  }
};

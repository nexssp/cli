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
  const distName = module.exports.dist();
  switch (distName) {
    case "Oracle":
    case "Oracle Linux Server":
      return "microdnf install";
    case "Alpine Linux":
      return "apk add";
    case "Arch Linux":
      return "pacman -S --noconfirm";
    case "FEDORA":
      return "dnf install";
    case "CENTOS":
    case "RHEL":
      return "yum install";
    default:
      return "zs";
  }
};

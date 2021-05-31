// nxsPlatfrom ? Nexss Programmer allow to run any line related to the OS, OS version.
// It uses for it process.platform and process.distroTag1, process.distroTag2.
module.exports.checkPlatform = (platforms) => {
  if (!platforms) return true;
  if (!Array.isArray(platforms)) {
    platforms = platforms.split(',');
  }

  for (platform of platforms) {
    // Recognize by process.platform
    platform = platform.toLowerCase();
    switch (platform) {
      case 'aix':
      case 'darwin':
      case 'freebsd':
      case 'linux':
      case 'openbsd':
      case 'sunos':
      case 'win32':
      case 'darwin':
        if (process.platform === platform.toLowerCase()) return true;
      default:
        // below it is by a tag
        const upperCasePlatfrom = platform.toUpperCase();
        // distroTag1, distroTag2 are Nexss Programmer added tags.
        if (
          process.distroTag1 === upperCasePlatfrom ||
          process.distroTag2 === upperCasePlatfrom
        )
          return true;
        break;
    }
  }
};

module.exports.displayPlatformInfo = () => {};

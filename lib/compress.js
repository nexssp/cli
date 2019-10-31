const UPX = require("upx")(); // see options below
const { exists, rename, unlink } = require("fs");

module.exports.compressExe = async exeFile => {
  if (exeFile && await exists(exeFile)) {
    d(
      `Compressing executable file ${exeFile}, renaming to ${exeFile}_ and compressed saving as ${exeFile}`
    );
    await rename(exeFile, `${exeFile}_`);
    UPX(`${exeFile}_`)
      .output(`${exeFile}`)
      .start()
      .then(function(stats) {
        d(
          `Compression enabled, before ${stats.fileSize.before}, after ${
            stats.fileSize.after
          }, ratio: ${stats.ratio}`
        );
        d(`deleting uncompressed ${exeFile}_`);
        await unlink(`${exeFile}_`);
      })
      .catch(function(err) {
        // ...
        d(red(err));
      });
  } else {
    d(yellow("Compression is enabled but exe file does not exist."));
  }
};

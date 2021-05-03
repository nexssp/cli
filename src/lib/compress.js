const UPX = require("upx")(); // see options below
const fs = require("fs");
const { rename } = require("fs");

module.exports.compressExe = async (exeFile) => {
  if (exeFile && (await fs.promises.stat(exeFile))) {
    d(
      `Compressing executable file ${exeFile}, renaming to ${exeFile}_ and compressed saving as ${exeFile}`
    );
    await rename(exeFile, `${exeFile}_`);
    UPX(`${exeFile}_`)
      .output(`${exeFile}`)
      .start()
      .then(async function (stats) {
        d(
          `Compression enabled, before ${stats.fileSize.before}, after ${stats.fileSize.after}, ratio: ${stats.ratio}`
        );
        d(`deleting uncompressed ${exeFile}_`);
        const u = await fs.unlink(`${exeFile}_`);
      })
      .catch(function (err) {
        // ...
        d(red(err));
      });
  } else {
    d(yellow("Compression is enabled but exe file does not exist."));
  }
};

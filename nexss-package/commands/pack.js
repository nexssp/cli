const fs = require("fs");
const zlib = require("zlib");
// const dirTree = require("directory-tree");
const { NEXSS_PACKAGES_PATH } = require("../../config/config");
const { error, success, warn } = require("@nexssp/logdebug");
const ignore = require("ignore");
ignore().add(fs.readFileSync(filenameOfGitignore).toString()).filter(filenames);

const directoryFiles = fs.readdirSync("G:\\111222333");
console.log(directoryFiles);
process.exit(1);

Promise.all(
  directoryFiles.map((filename) => {
    return new Promise((resolve, reject) => {
      const fileContents = fs.createReadStream(`./data/${filename}`);
      const writeStream = fs.createWriteStream(`./data/${filename}.gz`);
      const zip = zlib.createGzip();
      fileContents
        .pipe(zip)
        .pipe(writeStream)
        .on("finish", (err) => {
          if (err) return reject(err);
          else resolve();
        });
    });
  })
).then(console.log("done"));

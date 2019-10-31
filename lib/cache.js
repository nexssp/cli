const { fileCachePath } = require("../lib/path"),
  fs = require("fs"),
  chalk = require("chalk");
const ms = require("ms");

const getFileUpdatedDate = path => {
  const stats = fs.statSync(path);
  return stats.mtime;
};

const exists = (filename, duration) => {
  console.log("existststs!!!", filename);
  if (duration) {
    const pathToCache = fileCachePath(filename);
    if (fs.existsSync(pathToCache)) {
      const cacheExpiryDate =
        ms(duration) + getFileUpdatedDate(pathToCache).getTime();
      // Cache - check if exists and updated date

      recreateCache = cacheExpiryDate < Date.now();
    } else {
      recreateCache = true;
    }

    if (recreateCache) {
      console.log(chalk.blue("Recreating cache..."));
    } else if (fs.existsSync(pathToCache)) {
      //Cache exists so we get result from cache
      resultToString = fs.readFileSync(pathToCache);
      console.log(`${chalk.red("CACHE")} ${filename}: ${resultToString}`);
      //Object.assign(startData, resultToString);
      return resultToString;
    }
  }
};

const write = (filename, content) => {
  const pathToCache = fileCachePath(filename);
  fs.writeFileSync(pathToCache, content);
};

module.exports.exists = exists;
module.exports.write = write;
module.exports.getFileUpdatedDate = getFileUpdatedDate;

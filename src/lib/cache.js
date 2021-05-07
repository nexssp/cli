const NEXSS_CACHE_PATH = require("os").homedir() + "/.nexss/cache";
const fs = require("fs"),
  { extname } = require("path");

const getFileUpdatedDate = (path) => {
  const stats = fs.statSync(path);
  return stats.mtime;
};

const fileCachePath = (path) => {
  return `${NEXSS_CACHE_PATH}/${path}`;
};

const clean = (glob) => {
  if (!glob) {
    throw "specify glob for cache.clean";
  }
  const globToClean = `${process.env.NEXSS_CACHE_PATH}/${glob}`.replace(
    /\\/g,
    "/"
  );

  const fg = require("fast-glob");
  fg.sync(globToClean).forEach((file) => {
    fs.unlinkSync(file);
  });

  return true;
};

const exists = (path, duration) => {
  if (!cliArgs.nocache) {
    if (duration) {
      const pathToCache = fileCachePath(path);
      if (fs.existsSync(pathToCache)) {
        const cacheExpiryDate =
          require("ms")(duration) + getFileUpdatedDate(pathToCache).getTime();
        // Cache - check if exists and updated date

        recreateCache = cacheExpiryDate < Date.now();
      } else {
        recreateCache = true;
      }

      if (recreateCache) {
        if (cliArgs.debug) {
          console.log(yellow("Recreating cache..."));
        }
      } else if (fs.existsSync(pathToCache)) {
        //Cache exists so we get result from cache
        if (extname(pathToCache) !== ".json") {
          resultToString = fs.readFileSync(pathToCache);
        } else {
          resultToString = fs.readFileSync(pathToCache);
          const json = require("../lib/data/json");
          resultToString = json.parse(resultToString);
        }

        return resultToString;
      }
    }
  }
};

const write = (path, content) => {
  const pathToCache = fileCachePath(path);
  fs.writeFileSync(pathToCache, content);
};

const writeJSON = (filename, content) => {
  module.exports.write(
    filename,
    JSON.stringify(content, (k, v) => (typeof v === "function" ? "" + v : v))
  );
};

const read = (path) => {
  let pathToCache;
  try {
    pathToCache = fileCachePath(path);
  } catch (e) {
    pathToCache = fileCachePath(path);
  }
  const content = fs.readFileSync(pathToCache);
  return content;
};

const readJSON = (filename) => {
  const data = module.exports.read(filename);
  const json = require("../lib/data/json");

  try {
    return json.parse(data, function (k, v) {
      if (
        typeof v === "string" &&
        v.startsWith("function(") &&
        v.endsWith("}")
      ) {
        return eval("(" + v + ")");
      }
      return v;
    });
  } catch (e) {
    console.error("ERROR:", e);
    process.exit();
  }
};
const del = (path) => {
  const pathToCache = fileCachePath(path);
  if (!fs.existsSync(pathToCache)) {
    return;
  }
  return fs.unlinkSync(pathToCache);
};

module.exports = {
  del,
  clean,
  exists,
  write,
  writeJSON,
  read,
  readJSON,
  getFileUpdatedDate,
};
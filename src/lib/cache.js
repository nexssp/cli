const NEXSS_CACHE_PATH = require("os").homedir() + "/.nexss/cache";
const fs = require("fs"),
  { extname } = require("path");
const { setImmediate } = require("timers");
const json = require("../lib/data/json");

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
        let resultToString;
        //Cache exists so we get result from cache
        if (extname(pathToCache) !== ".json") {
          resultToString = fs.readFileSync(pathToCache);
        } else {
          resultToString = fs.readFileSync(pathToCache);
          resultToString = json.parse(resultToString);
        }

        return resultToString;
      }
    }
  }
};

const write = (path, content) => {
  const pathToCache = fileCachePath(path);
  setImmediate(() => {
    fs.writeFileSync(pathToCache, content);
  });
};

const writeJSON = (filename, content) => {
  setImmediate(() => {
    write(
      filename,
      JSON.stringify(content, (k, v) => (typeof v === "function" ? "" + v : v))
    );
  });
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

function readJSON(filename) {
  let data = read(filename);

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
    console.error("ERROR:", "filename: ", filename, "JSON:", data.toString());
    process.exit();
  }
}

const del = (path) => {
  const pathToCache = fileCachePath(path);
  setImmediate(() => {
    if (fs.existsSync(pathToCache)) {
      return fs.unlinkSync(pathToCache);
    }
  });
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

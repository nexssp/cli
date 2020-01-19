const NEXSS_CACHE_PATH = require("os").homedir() + "/.nexss/cache";
const fs = require("fs"),
    chalk = require("chalk"),
    { extname } = require("path");
const ms = require("ms");

const getFileUpdatedDate = path => {
    const stats = fs.statSync(path);
    return stats.mtime;
};

const fileCachePath = path => {
    return `${NEXSS_CACHE_PATH}/${path}`;
};

const exists = (path, duration) => {
    if (!process.argv.includes("--nocache")) {
        if (duration) {
            const pathToCache = fileCachePath(path);
            if (fs.existsSync(pathToCache)) {
                const cacheExpiryDate =
                    ms(duration) + getFileUpdatedDate(pathToCache).getTime();
                // Cache - check if exists and updated date

                recreateCache = cacheExpiryDate < Date.now();
            } else {
                recreateCache = true;
            }

            if (recreateCache) {
                if (process.argv.includes("--verbose")) {
                    console.log(chalk.blue("Recreating cache..."));
                }
            } else if (fs.existsSync(pathToCache)) {
                //Cache exists so we get result from cache
                if (extname(pathToCache) !== ".json") {
                    resultToString = fs.readFileSync(pathToCache);
                } else {
                    resultToString = require(pathToCache);
                }
                if (process.argv.includes("--verbose")) {
                    console.log(`${chalk.red("CACHE")} ${path}: ${resultToString}`);
                }

                //Object.assign(startData, resultToString);
                return resultToString;
            }
        }
    }
};

const write = (path, content) => {
    const pathToCache = fileCachePath(path);
    fs.writeFileSync(pathToCache, content);
};

const read = path => {
    const pathToCache = fileCachePath(path);
    return fs.readFileSync(pathToCache);
};

const del = path => {
    const pathToCache = fileCachePath(path);
    if (!fs.existsSync(pathToCache)) {
        return;
    }
    return fs.unlinkSync(pathToCache);
};

module.exports = {
    del,
    exists,
    write,
    read,
    getFileUpdatedDate
};
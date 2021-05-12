const { getLanguages } = require("../../nexss-language/lib/language");
// We use js as is always installed / nodejs
const cache = require("@nexssp/cache");
cache.setup(process.env.NEXSS_CACHE_PATH);
if (cliArgs.nocache) {
  cache.recreateCache(); //set flag to recreate cache
}
const allInstalledLanguages = getLanguages();
Object.keys(allInstalledLanguages).forEach((ext) => {
  const getLanguageCacheName = `nexss_core_getLanguages_${ext}_.json`;
  cache.del(getLanguageCacheName);
});
getLanguages(true);
log.info("done!");
process.exit(0);

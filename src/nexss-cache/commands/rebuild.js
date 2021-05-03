const { getLanguages } = require("../../nexss-language/lib/language");
// We use js as is always installed / nodejs
const cache = require("../../lib/cache");
const allInstalledLanguages = getLanguages();
Object.keys(allInstalledLanguages).forEach((ext) => {
  const getLanguageCacheName = `nexss_core_getLanguages_${ext}_.json`;
  cache.del(getLanguageCacheName);
});
getLanguages(true);
log.info("done!");
process.exit(0);

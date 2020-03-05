/*
 * Title: Language - Nexss PROGRAMMER 2.0.0
 * Description: Managing Languages
 * Author: Marcin Polak
 * 2018/10/01 initial version
 * 2019/08/12 modified for version 2.
 */

const imageWith = 100;

const { bold, yellow, green } = require("../../lib/color");
const { info } = require("../../lib/log");
const { dirname, join, extname } = require("path");
const {
  readdirSync,
  existsSync,
  mkdirSync,
  // copyFileSync,
  writeFileSync
} = require("fs");
const sharp = require("sharp");

const languages = require("../lib/language");

const resultPath = join(process.cwd(), "result");
const logosPath = join(resultPath, "images", "logos");
if (!existsSync(resultPath)) {
  mkdirSync(resultPath, "0777", true);
}

mkdirSync(logosPath, { recursive: true });

console.log("Copying logos and create json data...");
(async () => {
  let languagesList = await languages.getLanguages();
  info(`Installed languages`);
  let res = [];
  for (var key in languagesList) {
    let details = languagesList[key];
    const languagePath = dirname(details.configFile);
    const logoPath = join(languagePath, "images");
    let logoFileName;
    if (existsSync(logoPath)) {
      const logos = readdirSync(logoPath).filter(e => e.includes("logo"));
      const logo = logos[0] ? logos[0] : null;

      if (logo) {
        logoFileName =
          details.title
            .replace(/\+/g, "p")
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase() + extname(logo);
        const destLogo = `${logosPath}/${logoFileName}`;
        // copyFileSync(`${logoPath}/${logo}`, destLogo);

        await sharp(`${logoPath}/${logo}`)
          .resize(imageWith)
          .toFile(destLogo);
      } else {
        console.log("logo does not exist: " + languagePath);
      }

      if (!details.years) {
        console.log("years does not exist: " + languagePath);
      }

      // Language can have multiple extensions and appear few times
      // on the list
      const check = res.filter(e => e.url === details.url);
      if (check.length) {
        res = res.map(e => {
          if (e.url === details.url) {
            if (Array.isArray(e.extensions)) {
              e.extensions.push(key);
            } else {
              e.extensions = [e.extensions, key];
            }
          }
          return e;
        });
        continue;
      }

      res.push({
        alt: details.title,
        url: details.url,
        extensions: [key],
        logo: `${logoFileName}`,
        years: details.years,
        founders: details.founders
      });
    } else {
      console.log(`not found: ${logoPath}`);
    }
  }

  writeFileSync(`${resultPath}/languages.json`, JSON.stringify(res, null, 2));
  process.exit(1);
})();

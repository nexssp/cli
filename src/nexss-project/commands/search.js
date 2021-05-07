const fs = require("fs");
const path = require("path");
const exists = fs.existsSync;

const {
  NEXSS_PROJECTS_DB,
  NEXSS_PROJECT_CONFIG_PATH,
} = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let nexssConfig = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

let search = cliArgs._[2];

log.info(`Projects from ${bold(NEXSS_PROJECTS_DB)}`);
log.header();
if (exists(NEXSS_PROJECTS_DB)) {
  if (search) console.log(`Searching: ${yellow(bold(search))}`);
  const projects = require(NEXSS_PROJECTS_DB);
  Object.keys(projects).forEach((e) => {
    if (search) {
      search = search.toLowerCase();
      if (
        !(
          e.toLowerCase().indexOf(search) > -1 ||
          (projects[e].keywords &&
            projects[e].keywords.toLowerCase().indexOf(search) > -1)
        )
      ) {
        return;
      }
    }
    let workDir = projects[e].workDir;
    if (!exists(workDir)) {
      log.warn(e, red(" NOT EXISTS "), projects[e].workDir);
      return;
    }
    let isNexss = exists(path.join(workDir, "_nexss.yml"));
    if (isNexss) {
      log.info(yellow(e), green(bold("NEXSSP")), projects[e].workDir);
    } else {
      log.info(yellow(e), " ", projects[e].workDir);
    }
  });
}

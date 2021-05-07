//removes project from the list
const fs = require("fs");
const {
  NEXSS_PROJECTS_DB,
  NEXSS_PROJECT_CONFIG_PATH,
} = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let nexssConfig = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

const projectToDelete = cliArgs._[2];
if (!projectToDelete) {
  log.error(bold("Enter project to delete. eg. nexss p <projectToDelete>"));
  process.exit();
}
let projects = require(NEXSS_PROJECTS_DB);
if (!projects[projectToDelete]) {
  log.error(
    `project ${bold(projectToDelete)} does not exist in ${bold(
      NEXSS_PROJECTS_DB
    )}`
  );
  process.exit();
}

delete projects[projectToDelete];
try {
  fs.writeFileSync(NEXSS_PROJECTS_DB, JSON.stringify(projects, null, 2));
} catch (e) {
  log.error(e);
}

log.success("Done..");

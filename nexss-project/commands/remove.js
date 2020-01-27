//removes project from the list
const { error, success } = require("../../lib/log");
const { bold } = require("../../lib/color");
const fs = require("fs");
const {
  NEXSS_PROJECTS_DB,
  NEXSS_PROJECT_CONFIG_PATH
} = require("../../config/config");
const { loadConfigContent } = require("../../lib/config");
let nexssConfig = loadConfigContent(NEXSS_PROJECT_CONFIG_PATH);

const projectToDelete = process.argv[4];
if (!projectToDelete) {
  error(bold("Enter project to delete. eg. nexss p <projectToDelete>"));
  process.exit();
}
let projects = require(NEXSS_PROJECTS_DB);
if (!projects[projectToDelete]) {
  error(
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
  error(e);
}

success("Done..");

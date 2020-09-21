/**
 * @info All related to the npm
 * @author Marcin Polak mapoart@gmail.com
 */

// Make sure application is installed.
module.exports.npmInstallRun = (path = "../") => {
  if (!require("fs").existsSync(`${__dirname}/../node_modules`)) {
    const command = `npm install --production`;
    try {
      require("child_process").execSync(command, {
        stdio: "inherit",
        detached: false,
        shell: process.platform === "win32" ? true : "/bin/bash",
        cwd: `${__dirname}/${path}`,
      });
    } catch (error) {
      console.log(`Command failed ${command}`);
    }
  }
};

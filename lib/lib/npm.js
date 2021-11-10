// Make sure application is installed.
module.exports.npmInstallRun = (path = '../') => {
  if (!require('fs').existsSync(`${__dirname}/../node_modules`)) {
    console.log('\u001b[1mInstalling \u001b[34mNexss Programmer\u001b[1m .. please wait..\u001b[0m')
    const command = `npm install --production`
    try {
      require('child_process').execSync(command, {
        stdio: 'inherit',
        detached: false,
        shell: process.shell,
        cwd: `${__dirname}/${path}`,
      })
    } catch (error) {
      console.log(`Command failed ${command}`)
    }
  }
}

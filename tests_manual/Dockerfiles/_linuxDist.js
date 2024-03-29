// Testing Nexss Programmer in different Linux distributions
const { execSync } = require('child_process')

const buildNocache = '--no-cache'
const path = require('path')
const cliArgs = require('minimist')(process.argv.slice(2))
const { yellow, bold, green } = require('@nexssp/ansi')

if (!cliArgs._[0]) {
  console.error('You need to pass dockerFile filename as argument.')
  console.error('you can pass --color for colored output')
  process.exit(1)
} else if (!require('fs').existsSync(cliArgs._[0])) {
  console.error(`${bold(cliArgs._[0])} does not exists`)
  process.exit(1)
}

if (!cliArgs._[1]) {
  console.log(`\nYou haven't selected the type of run:
1) ${bold('local')} - create virtual discs to local environment
2) ${bold('local-testlangs')} - run all language tests
3) ${bold('local-empty')} - local but fresh start / clean cache folder
4) ${bold('clone')} - clones from the repository
5) ${bold('empty')} - nothing is installed, just nodejs, npm.
6) ${bold('npminstall')} - installs from ${magenta('LIVE')}, npm i @nexssp/cli -g
\nexample: ${yellow(`nexss ${require('path').basename(__filename)} ${cliArgs._[0]}` + ` local`)}
`)
  process.exit(1)
}
const opts = ['local', 'local-empty', 'clone', 'empty', 'npminstall', 'local-testlangs']
if (!opts.includes(cliArgs._[1])) {
  console.error(`You can only pass ${opts.join(', ')}`)
  process.exit(0)
}

const dockerFile = cliArgs._[0].replace(/\.\\/, '')
console.log('Dockerfile:', yellow(dockerFile))
const tag = dockerFile.replace('.Dockerfile', '')
const imageName = `nexss:${tag}`
console.log('Image name:', yellow(imageName))
// =====================================================================
console.log(`
Nexss Programmer uses docker to test it for different OS distributions.
If the test is not starting quickly, means that your docker-machine is not working or 
your environment is not setup properly
Troubleshooting: 
${bold('1st')} Check if the docker machine is running and check ip
    docker-machine start && docker-machine ip
${bold('2nd')} Setup environment, run below command for your shell 
${green(bold('WSL'))}:
    eval $(docker-machine.exe env docker-host --shell wsl ) && export DOCKER_CERT_PATH=$(wslpath $DOCKER_CERT_PATH)
${green(bold('Powershell'))}:
    docker-machine.exe env --shell powershell default | Invoke-Expression
${green(bold('cmd'))}
    $(docker-machine env default) | Invoke-Expression
${green(bold('Bash'))} etc.
    $(docker-machine env default) | bash
${bold('3rd')}
To connect to diferrent machine use: docker -H <host:port>
`)

// Checks if docker image exists.
// See list of all docker images by docker image ls
function imageExists(imageName) {
  console.log(bold('Checking if image exists. If this is taking longer see above.'))
  try {
    const cmd = `docker inspect --type=image ${imageName}`
    // console.log(`Run: ${cmd}`);
    execSync(cmd, {
      stdio: ['inherit'],
      maxBuffer: 10485760,
    })
    return true
  } catch (e) { }
  console.log(bold('Docker is working..'))
}

function createImage(imageName, dockerFile) {
  const cmd = `docker build ${buildNocache} -q -t ${imageName} ${dockerFile ? `-f ${dockerFile}` : ''
    } .`
  console.log(`Run: ${cmd}`)
  try {
    const res = execSync(cmd, {
      stdio: ['inherit'],
      maxBuffer: 10485760,
    })
  } catch (e) {
    console.log(e)
    console.log('There was an error during:', cmd)
    process.exit(1)
  }
}

if (!imageExists(imageName)) {
  //   error(`NEXSS:error/image does not exist: ${imageName}, creating it..`);
  createImage(imageName, dockerFile)
} else {
  console.log(`image exist: ${imageName}`)
}

function pathToDocker(p) {
  return p.replace(/^(.):(.*)/, ($0, $1, $2) => `\\\\${$1.toLowerCase()}${$2}`).replace(/\\/g, '/')
}

const pathNexssCli = pathToDocker(path.resolve(process.cwd(), '../../'))
const pathDotNexss = pathToDocker(path.join("/mnt/h/", '.nexss'))
const pathWork = pathToDocker(path.join(require('os').homedir(), '.nexssWork'))
const pathApps = pathToDocker(path.join(require('os').homedir(), '.nexssApps'))
const pathNexssPackages = pathToDocker(
  path.join(require('os').homedir(), '.nexss', 'Future', 'mypackages')
)

// There are some issues with the Swift on docker containers so we need to run docker in --privileged mode.
const privileged = '--privileged'
const detached = '-d' // "-d";
const { distros } = require('@nexssp/os')

let shell
shell = '/bin/bash'

if (tag.toLowerCase().includes('alpine')) {
  shell = '/bin/sh'
}

console.log(`Shell: ${shell}`)
let command
let attachNexssCommand = "cd /nexssCli/lib && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss"
if (process.platform !== "win32") {
  attachNexssCommand = "cd /nexssCli/lib && chmod +x nexss.js && ln -s /nexssCli/lib/nexss.js /usr/bin/nexss"
}

switch (cliArgs._[1]) {
  case 'local':
    command = `docker run ${privileged} -u root -i ${detached} -v ${pathApps}:/root/.nexssApps -v ${pathWork}:/work -v ${pathNexssCli}:/nexssCli -v ${pathDotNexss}:/root/.nexss -v /root/.nexss/cache -v ${pathNexssPackages}:/packages -e DEBIAN_FRONTEND=noninteractive -t ${imageName} ${shell} -c "${attachNexssCommand} && cd /work && ${shell}" `
    break
  case 'local-testlangs':
    command = `docker run ${privileged} -i ${detached} -v ${pathApps}:/root/.nexssApps -v ${pathWork}:/work -v ${pathNexssCli}:/nexssCli -v ${pathDotNexss}:/root/.nexss -v /root/.nexss/cache -v ${pathNexssPackages}:/packages -e DEBIAN_FRONTEND=noninteractive -t ${imageName} ${shell} -c "${attachNexssCommand} && cd /work && nexss test languages && ${shell}" `
    break
  case 'local-empty':
    command = `docker run ${privileged} -i ${detached} -v /work -v ${pathNexssCli}:/nexssCli -e DEBIAN_FRONTEND=noninteractive -t ${imageName} ${shell} -c "${attachNexssCommand} && cd /work && ${shell}" `
    break
  case 'clone':
    command = `docker run ${privileged} ${detached} -it -v /work ${imageName} ${shell} -c "npx @nexssp/os install git && git clone --depth=1 https://github.com/nexssp/cli.git && cd cli && npm install && cd lib && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && cd /work && ${shell}"`
    break
  case 'empty':
    command = `docker run ${privileged} ${detached} -it ${imageName} ${shell}`
    break
  case 'npminstall':
    command = `docker run ${privileged} ${detached} -it ${imageName} ${shell} -c "npm i @nexssp/cli -g && nexss && mkdir /work && cd /work && ${shell}`
  default:
    break
}

if (imageName === 'nexss:NixOS' || imageName === 'nexss:Alpine312') {
  command = command.replace(/\/bin\/bash/gi, '/bin/sh')
}

console.log(`Command: ${command}`)
try {
  const res = execSync(
    // You can build packages inside the container, for dev whatever is needed.
    // `docker run -d -t ${imageName} npm i @nexssp/cli -g && nexss && nexss test all --onlyErrors`,

    command,
    {
      stdio: ['inherit'],
    }
  )

  const containerId = res.toString().trim()
  if (containerId) {
    console.log(`Container created: ${containerId}`)
    let sleep = 'ping 127.0.0.1 -n 2 2> nul'
    if (process.platform !== 'win32') {
      sleep = 'sleep 2'
    }

    try {
      const logCommand = `${sleep} && docker logs ${containerId}`
      const dockerLog = execSync(logCommand, {
        shell: true,
        stdio: ['inherit'],
      })
      console.log(`Container: ${bold(containerId)}`)
      console.log('LOG:', dockerLog.toString())
      console.log(green(`docker attach ${bold(containerId)}`))
    } catch (e) {
      console.log('containerID', containerId)
      console.log(e)
    }
  } else {
    console.log(`Error: No container Id returned from logs. Did you run anything there`)
  }
} catch (e) {
  console.log(e)
}

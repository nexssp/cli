// Testing Nexss Programmer in different Linux distributions
const { error, ok } = require("../../lib/log");
const { bold, yellow, magenta, blue } = require("@nexssp/ansi");
const execSync = require("child_process").execSync;
const buildNocache = "--no-cache";
const path = require("path");

if (!process.argv[2]) {
  console.error("You need to pass dockerFile filename as argument.");
  console.error("you can pass --color for colored output");
  process.exit(1);
} else if (!require("fs").existsSync(process.argv[2])) {
  console.error(`${bold(process.argv[2])} does not exists`);
  process.exit(1);
}

if (!process.argv[3]) {
  console.log(`\nYou haven't selected the type of run:
1) ${blue("local")} - create virtual discs to local environment
2) ${blue("local-testlangs")} - run all language tests
3) ${blue("local-empty")} - local but fresh start / clean cache folder
4) ${blue("clone")} - clones from the repository
5) ${blue("empty")} - nothing is installed, just nodejs, npm.
6) ${blue("npminstall")} - installs from ${magenta(
    "LIVE"
  )}, npm i @nexssp/cli -g
\nexample: ${yellow(
    "nexss " +
      require("path").basename(__filename) +
      ` ${process.argv[2]}` +
      " local"
  )}
`);
  process.exit(1);
}
const opts = [
  "local",
  "local-empty",
  "clone",
  "empty",
  "npminstall",
  "local-testlangs",
];
if (!opts.includes(process.argv[3])) {
  console.error(`You can only pass ${opts.join(", ")}`);
  process.exit(0);
}

let dockerFile = process.argv[2].replace(/\.\\/, "");
console.log("Dockerfile:", yellow(dockerFile));
const tag = dockerFile.replace(".Dockerfile", "");
const imageName = `nexss:${tag}`;
console.log("Image name:", yellow(imageName));
// =====================================================================
console.log(`
Nexss Programmer uses docker to test it for different OS distributions.
If the test is not starting quickly, means that your docker-machine is not working or 
your environment is not setup properly
Troubleshooting: 
${bold("1st")} Check if the docker machine is running and check ip
    docker-machine start && docker-machine ip
${bold("2nd")} Setup environment, run below command for your shell 
${blue(bold("WSL"))}:
    eval $(docker-machine.exe env docker-host --shell wsl ) && export DOCKER_CERT_PATH=$(wslpath $DOCKER_CERT_PATH)
${blue(bold("Powershell"))}:
    docker-machine.exe env --shell powershell default | Invoke-Expression
${blue(bold("cmd"))}
    $(docker-machine env default) | Invoke-Expression
${blue(bold("Bash"))} etc.
    $(docker-machine env default) | bash
${bold("3rd")}
To connect to diferrent machine use: docker -H <host:port>
`);

// Checks if docker image exists.
// See list of all docker images by docker image ls
function imageExists(imageName) {
  console.log(
    bold("Checking if image exists. If this is taking longer see above.")
  );
  try {
    const cmd = `docker inspect --type=image ${imageName}`;
    // console.log(`Run: ${cmd}`);
    execSync(cmd, {
      stdio: ["inherit"],
      maxBuffer: 10485760,
    });
    return true;
  } catch (e) {}
  console.log(bold("Docker is working.."));
}

function createImage(imageName, dockerFile) {
  const cmd = `docker build ${buildNocache} -q -t ${imageName} ${
    dockerFile ? `-f ${dockerFile}` : ""
  } .`;
  console.log(`Run: ${cmd}`);
  try {
    var res = execSync(cmd, {
      stdio: ["inherit"],
      maxBuffer: 10485760,
    });
  } catch (e) {
    console.log(e);
    console.log("There was an error during:", cmd);
    process.exit(1);
  }
}

if (!imageExists(imageName)) {
  //   error(`NEXSS:error/image does not exist: ${imageName}, creating it..`);
  createImage(imageName, dockerFile);
} else {
  console.log(`image exist: ${imageName}`);
}

function pathToDocker(p) {
  return p
    .replace(/^(.):(.*)/, function ($0, $1, $2) {
      return "\\\\" + $1.toLowerCase() + $2;
    })
    .replace(/\\/g, "/");
}

const pathNexssCli = pathToDocker(path.resolve(process.cwd(), "../../"));
const pathDotNexss = pathToDocker(path.join(require("os").homedir(), ".nexss"));
const pathWork = pathToDocker(path.join(require("os").homedir(), ".nexssWork"));

// There are some issues with the Swift on docker containers so we need to run docker in --privileged mode.
const privileged = "--privileged";
const detached = "-d"; // "-d";
const { distros } = require("@nexssp/os");
let shell;
switch (tag) {
  case "Alpine312":
    shell = "/bin/sh";
    break;
  default:
    shell = "/bin/bash";
    break;
}

console.log(`Shell: ${shell}`);
let command;
switch (process.argv[3]) {
  case "local":
    command = `docker run ${privileged} -i ${detached} -v ${pathWork}:/work -v ${pathNexssCli}:/nexssCli -v ${pathDotNexss}:/root/.nexss -v /root/.nexss/cache -e DEBIAN_FRONTEND=noninteractive -t ${imageName} ${shell} -c "cd /nexssCli && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && cd /work && ${shell}" `;
    break;
  case "local-testlangs":
    command = `docker run ${privileged} -i ${detached} -v ${pathWork}:/work -v ${pathNexssCli}:/nexssCli -v ${pathDotNexss}:/root/.nexss -v /root/.nexss/cache -e DEBIAN_FRONTEND=noninteractive -t ${imageName} ${shell} -c "cd /nexssCli && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && cd /work && nexss test languages && ${shell}" `;
    break;
  case "local-empty":
    command = `docker run ${privileged} -i ${detached} -v /work -v ${pathNexssCli}:/nexssCli -v /root/.nexss/cache -e DEBIAN_FRONTEND=noninteractive -t ${imageName} ${shell} -c "cd /nexssCli && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && cd /work && ${shell}" `;
    break;
  case "clone":
    command = `docker run ${privileged} ${detached} -it -v /work ${imageName} ${shell} -c "git clone --depth=1 https://github.com/nexssp/cli.git && cd cli && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && cd /work && ${shell}"`;
    break;
  case "empty":
    command = `docker run ${privileged} ${detached} -it ${imageName} ${shell}`;
    break;
  case "npminstall":
    command = `docker run ${privileged} ${detached} -it ${imageName} bash -c "npm i @nexssp/cli -g && nexss && mkdir /work && cd /work && ${shell}`;
  default:
    break;
}

if (imageName === "nexss:NixOS" || imageName === "nexss:Alpine312") {
  command = command.replace(/\/bin\/bash/gi, "/bin/sh");
}
try {
  var res = execSync(
    // You can build packages inside the container, for dev whatever is needed.
    // `docker run -d -t ${imageName} npm i @nexssp/cli -g && nexss && nexss test all --onlyErrors`,

    command,
    {
      stdio: ["inherit"],
    }
  );

  const containerId = res.toString().trim();
  if (containerId) {
    console.log(`Container created: ${containerId}`);
    let sleep = "ping 127.0.0.1 -n 2 2> nul";
    if (process.platform !== "win32") {
      sleep = "sleep 2";
    }

    try {
      const logCommand = `${sleep} && docker logs ${containerId}`;
      var dockerLog = execSync(logCommand, {
        shell: true,
        stdio: ["inherit"],
      });
      console.log(`Container: ${bold(containerId)}`);
      console.log("LOG:", dockerLog.toString());
      console.log(blue(`docker attach ${bold(containerId)}`));
    } catch (e) {
      console.log("containerID", containerId);
      console.log(e);
    }
  } else {
    console.log(
      `Error: No container Id returned from logs. Did you run anything there`
    );
  }
} catch (e) {
  console.log(e);
}

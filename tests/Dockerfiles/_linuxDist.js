// Testing Nexss Programmer in different Linux distributions
const { error, ok } = require("../../lib/log");
const { bold, yellow } = require("@nexssp/ansi");
const execSync = require("child_process").execSync;
const buildNocache = "--no-cache";
const path = require("path");

if (!process.argv[2]) {
  console.error("You need to pass dockerFile filename as argument.");
  console.error("you can pass --color for colored output");
  process.exit(1);
} else if (require("fs").existsSync()) {
  console.error(`${bold(dockerFile)} does not exists`);
  process.exit(1);
}

let dockerFile = process.argv[2].replace(/\.\\/, "");
console.log("Dockerfile:", yellow(dockerFile));

const imageName = `nexss:${dockerFile}`;

// =====================================================================
console.log(`
Nexss Programmer uses docker to test it for different OS distributions.
If the test is not starting quickly, means that your docker-machine is not working or 
your environment is not setup properly
Troubleshooting: 
${bold("1st")} Check if the docker machine is running and check ip
    docker-machine start && docker-machine ip

${bold("2nd")} Setup environment, run below command for your shell 
WSL:
    eval $(docker-machine.exe env docker-host --shell wsl ) && export DOCKER_CERT_PATH=$(wslpath $DOCKER_CERT_PATH)
Powershell:
    docker-machine.exe env --shell powershell default | Invoke-Expression
Cmd
    $(docker-machine env default) | Invoke-Expression
Bash etc.
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
// const command = `docker run -d -t ${imageName} bash -c "npm i @nexssp/cli -g && nexss && nexss test all --onlyErrors && mkdir /work && cd /work && /bin/bash`;
const command = `docker run -i -d -v ${pathWork}:/work -v ${pathNexssCli}:/nexssCli -v ${pathDotNexss}:/root/.nexss -v /root/.nexss/cache -e DEBIAN_FRONTEND=noninteractive -t ${imageName} /bin/bash -c "cd /nexssCli && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && cd /work && /bin/bash" `;
// const command = `docker run -d -it ${imageName} bash -c "npm i @nexssp/cli -g && nexss && mkdir /work && cd /work && /bin/bash`;
// const command = `docker run -d -it ${imageName} bin/sh -c "git clone --depth=1 https://github.com/nexssp/cli.git && cd cli && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && /bin/bash"`;
// const command = `docker run -d -it ${imageName} bin/sh`;
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
      console.log(`Container: ${containerId}`);
      console.log("LOG:", dockerLog.toString());
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

// Testing Nexss Programmer in different Linux distributions
const { error, ok } = require("../lib/log");
const { bold } = require("../lib/color");
const execSync = require("child_process").execSync;
const buildNocache = "--no-cache";
console.log(`
Nexss Programmer uses docker to test it for different OS distributions.
If the test is not starting quickly, means that your docker-machine is not working or 
your environment is not setup properly
Troubleshooting: 
1st Check if the docker machine is running
    docker-machine start

2nd Setup environment, run below command for your shell
Powershell:
    docker-machine.exe env --shell powershell default | Invoke-Expression
Cmd
    $(docker-machine env default) | Invoke-Expression
Bash etc.
    $(docker-machine env default) | bash
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
  let params;
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
  }
}

// test
const dockerFile = "Arch.Dockerfile"; //"Alpine3.12.Dockerfile";
const imageName = `nexss:${dockerFile}`;
if (!imageExists(imageName)) {
  //   error(`NEXSS:error/image does not exist: ${imageName}, creating it..`);
  createImage(imageName, dockerFile);
} else {
  console.log(`image exist: ${imageName}`);
}

try {
  var nodeResult = execSync(
    `docker run -t ${imageName} nexss test all --onlyErrors`,
    {
      stdio: ["inherit"],
      maxBuffer: 10485760,
    }
  );

  const containerId = nodeResult.toString().trim();
  if (containerId) {
    console.error(`Container created: ${containerId}`);
    let sleep = "ping 127.0.0.1 -n 2 2> nul";
    if (process.platform !== "win32") {
      sleep = "sleep 2";
    }

    try {
      const c = `${sleep} && docker logs ${containerId}`;
      console.log("RUUUUNNN!!!", c);
      var dockerLog = execSync(c, {
        maxBuffer: 10485760,
        shell: true,
        stdio: ["inherit"],
      });
      console.log(`Container: ${containerId}`);
      console.log("LOG:", dockerLog.toString());
    } catch (e) {
      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      console.log("containerID", containerId);
      console.log(e);
      process.exit;
    }
  } else {
    console.log(
      `Error: No container Id returned from logs. Did you run anything there`
    );
  }
} catch (e) {
  console.log(e);
}

// console.log(imageExists("archlinux:latest"));

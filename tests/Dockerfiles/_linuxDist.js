// Testing Nexss Programmer in different Linux distributions
const { error, ok } = require("../../lib/log");
const { bold, yellow } = require("../../lib/color");
const execSync = require("child_process").execSync;
const buildNocache = "--no-cache";

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
    process.exit(1);
  }
}

if (!imageExists(imageName)) {
  //   error(`NEXSS:error/image does not exist: ${imageName}, creating it..`);
  createImage(imageName, dockerFile);
} else {
  console.log(`image exist: ${imageName}`);
}

try {
  var res = execSync(
    // You can build packages inside the container, for dev whatever is needed.
    // `docker run -d -t ${imageName} npm i @nexssp/cli -g && nexss && nexss test all --onlyErrors`,
    `docker run -d -t ${imageName} bin/sh -c "git clone --depth=1 https://github.com/nexssp/cli.git && cd cli && chmod +x nexss.js && ln -s $(pwd)/nexss.js /usr/bin/nexss && nexss && nexss test errors"`,
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

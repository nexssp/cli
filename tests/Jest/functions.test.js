let path = require("path");
let exec = require("child_process").exec;

describe("Testing nexss", () => {
  test("--version", async (done) => {
    await cli(["--version"], ".").then((e) => {
      expect(e.stdout).toMatch(/\d+.\d+.\d+/);
    });
    done();
  });

  test("-dev-colors", async (done) => {
    await cli(["--dev-colors"], ".").then((e) => {
      expect(e.stdout).toMatch(/^.*bold.*/);
    });
    done();
  });

  test("-env", async (done) => {
    await cli(["--env"], ".").then((e) => {
      expect(e.stdout).toContain("Environment");
    });
    done();
  });
});

function cli(args, cwd) {
  return new Promise((resolve, reject) => {
    exec(
      `node ${path.resolve(__dirname, "../../", "./nexss.js")} ${args.join(
        " "
      )}`,
      { cwd },
      (error, stdout, stderr) => {
        if (stderr) {
          reject(stderr);
        } else {
          resolve({
            code: error && error.code ? error.code : 0,
            error,
            stdout,
            stderr,
          });
        }
      }
    );
  });
}

// cli(["--version"], ".").then((e) => console.log(e));

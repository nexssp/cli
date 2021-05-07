const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_PACKAGES_PATH } = require("../../config/config");
const packagesPath = `${NEXSS_PACKAGES_PATH}`;

let pkgs = [];
// TODO: To fix below syntac - make more efficient! works for now
if (!fs.existsSync(packagesPath)) {
  console.error("Packages path has not been found.", packagesPath);
  process.exit(1);
}
let authors = fs.readdirSync(packagesPath);
process.chdir(packagesPath);

const spawnOptions = require("../../config/spawnOptions");

if (cliArgs._[4]) {
  if (!fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${cliArgs._[4]}`)) {
    console.error(
      `Package ${red(
        cliArgs._[4]
      )} not found. To install new packages eg: ${green(
        bold(` nexss pkg install ${cliArgs._[4]}`)
      )}`
    );
    process.exitCode = 1;
    return;
  }
  authors = [cliArgs._[4]];
}

authors.forEach((author) => {
  if (author === "@dev" || author === "@nexssp") return;
  if (
    author !== "3rdPartyLibraries" &&
    fs.statSync(`${packagesPath}/${author}`).isDirectory()
  ) {
    if (author.indexOf("@") === 0) {
      fs.readdirSync(`${packagesPath}/${author}`).map((pkg) => {
        if (!fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
          if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
            fs.readdirSync(`${packagesPath}/${author}/${pkg}`).map(
              (details) => {
                console.log(
                  `${blue("Package setup:")} ${packagesPath}/${author}/${pkg}`
                );
                try {
                  require("child_process").execSync(
                    `nexss cmd init ${author}/${pkg}`,
                    spawnOptions({
                      cwd: `${packagesPath}/${author}/${pkg}/${details}`,
                    })
                  );
                  log.success(
                    `Completed init for package ${packagesPath}/${author}/${pkg}/${details}`
                  );
                } catch (er) {
                  console.error(er);
                  process.exit();
                }
              }
            );
          } else {
            // pkgs.push({
            //   type: "file",
            //   path: `${packagesPath}/${author}/${pkg}`
            // });
          }
        } else {
          // 3rdPartyLibraries is a directory where nexss install additional libs.
          if (pkg !== "3rdPartyLibraries") {
            console.log(`${blue("Package setup:")} ${author}/${pkg}`);
            try {
              require("child_process").execSync(
                `nexss cmd init ${author}/${pkg}`,
                spawnOptions({
                  cwd: `${packagesPath}/${author}/${pkg}`,
                })
              );
            } catch (er) {
              console.error(er);
              process.exit();
            }
          }
        }
      });
    } else {
      if (fs.existsSync(`${packagesPath}/${author}/_nexss.yml`)) {
        if (author !== "3rdPartyLibraries") {
          try {
            console.log(`${blue("Package setup:")} ${author}`);
            require("child_process").execSync(
              `nexss cmd init ${author}`,
              spawnOptions({
                cwd: `${packagesPath}/${author}`,
              })
            );
          } catch (er) {
            console.error(er);
            process.exit();
          }
        }
      }
      fs.readdirSync(`${packagesPath}/${author}`).map((pkg) => {
        // 3rdPartyLibraries is a directory where nexss install additional libs.
        if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
          // console.log(`${packagesPath}/${author}/${pkg}/_nexss.yml`);
          if (fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
            if (pkg !== "3rdPartyLibraries") {
              console.log(
                `${blue("Package setup:")} ${packagesPath}/${author}/${pkg}`
              );
              try {
                require("child_process").execSync(
                  `nexss cmd init ${author}/${pkg}`,
                  spawnOptions({
                    cwd: `${packagesPath}/${author}/${pkg}`,
                  })
                );
              } catch (er) {
                console.error(er);
                process.exit();
              }
            }
          }
        }
      });
    }
  }
});

if (pkgs.length > 0) {
  if (cliArgs._.slice(6).length > 0) {
    var options = {
      // pre: "<",
      // post: ">",
      extract: function (el) {
        return `${el.path} ${el.type}`;
      },
    };
    let fuzzy = require("fuzzy");
    let fuzzyResult = fuzzy.filter(cliArgs._.slice(6).join(" "), pkgs, options);
    pkgs = fuzzyResult.map(function (el) {
      return el.original;
    });
    // const pkgs = new FuzzySearch(pkgs, ["type", "path"], {
    //   caseSensitive: false
    // });
  }

  if (cliArgs.json) {
    console.log(JSON.stringify(pkgs.flat()));
  } else {
    pkgs.forEach((e) => {
      console.log(e);
    });
  }
} else {
  // console.warn(`No packages found at ${NEXSS_PACKAGES_PATH}`);
}

// packages = packages || [];
// packages.forEach(function(file) {
//   if (fs.statSync(dir + file).isDirectory()) {
//     filelist = walkSync(dir + file + "/", filelist);
//   } else {
//     filelist.push(file);
//   }
// });

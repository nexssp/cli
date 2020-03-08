const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_PACKAGES_PATH } = require("../../config/config");
const packagesPath = `${NEXSS_PACKAGES_PATH}`;
const cliArgs = require("minimist")(process.argv);
const authors = fs.readdirSync(packagesPath);
const { success } = require("../../lib/log");

let pkgs = [];
// TODO: To fix below syntac - make more efficient! works for now
process.chdir(packagesPath);
authors.forEach(author => {
  if (author === "@dev") return;
  if (
    author !== "3rdPartyLibraries" &&
    fs.statSync(`${packagesPath}/${author}`).isDirectory()
  ) {
    if (author.indexOf("@") === 0) {
      fs.readdirSync(`${packagesPath}/${author}`).map(pkg => {
        if (!fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
          if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
            fs.readdirSync(`${packagesPath}/${author}/${pkg}`).map(details => {
              console.log(`Starting: ${packagesPath}/${author}/${pkg}`);
              try {
                require("child_process").execSync(`nexss cmd init`, {
                  cwd: `${packagesPath}/${author}/${pkg}/${details}`,
                  stdio: "inherit"
                });
                success(
                  `Completed init for package ${packagesPath}/${author}/${pkg}/${details}`
                );
              } catch (er) {
                console.error(er);
                process.exit();
              }
            });
          } else {
            // pkgs.push({
            //   type: "file",
            //   path: `${packagesPath}/${author}/${pkg}`
            // });
          }
        } else {
          // 3rdPartyLibraries is a directory where nexss install additional libs.
          if (pkg !== "3rdPartyLibraries") {
            console.log(`Starting: ${author}/${pkg}`);
            try {
              require("child_process").execSync(`nexss cmd init`, {
                cwd: `${packagesPath}/${author}/${pkg}`,
                stdio: "inherit"
              });
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
            console.log(`Starting: ${author}`);
            require("child_process").execSync(`nexss cmd init`, {
              cwd: `${packagesPath}/${author}`,
              stdio: "inherit"
            });
          } catch (er) {
            console.error(er);
            process.exit();
          }
        }
      }
      fs.readdirSync(`${packagesPath}/${author}`).map(pkg => {
        // console.log("pkg!!!!!", pkg);
        // if (author == "Keyboard") console.log("pkg!!!!", pkg);
        // 3rdPartyLibraries is a directory where nexss install additional libs.
        if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
          // console.log(`${packagesPath}/${author}/${pkg}/_nexss.yml`);
          if (fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
            if (pkg !== "3rdPartyLibraries") {
              console.log(`Starting: ${packagesPath}/${author}/${pkg}`);
              try {
                require("child_process").execSync(`nexss cmd init`, {
                  cwd: `${packagesPath}/${author}/${pkg}`,
                  stdio: "inherit"
                });
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
  if (cliArgs._.slice(4).length > 0) {
    var options = {
      // pre: "<",
      // post: ">",
      extract: function(el) {
        return `${el.path} ${el.type}`;
      }
    };
    let fuzzy = require("fuzzy");
    let fuzzyResult = fuzzy.filter(cliArgs._.slice(4).join(" "), pkgs, options);
    pkgs = fuzzyResult.map(function(el) {
      return el.original;
    });
    // const pkgs = new FuzzySearch(pkgs, ["type", "path"], {
    //   caseSensitive: false
    // });
  }

  if (cliArgs.json) {
    console.log(JSON.stringify(pkgs.flat()));
  } else {
    pkgs.forEach(e => {
      console.log(e);
    });
  }
} else {
  console.warn(`No packages found at ${NEXSS_PACKAGES_PATH}`);
}

// packages = packages || [];
// packages.forEach(function(file) {
//   if (fs.statSync(dir + file).isDirectory()) {
//     filelist = walkSync(dir + file + "/", filelist);
//   } else {
//     filelist.push(file);
//   }
// });

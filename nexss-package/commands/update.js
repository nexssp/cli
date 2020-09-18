const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_PACKAGES_PATH } = require("../../config/config");
const packagesPath = `${NEXSS_PACKAGES_PATH}`;
const cliArgs = require("minimist")(process.argv);
const { bold, green } = require("@nexssp/ansi");
if (!fs.existsSync(packagesPath)) {
  console.log(
    `Packages path ${bold(packagesPath)} does not exist. Installing..`
  );
  require("../../nexss-package/lib/install").installPackages(
    NEXSS_PACKAGES_PATH
  );
}
const spawnOptions = require("../../config/spawnOptions");
const authors = fs.readdirSync(packagesPath);

let pkgs = [];
// TODO: To fix below syntac - make more efficient! works for now
// TODO: Make it DRY LATER - this is done jst to get it to work
process.chdir(packagesPath);
authors.forEach((author) => {
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
                  `${bold(
                    green("Update package")
                  )}: ${packagesPath}/${author}/${pkg}`
                );
                try {
                  require("child_process").execSync(
                    `git pull --rebase origin master`,
                    spawnOptions({
                      cwd: `${packagesPath}/${author}/${pkg}/${details}`,
                      stdio: "inherit",
                    })
                  );
                  success(
                    `Package update checked. ${packagesPath}/${author}/${pkg}/${details}`
                  );
                } catch (er) {
                  // console.error(er);
                  // process.exit();
                  console.error(
                    bold(
                      `${packagesPath}/${author}/${pkg}/${details} not a git repo?`
                    )
                  );
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
            console.log(`${bold(green("Update package"))}: ${author}/${pkg}`);
            try {
              require("child_process").execSync(
                `git pull --rebase origin master`,
                spawnOptions({
                  cwd: `${packagesPath}/${author}/${pkg}`,
                  stdio: "inherit",
                })
              );
            } catch (er) {
              console.error(
                bold(`${packagesPath}/${author}/${pkg} not a git repo?`)
              );
            }
          }
        }
      });
    } else {
      if (fs.existsSync(`${packagesPath}/${author}/_nexss.yml`)) {
        if (author !== "3rdPartyLibraries") {
          try {
            console.log(`${bold(green("Update package"))}: ${author}`);
            require("child_process").execSync(
              `git pull --rebase origin master`,
              spawnOptions({
                cwd: `${packagesPath}/${author}`,
                stdio: "inherit",
              })
            );
          } catch (er) {
            console.error(bold(`${packagesPath}/${author} not a git repo?`));
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
                `${bold(
                  green("Update package")
                )}: ${packagesPath}/${author}/${pkg}`
              );
              try {
                require("child_process").execSync(
                  `git pull --rebase origin master`,
                  spawnOptions({
                    cwd: `${packagesPath}/${author}/${pkg}`,
                    stdio: "inherit",
                  })
                );
              } catch (er) {
                console.error(
                  bold(`${packagesPath}/${author}/${pkg} not a git repo?`)
                );
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
      extract: function (el) {
        return `${el.path} ${el.type}`;
      },
    };
    let fuzzy = require("fuzzy");
    let fuzzyResult = fuzzy.filter(cliArgs._.slice(4).join(" "), pkgs, options);
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

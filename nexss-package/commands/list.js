const fs = require("fs");
// const dirTree = require("directory-tree");
const { NEXSS_PACKAGES_PATH } = require("../../config/config");
const packagesPath = `${NEXSS_PACKAGES_PATH}`;
const cliArgs = require("minimist")(process.argv);
const authors = fs.readdirSync(packagesPath);

let pkgs = [];
// TODO: To fix below syntac - make more efficient! works for now
authors.forEach(author => {
  if (
    author !== "3rdPartyLibraries" &&
    fs.statSync(`${packagesPath}/${author}`).isDirectory()
  ) {
    if (author.indexOf("@") === 0) {
      fs.readdirSync(`${packagesPath}/${author}`).map(pkg => {
        if (!fs.existsSync(`${packagesPath}/${author}/${pkg}/_nexss.yml`)) {
          if (fs.statSync(`${packagesPath}/${author}/${pkg}`).isDirectory()) {
            fs.readdirSync(`${packagesPath}/${author}/${pkg}`).map(details => {
              pkgs.push({ type: "pkg", path: `${author}/${pkg}/${details}` });
            });
          } else {
            pkgs.push({
              type: "file",
              path: `${packagesPath}/${author}/${pkg}`
            });
          }
        } else {
          // 3rdPartyLibraries is a directory where nexss install additional libs.
          if (pkg !== "3rdPartyLibraries") {
            pkgs.push({
              type: "pkg",
              path: `${author}/${pkg}`
            });
          }
        }
      });
    } else {
      if (fs.existsSync(`${packagesPath}/${author}/_nexss.yml`)) {
        if (author !== "3rdPartyLibraries") {
          pkgs.push({
            type: "pkg",
            path: `${author}`
          });
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
              pkgs.push({
                type: "pkg",
                path: `${author}/${pkg}`
              });
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

/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const minimist = require('minimist')
const fs = require('fs')
const { getFiles } = require('./start/files')
const { stripEndQuotes } = require('@nexssp/extend/string')
const { is } = require('@nexssp/data')
const { NEXSS_PACKAGES_PATH } = require('@nexssp/package/src/config/packages-config')

function preVars(isn) {
  const { vars } = require('../../config/preVars')
  Object.keys(vars).forEach((e) => {
    isn = isn.replace(new RegExp(e, 'g'), vars[e])
  })

  return isn
}

const nexssFileParser = (content, filename, nxsArgs) => {
  log.dm(bold('➤ Starting parsing .nexss file: ', filename))
  const path = require('path')
  // if (!path.isAbsolute(filename)) {
  //   filename = path.resolve(filename)
  // }

  const { parseArgsStringToArgv } = require('string-argv')
  let lineNumber = 0
  const nexssProgram = preVars(content.toString()).trim().split(/\r?\n/)

  const totalLines = nexssProgram.length
  log.dm(bold('➤ Total Lines: ', totalLines))
  const files = nexssProgram
    .map((line) => {
      const orgLine = line
      line = line.trim() // if there is unnecessary space at the end of line.
      lineNumber++
      log.dm(bold(`➤ Line #${lineNumber}: `, line))
      // Comments ommit
      if (line.startsWith('//') || line.length === 0) {
        return
      }
      // remove inline comments
      if (!line.startsWith('https://')) {
        line = line.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, '')
        line = line.trim()
      }

      // console.log(line);
      // split by space but keep ""
      // let splitter = line.split(/\ (?=(?:(?:[^(("|')]*"){2})*[^("|')]*$)/);
      let splitter = parseArgsStringToArgv(line)

      // console.log(line, line.split(/\ (?=(?:(?:[^"]*"){2})*[^"]*$)/));
      const name = splitter.shift()
      log.dm(bold('➤ Name: ', name))

      // Add parameters added to the .nexss program to the last one.
      // if (totalLines === lineNumber && nxsArgs) {
      //   splitter = splitter.concat(nxsArgs);
      // }
      // Check if some arguments needs to be passed
      // Don't think combining  will all other args will be good in this
      // case.

      //
      const pureArguments = splitter
      let args = minimist(splitter)
      if (args._ && args._.length === 0) {
        delete args._
      } else {
        args.nxsIn = args._
        delete args._
      }

      // We remove unnecessary quotes from the parameters of .nexss files.
      for (const [key, value] of Object.entries(args)) {
        if (!Array.isArray(value)) {
          if (isNaN(value)) {
            args[key] = stripEndQuotes(value)
          }
        } else {
          args[key] = args[key].map((a) => stripEndQuotes(a))
        }
      }

      const lineNxsPlatform = args.nxsPlatform
      if (lineNxsPlatform) {
        const { checkPlatform } = require('../../lib/platform')
        log.dm(bold('➤ Checking platform: ', lineNxsPlatform))
        if (!checkPlatform(lineNxsPlatform)) {
          log.di(`line ommited (platform not match): \n${bold(yellow('LINE'))}: `, orgLine)
          return
        }
      }

      // delete args._;
      // if (nxsArgs) {
      //   // Object.assign(args, nxsArgs); // if actual parameters  pass to all lines
      //   args.nxsArgs = nxsArgs;

      // }
      // check special
      const pathFilename =
        !isSpecialChar(filename) && is('File', filename)
          ? require('path').dirname(filename)
          : filename
      process.NexssFilePath = pathFilename

      // console.log("==========================================================");
      // console.log("name:        ", name);
      // console.log("lineNumber:        ", lineNumber);
      // console.log("filename:        ", filename);
      // console.log("path:        ", pathFilename);
      // console.log("args:        ", args);

      // Install package if not exists..
      if (name) {
        const pname = name.split('/')[0]

        log.dm(bold('➤ Checking package: ', pname))

        // If this is package and is not installed install
        const { package1 } = require('../../config/package')

        try {
          package1.install(pname)
        } catch (error) {
          displayError({ error: error.message, lineNumber, pathFilename, filename, args })
          process.exit(1)
        }

        //= ========================================================

        if (['^', '^^'].includes(startWithSpecialChar(name))) {
          // if command contains -- it will use as nexss programmer parameters eg. nxsAs= etc.
          const indexOfDashDash = splitter.indexOf('--')
          if (indexOfDashDash >= 1) {
            args = splitter.slice(indexOfDashDash + 1)
            splitter = splitter.slice(0, indexOfDashDash)
          }

          return {
            name,
            pureArguments,
            specialArgs: splitter, // This is just command which takes parameters as a raw line.
            lineNumber,
            path: pathFilename,
            filename,
            args,
          }
        }

        const params = {
          name,
          lineNumber,
          filename,
          path: pathFilename,
        }

        const packagePath = fs.existsSync(`${NEXSS_PACKAGES_PATH}/${name}`)
          ? `${NEXSS_PACKAGES_PATH}/${name}`
          : name

        if (nxsArgs.seq && (name === '.' || fs.lstatSync(packagePath).isDirectory(packagePath))) {
          // console.log(name, "Adding seq!!!", nxsArgs.seq);
          params.seq = nxsArgs.seq
        }

        const f = getFiles(params, args, null, null, pureArguments)

        // console.log(f);
        // process.exit(1);

        // When run - .nexss first is look at local folder then remote (eg. packages)

        if (f.name && !startWithSpecialChar(f.name) && !f.name.startsWith('http')) {
          let toCheck = path.isAbsolute(f.name) ? f.name : require('path').join(f.path, f.name)
          if (!require('fs').existsSync(toCheck)) {
            f.path = pathFilename
            toCheck = require('path').join(f.path, f.name)
            if (!require('fs').existsSync(toCheck) && !package1.isAvailable(f.name.split('/')[0])) {
              log.error(
                bold('\nFile does not exist in local and remote folders:\n'),
                bold(yellow(toCheck))
              )
            }
          }
        }

        // console.log("Result:", f);
        // console.log(
        //   "=========================================================="
        // );
        // console.log(f);
        return f
      }
      // console.log(
      //   "NO RESULT."
      // );
    })
    .flat()
  return files
}

function displayError({ error, lineNumber, pathFilename, filename, args }) {
  console.log(`Error: ${bold(error)}`) // lineNumber, pathFilename, filename, args
  console.log(`lineNumber: ${red(bold(lineNumber))}`)
  console.log(`pathFilename: ${pathFilename}`)
  console.log(`filename: ${filename}`)
  console.log(`args: ${require('util').inspect(args, { compact: true })}`)
}

module.exports = nexssFileParser

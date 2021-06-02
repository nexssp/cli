/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const { ddd } = require('@nexssp/dddebug')
const { NEXSS_PACKAGES_PATH } = require('@nexssp/package/src/config/packages-config')

Nexss()

function Nexss() {
  log.dc(bold('∞ Execute Main Thread (start.js)..'))
  const { ensureInstalled } = require('@nexssp/ensure')
  const { is } = require('@nexssp/data')
  let fileOrDirectory = Array.isArray(cliArgs._) && cliArgs._.slice(1).shift()

  if ((!fileOrDirectory && cliArgs._[0] === 'start') || cliArgs._[0] === 's') {
    fileOrDirectory = '.'
  }

  if (fileOrDirectory) {
    if (
      !fs.existsSync(fileOrDirectory) &&
      fs.existsSync(`${NEXSS_PACKAGES_PATH}/${fileOrDirectory}`)
    ) {
      fileOrDirectory = `${NEXSS_PACKAGES_PATH}/${fileOrDirectory}`
    }
    const nexssFileParser = require('./lib/nexssFileParser')
    if (path.extname(fileOrDirectory) === '.nexss') {
      const nexssProgram = fs.readFileSync(fileOrDirectory)
      files = nexssFileParser(nexssProgram, fileOrDirectory, cliArgs)
    } else {
      files = nexssFileParser(fileOrDirectory, fileOrDirectory, cliArgs)
    }
    log.dc(bold('∞ Files prepared use --nxsDryFiles to see them..'))
    if (cliArgs.nxsDryFiles) {
      log.dm(bold('➤ Function enabled: --nxsDryFiles'))
      console.log(JSON.stringify(files, null, 2))
      process.exit(0)
    }
  }

  let nexssConfig

  if (!is('url', fileOrDirectory) && !startWithSpecialChar(fileOrDirectory)) {
    const { config1 } = require('../config/config')

    if (
      !fs.existsSync(fileOrDirectory) &&
      fs.existsSync(`${NEXSS_PACKAGES_PATH}/${fileOrDirectory}`)
    ) {
      fileOrDirectory = `${NEXSS_PACKAGES_PATH}/${fileOrDirectory}`
    }

    if (!fs.existsSync(fileOrDirectory)) {
      console.log(`${fileOrDirectory} has not been found.`)
      process.exitCode = 1
      return
    }

    if (fs.lstatSync(fileOrDirectory).isFile()) {
      const dirname = path.dirname(fileOrDirectory)
      try {
        nexssConfig = config1.load(`${dirname}/_nexss.yml`)
      } catch (error) {}
    } else {
      nexssConfig = config1.load(`${fileOrDirectory}/_nexss.yml`)
    }
  }

  if (!Array.isArray(files)) {
    files = [files]
  }

  // Here we have array of files
  files = files.filter(Boolean)

  const { cache1 } = require('../config/cache')
  cache1.start()

  const cacheFileName = 'myCache.json'
  let nexssResult = []
  const nexssBuild = []

  if (cliArgs.server) {
    // SERVER
    const { startServer } = require('../lib/server')
    if (nexssConfig) {
      startServer(nexssConfig.server, { cwd: PROCESS_CWD })
    } else {
      startServer({}, { cwd: PROCESS_CWD })
    }
  } else if (!cliArgs.nxsLive || !cache1.exists(cacheFileName, '1y')) {
    if (files.length === 0) {
      const fg = require('fast-glob')
      const replaced = fileOrDirectory.replace(/\\/g, '/')
      const files = fg.sync(`${replaced}/**/{_nexss.yml,*.nexss}`)
      for (let f of files) {
        f = f.replace(`${replaced}/`, '')
        const r = /(.+)[\\\/].nexss.yml$/.exec(f)
        if (r && r.length > 0) {
          console.log(r[1], bold('(package)'))
        } else {
          console.log(f.replace(/.nexss$/, bold('.nexss (file)')))
        }
      }
      log.warn('Nothing to run.')
      log.warn(
        "To add files to the project please use 'nexss file add myfile.[language extension]'"
      )
      process.exit()
    }

    // more here: https://github.com/nexssp/cli/wiki/Config
    const startData = {
      debug: (nexssConfig && nexssConfig.debug) || cliArgs.debug,
    }

    if (nexssConfig && nexssConfig.data) {
      // You cannot overwrite below values.
      delete nexssConfig.data.nexss
      // delete nexssConfig.data.cwd; ?? to check
      delete nexssConfig.data.start
      Object.assign(startData, nexssConfig.data)
    }

    const noStdin = cliArgs[nexss[':i']]
    nexssBuild.push({ stream: 'readable', cmd: startData })
    nexssResult.push({ stream: 'readable', cmd: startData })

    const { getCompiler } = require('../nexss-language/lib/compiler')
    const { getBuilder } = require('../nexss-language/lib/builder')

    const {} = require('@nexssp/extend') // replacement below for url.parse is depracated

    for (const file of files) {
      let fileName = file.name

      // log.db(`∘ Preparing ${fileName}..`);

      // Do we need below here??
      if (file.path && fs.existsSync(file.path)) process.chdir(file.path)
      process.nexssCWD = file.path
      process.nexssFilename = path.normalize(fileName)
      // ======================

      if (!file.name) {
        log.error(
          'file needs to have `name` field in the `files` section of the _nexss.yml config file. Please see examples/packages.'
        )
        process.exit()
      }
      if (!noStdin) {
        const transformInParams = {
          stream: 'transformInput',
          cmd: file,
        }

        if (file.args) {
          transformInParams.inputData = file.args
        }

        if (file.data) {
          transformInParams.inputData = file.data
          delete file.data
        }

        nexssResult.push(transformInParams)
      }

      let stream = 'transformNexss'
      const { parseURL } = require('@nexssp/extend/string')
      const parsed = parseURL(fileName)

      if (startWithSpecialChar(file.name) || cliArgs._.length === 0 || !process.argv) {
        delete file.args
        const streamForSpecialChar = getStreamBasedOnSpecialChar(file.name)
        const addHashParams = {
          stream: streamForSpecialChar,
          cmd: file,
        }
        // For now we only adds arguments to ! and !! commands
        // if (["^", "^^"].includes(startWithSpecialChar(file.name))) {
        //   addHashParams.inputData = cleanNexssArgs(process.argv.slice(3));
        // }

        nexssResult.push(addHashParams)

        // const fileArgsHash = file.args;
      } else if (parsed.href) {
        switch (parsed.protocol) {
          case 'http:':
          case 'https:':
            nexssResult.push({
              stream: 'transformRequest',
              cmd: fileName,
              // options: spawnOptions
            })
            break
          default:
            if (parsed.protocol) {
              if (!path.isAbsolute(fileName)) {
                fileName = fileName.substring(parsed.protocol.length + 2)
                if (parsed.protocol === 'file:') {
                  stream = 'transformFile'
                }
              }
            }

            const spawnOptions = {}
            // let spawnOptions =  { detached: true };
            let builder
            const compiler = { ...getCompiler(file) }

            if (cliArgs.nxsBuild) {
              builder = { ...getBuilder(file) }
            }

            if (!builder && Object.keys(compiler).length > 0) {
              if (compiler.args) {
                compiler.args = compiler.args
                  .replace(/<file>/g, fileName)
                  .replace(/<fileNoExt>/g, fileName.split('.').slice(0, -1).join('.'))

                compiler.args = compiler.args.split(' ')
              }

              // We make sure compiler is installed
              compilerAdded = true
              if (compiler.command) {
                // Installation of the compiler
                let compilerInstallOptions = {}

                if (compiler.shell) {
                  compilerInstallOptions = { shell: 'Powershell' }
                }

                compilerInstallOptions.progress = cliArgs.progress

                ensureInstalled(compiler.command, compiler.install, compilerInstallOptions)

                if (
                  (compiler.command === 'bash' || compiler.command === 'wsl') &&
                  process.platform === 'win32'
                ) {
                  // on Windows it's using the WSL (Windows Subsystem Linux)
                  // So we convert the path to from c:\abc to /mnt/c/abc.....
                  const { pathWinToLinux } = require('@nexssp/os')

                  try {
                    if (!Array.isArray(compiler.args)) {
                      compiler.args = pathWinToLinux(compiler.args)
                    } else {
                      compiler.args = compiler.args.map((e) => pathWinToLinux(e))
                    }
                  } catch (error) {
                    console.error('args on the compiler: ', compiler.args)
                  }
                }
              }

              let fileArgs
              if (file.args) {
                fileArgs = file.args
              }

              const cmd = compiler.command || (compiler.args && compiler.args.shift())

              // VALIDATION
              if (file.input) {
                nexssResult.push({
                  stream: 'transformValidation',
                  cmd: `input`,
                  args: file.input,
                })
              }

              if (compiler && compiler.stream) {
                stream = compiler.stream
              }

              nexssResult.push({
                stream,
                // eg. cmd = php
                cmd,
                // args = ["my.php", "args from config", "static args"]
                specialArgs: file.args,
                args: compiler.args,
                data: file.data,
                options: spawnOptions,
                fileName: path.normalize(fileName),
                // inputData: fileArgs,
                cwd: file.path,
                env: file.env ? file.env : null,
              })
            } else {
              const builder = getBuilder(file)

              const exeFile = path.resolve(`_nexss/${path.basename(fileName)}.exe`)

              const builderArgs = builder.args
                .replace(/<file>/g, path.resolve(fileName))
                // .replace(/<destinationPath>/g, dirname(exeFile))
                .replace(/<destinationFile>/g, exeFile)
                .replace(/<destinationDirectory>/g, path.dirname(exeFile))
                .split(' ')

              nexssResult.push({
                stream: 'transformNexss',
                cmd,
                args: builderArgs,
                options: spawnOptions,
                fileName,
              })

              if (cliArgs.verbose) {
                dbg(`Build Command ${cmd} ${builderArgs ? builderArgs.join(' ') : ''}`)
              }
            }

          // Below is for extra transfers from data for each output of the module
        }
      }

      nexssResult.push({
        stream: 'transformOutput',
        cmd: file,
        // options: spawnOptions
      })

      // VALIDATION - OUTPUT
      if (file.output) {
        nexssResult.push({
          stream: 'transformValidation',
          cmd: `output`,
          args: file.output,
        })
      }
    }

    // TEST
    nexssResult.push({
      stream: 'transformTest',
      cmd: `Test`,
    })

    nexssResult.push({
      stream: 'writeableStdout',
      cmd: 'out',
      // options: spawnOptions
    })

    cache1.writeJSON(cacheFileName, nexssResult)
  } else {
    nexssResult = cache1.readJSON(cacheFileName)
  }

  const { run } = require('./lib/pipe')
  // This needs to be changed so only build if is necessary
  // if (nexssBuild.length > 0) {
  //   dy(`Building..`);
  //   run(nexssBuild, {
  //     quiet: !cliArgs.verbose,
  //     build: true
  //   }).catch(e => console.error(e));
  // }
  // console.log(nexssBuild);
  process.chdir(PROCESS_CWD) // TODO: Later to recheck folder changing on getFiles + mess cleanup

  // // Recheck the Serialize (later remove??)
  // nexssResult = json.parse(json.stringify(nexssResult))

  if (cliArgs.nxsBuild) {
    let buildFilename = './build.nexss.json'
    log.db(`option nxsBuild -> building and write to ${buildFilename}`)

    if (typeof cliArgs.nxsBuild !== 'boolean') {
      buildFilename = cliArgs.nxsBuild
      if (cliArgs.nxsBuild.indexOf('.json') <= 0) {
        buildFilename += '.json'
      }
    }
    fs.writeFileSync(buildFilename, JSON.stringify(nexssResult, null, 2))
  }

  // We do not run, just display info
  if (cliArgs.nxsDry) {
    log.dm(bold('➤ Function enabled: --nxsDry'))
    console.log(JSON.stringify(nexssResult, null, 2))
    process.exit(0)
  }

  log.dg('>> Executing..')
  run(nexssResult, { quiet: !cliArgs.verbose }).catch((e) => console.error(e))
}

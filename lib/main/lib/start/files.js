const { stripEndQuotes } = require('@nexssp/extend')
const { isEmpty, is } = require('@nexssp/data')
const _log = require('@nexssp/logdebug')
// array flat / nodejs 10
const loadEnv = (p) => {
  if (!p) {
    p = `./config.env`
  }

  if (fs.existsSync(p)) {
    return require('dotenv').parse(fs.readFileSync(p))
  }
}

const parseName = (name, incl) => {
  const { parseArgsStringToArgv } = require('string-argv')
  const arr = parseArgsStringToArgv(name)
  const result = [] // was {} ??
  if (incl) result.name = arr[0]
  if (arr.length > 1) {
    result.args = arr.slice(1)
  }
  return result
}

const getName = (name) => name && name.split(' ')[0]

function getPath(fileOrFolder) {
  let resultPath
  if (fs.existsSync(fileOrFolder)) {
    resultPath = path.resolve(fileOrFolder)
    if (
      !(process.nxsErrors && process.nxsErrors[fileOrFolder]) &&
      fileOrFolder !== '.' &&
      fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`)
    ) {
      if (process.cwd() !== process.env.NEXSS_PACKAGES_PATH) {
        _log.dy(
          bold(
            `Warning: You have folder on your project: ${fileOrFolder}. 
There is also Nexss Programmer package name called with the same. 
If this is overwrite of standard Nexss Programmer 
package then it is ok, otherwise use different name.`
          )
        )
      }

      resultPath = `${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`

      // if (!process.nxsErrors) process.nxsErrors = {}
      // process.nxsErrors[fileOrFolder] = true
    }
  } else if (fs.existsSync(`${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`)) {
    resultPath = `${process.env.NEXSS_PACKAGES_PATH}/${fileOrFolder}`
  }
  return resultPath
}

// Move later to separate file, The same is in the nexssFileParser.js

function fdebug(...args) {
  _log.dc('==> getFiles', ...args)
}

function fdebug2(...args) {
  _log.dy('==> getFiles', ...args)
}

function fdebug3(...args) {
  _log.dm('==> mapFiles', ...args)
}

const getFiles = (folder, args, env, ccc) => {
  fdebug('Starting..')
  const assert = require('assert')
  assert(folder, 'missing path')
  const command = folder.name

  fdebug('command (folder.name): ', command)

  if (folder.name.startsWith('//')) {
    return
  }
  const cwd = path.resolve(process.cwd())
  fdebug('cwd (resolve(process.cwd())): ', cwd)

  let ArgsParsed = parseName(folder.name).args
  if (ArgsParsed) {
    ArgsParsed = require('minimist')(ArgsParsed) // convert to object
  }

  fdebug('ArgsParsed: ', ArgsParsed)

  if (ArgsParsed) {
    for (const [key, value] of Object.entries(ArgsParsed)) {
      if (!Array.isArray(value)) {
        if (isNaN(value)) {
          ArgsParsed[key] = stripEndQuotes(value)
        }
      } else {
        ArgsParsed[key] = ArgsParsed[key].map((a) => stripEndQuotes(a))
      }
    }
  }

  if (!args) {
    args = ArgsParsed
  } else {
    Object.assign(args, ArgsParsed)
  }

  fdebug('args: ', args)

  if (!isEmpty(args)) {
    fdebug('args not empty (cleaning up): ', ArgsParsed)
    if (args._ && args._.length === 0) {
      delete args._
    } else if (!args.nxsIn || args._) {
      if (args._) args.nxsIn = args._
      delete args._
    }

    if (Object.keys(args).length === 0) {
      // TODO: This needs to be checked in the refactoring stage. for now this "wonderful"
      args = []
    }
  }

  if (is('url', folder.name)) {
    fdebug('folder.name is URL!: ', folder.name, folder)
    if (folder.name.startsWith('http')) {
      return folder
    }
  }

  let folderAbsolute = getPath(getName(folder.name))

  fdebug(`folder absolute: ${folderAbsolute} from:`, folder.name)

  // Each package can have platform dependent code. For example
  // IF in the Id package is folder Linux, it will be run instead of main
  // You can use symlinks to make it more DRY
  if (folderAbsolute) {
    const platformDependedPath = path.join(folderAbsolute, process.platform)

    fdebug(`Check for platfrom depended path:`, platformDependedPath)

    if (fs.existsSync(platformDependedPath)) {
      folderAbsolute = platformDependedPath
      fdebug(`platform depended found.`)
    } else {
      fdebug(`platform depended not found.`)
    }
  }

  fdebug(`Next Stage: 1`)

  if (!folderAbsolute && !startWithSpecialChar(folder.name)) {
    if (!folder.filename) {
      fdebug(`Its a folder we return a:`, folder)
      // TODO: Maybe later to add here extra/special functions like:
      // nexss $#abc, then folder.name = $#abc
      // see --update function (/lib/core/update.js)
      return folder
    }
    folderAbsolute = path.resolve(folder.filename)
    fdebug(
      `folder Absolute and foldernmame not starting with special char. NEW folder absolute: `,
      folderAbsolute
    )
    // console.log("RESOLVED!!!", folderAbsolute);
  }
  fdebug2(`Next Stage: 2`)
  // console.log("folder absolute========================", folderAbsolute);

  // const currentFolder = path.dirname(folder.filename);
  // process.chdir(folder.path);

  // console.log(`CF: ${process.cwd()}, folder abs: ${folderAbsolute}`);
  // .nexss language
  if (!startWithSpecialChar(folder.name) && !fs.existsSync(folderAbsolute)) {
    console.error(
      `${red('Error: ')} There is an error on file ${bold(
        folder.filename.replace('.\\', '')
      )} line: ${folder.lineNumber} ${bold(folder.name)} does not exist.`
    )

    process.exit(0)
  }

  fdebug(`Next Stage: 3`)

  // This is $# commands
  if (startWithSpecialChar(folder.name)) {
    fdebug(`Start with Special Char`, folder.name)
    folder.args = args
    // folder.env = env;
    return folder
  }

  fdebug(`Next Stage: 4`)

  if (fs.lstatSync(folderAbsolute).isFile()) {
    fdebug(`${folderAbsolute} is a file.`)
    const res = Object.assign(folder, parseName(folder.name, true))
    res.path = cwd
    if (env) {
      res.env = env
    } else {
      const loaded = loadEnv()
      if (loaded) {
        res.env = loaded
      }
    }
    res.commmand = folderAbsolute
    return res
  }

  // console.log("folderAbsolute:", folderAbsolute);
  fdebug('Changing folder: ', folderAbsolute)
  process.chdir(folderAbsolute)
  const { config1 } = require('../../../config/config')
  fdebug('Loading config: ', `${folderAbsolute}/_nexss.yml`)
  const config = config1.load(`${folderAbsolute}/_nexss.yml`)

  const envLoaded = loadEnv()
  if (envLoaded) {
    fdebug('envLoaded.')
    env = envLoaded
  }
  let config_files
  if (!config) {
    fdebug(`Config does not exist.`)
    log.dy(
      `No config file in ${path.normalize(
        folderAbsolute
      )} searching for the index.nexss OR start.nexss `
    )
    // if there is one file and it is called index

    const startFile = fs
      .readdirSync(folderAbsolute)
      .filter((startFile) => startFile === 'index.nexss' || startFile === 'start.nexss')
    if (startFile) {
      config_files = [{ name: startFile[0] }]
    } else {
      log.error('No config file in the searching for index.nexss ', path.normalize(folderAbsolute))
      process.exit(1)
    }
  } else {
    fdebug(`Getting sequence:`, folder)
    config_files = require('./sequence').getSequence(folder.seq, config)
  }
  let counter = config_files ? config_files.length : 0

  if (!Array.isArray(config_files)) {
    console.error(
      `${
        bold(`You need to have files: or 'default' sequence to run project.`) + bold('\nfiles')
      } needs to be an array. \nMaybe you need to add ${red(
        '-'
      )} at the front of the name in the _nexss.yml config file eg.\n${green(
        bold('files:\n  - name: myfile.js')
      )}${blue(`\nmore here: ${bold('https://github.com/nexssp/cli/wiki/Config')}`)}`
    )
    process.exit(0)
  }

  fdebug2(`Generating files...`)

  const resultFiles =
    config_files &&
    config_files.map((file) => {
      if (!file.name) {
        fdebug3('file.name empty returning []')
        return []
      }

      // URL Address
      if (file.name.startsWith('http')) {
        fdebug3('file.name starts with http')
        const { name } = file
        const split = file.name.trim().split(' ')
        file.name = split.shift()
        if (split.length > 0) {
          file.args = split
        }
        return file
      }

      const fileCWD = process.cwd()
      const ppp = getPath(getName(file.name))

      fdebug3({ fileCWD, ppp })
      fdebug3(`ppp=getPath(getName(file.name)) from: `, file.name)

      if (!ppp) {
        if (!file.name) {
          console.error(`'name' parameter not found in`, file)
          process.exit()
        }
        const folder = path.normalize(path.join(fileCWD, getName(file.name)))

        const { package1 } = require('../../../config/package')
        const pkgName = file.name.split(/[\/\\]/)[0]
        if (package1.isAvailable(pkgName)) {
          package1.install(pkgName)
        } else {
          console.error(`${bold(folder)} does not exist.`, file)
          process.exit(1)
        }
      }

      // Later to do recursive here?
      // if (path.extname(ppp) === '.nexss') {
      //   console.log('Nexss file, should we do recursive here?')
      // }

      fdebug3(`${ppp}: is a directory?`)
      // This is a directory
      if (fs.lstatSync(ppp).isDirectory()) {
        fdebug3(`Yes so we are changing there: ${ppp}`)

        process.chdir(ppp)

        const subConfig = config1.load(`${ppp}/_nexss.yml`)
        // console.log("config:", config);
        const envLoaded = loadEnv()
        if (envLoaded) {
          env = envLoaded
        }
        process.chdir(fileCWD)
        const xxxx = getFiles(file, file.data, env, subConfig)
        return xxxx
      }
      // } else {
      // We add input from the module at start of queue of this module
      if (config && counter-- === config_files.length) {
        if (config.input) {
          file.input = config.input
        }
      }

      // We add output from the module at end of queue of this module
      if (config && counter === 0) {
        if (config.output) {
          file.output = config.output
        }
      }

      if (config && config.errors) {
        file.errors = config.errors
      }

      file.path = process.cwd()
      if (ccc && ccc.data && file.data) {
        // console.log("file.data, ccc.data", file.data, ccc.data);
        Object.assign(file.data, ccc.data)
      }

      if (config && config.data) {
        if (Array.isArray(config.data)) {
          console.error(
            `config.data is an Array. Do not use array for 'data' section in config file.`
          )
          const errorConfig = JSON.stringify(config, null, 2)
          console.error(errorConfig.replace(/\"data\"\:/, bold('"data:"')))
          console.error(
            bold(
              `Example of the correct config file here: https://github.com/nexssp/cli/wiki/Config`
            )
          )
          process.exit(0)
        }
        // console.log("file.data, config.data", file.data, config.data);

        file.data = Object.assign(file.data || {}, config.data)
      }
      if (ccc && ccc.debug) file.debug = ccc.debug

      const arr = parseName(file.name)

      if (counter == 0) {
        // params from package only of first submodule,file as they are passed.

        file = Object.assign(file, { args })
      }

      if (Object.keys(arr).length > 0) {
        file.name = file.name.split(' ')[0]
        if (file.args) {
          try {
            file.args = file.args.concat(arr.args)
          } catch (e) {
            log.error(
              'There is an error in concatenation of file arguments. (nexss-start/lib/start/files.js)'
            )
            console.error('file.args is not an Array!')
            console.error('file.args', file.args, 'arr.args', arr.args)
            process.exit(1)
          }
        } else {
          file.args = arr.args
        }
        const unique = new Set(file.args)
        file.args = [...unique]
      }

      if (env) {
        file.env = env
      }
      // ?????? process.chdir(cwd);
      // console.log(file);
      file.command = command !== '.' ? command : file.name
      return file
      // }
    })

  process.chdir(cwd)

  return resultFiles && resultFiles.flat()
}

module.exports = { getFiles }

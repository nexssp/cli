/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

async function run(operations, options = {}) {
  if (cliArgs.nxsTime) {
    process.nxsTime = process.hrtime()
  }

  process.nxsOut = cliArgs.nxsOut
  delete cliArgs.nxsOut

  const { pipeline } = require('stream')
  // Below must be like that! for EVAL

  const util = require('util')

  // Below is for relative dirs in the .nexss files
  // This will need to be changed to the distributed systems
  console.time(bold(cyan('Nexss P'), bold('rogrammer')))

  const finalOperations = operations.map((element, index) => {
    const { transformNexss } = require('./transformNexss')
    const { transformFile } = require('./transformFile')
    const { writeableStdout } = require('./writeableStdout')
    const { transformTest } = require('./transformTest')
    const { transformValidation } = require('./transformValidation')
    const { transformInput } = require('./transformInput')
    const { transformOutput } = require('./transformOutput')
    const { transformHash } = require('./transformHash')
    const { transformRequest } = require('./transformRequest')
    const { readable } = require('./readable')
    const { cleanup } = require('./output/nxsOutputParams')
    // We get last index of transformOutput as some parameters
    // passed in the commandline directly only should be applied in the
    // last transform output eg. nxsFields, nxsField etc.
    let lastIndex
    for (let x = 0; x < operations.length; x++) {
      if (operations[x].stream == 'transformOutput') {
        lastIndex = x
      }
    }
    const streamName = element.stream || 'transformNexss'
    let args = element.args || []

    // Arguments from command line on run
    let paramsNumber = 4
    if (process.argv[2] !== 's' && process.argv[2] !== 'start') {
      paramsNumber = 3
    }

    if (!options.nxsBuild) {
      let terminalParams = process.argv.slice(paramsNumber)
      // We filter transformOutput params passed from terminal
      // This needs to be done as some packages are built from
      // many modules and transform output streams are used also there.
      if (index != lastIndex) {
        terminalParams = cleanup(terminalParams)
      }

      args = args.concat(terminalParams)
    }
    // We add ' to attributes which contains code to execute
    const sign = process.platform === 'win32' ? `"` : `'`
    args = args.map((e) =>
      e.includes && e.includes('${') && !e.startsWith("'") && !e.startsWith('--')
        ? `${sign}${e}${sign}`
        : e
    )

    // We cannot pass sequences throug terminal??
    args = args.filter((e) => !e.startsWith || !e.startsWith('--seq'))

    const runOptions = {
      ...options,
      fileName: element.fileName,
      cwd: element.cwd,
    }

    runOptions.inputData = element.inputData

    if (element.data) {
      if (runOptions.inputData) {
        Object.assign(runOptions.inputData, element.data)
      } else {
        runOptions.inputData = element.data
      }
    }
    runOptions.env = { ...process.env, ...element.env }

    if (element.cmd) {
      return eval(streamName)(element.cmd, args, runOptions)
    }
    return eval(element)(runOptions)
  })
  const { PassThrough, Readable } = require('stream')

  // Below are 2 versions for of look and Async Pipeline

  const nxsPool = {}
  if (1) {
    let nPipe
    // We get Readable Stream
    nPipe = finalOperations.shift()

    // nPipe = process.openStdin();
    const EventEmitter = require('events')
    const EE = new EventEmitter()
    EE.on('go', (e) => console.log('==============================', e))
    // log.di(`nPipe-stdin open`);
    let previousFrom = ''
    try {
      for (const pipe of finalOperations) {
        // log.di(`nPipe-stdin :pipe`, Object.keys(pipe));
        // if (process.NEXSS_WAIT) {
        // }
        if (nPipe && pipe) {
          nPipe = nPipe.pipe && nPipe.pipe(pipe)
        }

        if (cliArgs.nxsDebugJSON) {
          const PTrough = new PassThrough({ objectMode: true })
          PTrough.on('data', (streamData) => {
            try {
              const x = JSON.parse(streamData)
            } catch (e) {
              console.log(`NOT A JSON:`, streamData)
              if (typeof streamData === 'object') {
                console.log(`BUT AN OBJECT.`)
              }
            }
          })
        }

        // if (nPipe instanceof Readable) {
        //   let PTrough = new PassThrough({ objectMode: true });
        //   PTrough.on("data", (x) => {
        //     if (x.from) {
        //       console.log(`QQQQQQQ` + x.from + ` EXISTS!!!!`, x.data);
        //     }
        //   });
        //   nPipe.pipe(PTrough);
        // }

        if (cliArgs.nxsDebugData && nPipe instanceof Readable) {
          const PTrough2 = new PassThrough({ objectMode: true })
          PTrough2.on('data', (x) => {
            // First: don't display doubles (like cancel stream.)
            if (x.from !== previousFrom) {
              // Second: search by name of the stream data comes from.
              if (
                ~x.from.indexOf(
                  typeof cliArgs.nxsDebugData !== 'boolean' ? cliArgs.nxsDebugData : ''
                )
              )
                EE.emit('go', x)
            }
            previousFrom = x.from
          })
          nPipe.pipe(PTrough2)
        }

        // nPipe = PTrough;
        if (nPipe) {
          pipe.on('error', (e) => console.log(bold(cyan('Nexss P'), bold('rogrammer')), e))
          // DebugData.pipe(nPipe);
        }

        //  nPipe.pipe(DebugData, { end: false });
      }
    } catch (ex) {
      console.log(`Error in PIPE: pipe.js`, ex)
    }

    if (nPipe && nPipe.on) {
      nPipe.on('finish', (e) => {
        if (cliArgs.debug) {
          process.stdout.write('\n')
          console.timeEnd(bold(cyan('Nexss P'), bold('rogrammer')))
        }
      })
    }
  } else {
    const pipelineAsync = util.promisify(pipeline)
    await pipelineAsync(
      // process.stdin,
      ...finalOperations
    )
      .then((e) => {
        if (cliArgs.debug) {
          process.stdout.write('\n')
        }
        if (cliArgs.nxsTime || cliArgs.debug) {
          console.timeEnd(bold(cyan('Nexss P'), bold('rogrammer')))
        }
      })
      .catch((err) => {
        // This is handled by nexss transform as all errors are parsed
        // based on language - this can be used maybe to better debug ?
        console.error(bold(cyan('Nexss P'), bold('rogrammer')), err)
        // console.error("Nexss last error: ", process.cwd());
        process.exitCode = 1
      })
  }
}

module.exports.run = run

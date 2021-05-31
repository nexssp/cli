global.log = require('@nexssp/logdebug')
Object.assign(global, require('@nexssp/ansi'))

const { worker } = require('../../src/main/lib/worker')

let chunk // data to passs

let options // spawn
const startStreamTime = true // eg process.hrtime()

let streamCache // if you want to stream cache

let callback

const cmd = 'node' // eg node
const filename = 'workA.js' // eg abc.js
const argsStrings = [filename]
worker({ cmd, filename, callback, argsStrings, startStreamTime })

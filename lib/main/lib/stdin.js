/**
 * Copyright 2018-2021 Nexss.com. All rights reserved.
 * This source code is governed by a License which can be found in the LICENSE file.
 */

const { readFileSync } = require('fs')

module.exports.win32 = () => {
  if (!process.stdin.isTTY && process.stdin.readable) {
    try {
      const data = readFileSync(0, 'utf8')
      return data || ''
    } catch (error) {
      console.error(`STDIN Error: ${error}`)
      return ''
    }
  } else {
    // If stdin is not available or is a TTY without input
    return ''
  }
}

module.exports.linux = () => {
  if (process.platform !== 'win32') {
    if (process.stdin.isTTY) {
      return ''
    }
    // Linux fix
    process.stdin.resume()
  }
  const chunks = []
  try {
    do {
      var chunk
      if (process.platform !== 'win32') {
        chunk = readFileSync('/dev/stdin').toString()
      } else {
        chunk = readFileSync(0, 'utf8').toString()
      }
      chunks.push(chunk)
    } while (chunk.length)
  } catch (error) {
    // console.error(`STDIN Error: ${error}`);
    // console.trace();
    if (process.platform !== 'win32') {
      process.stdin.destroy()
    }
  }

  return chunks.join('')
}

/*
 * Title: Nexss FUNCTIONS - fs
 * Description: Nexss helper functions for filesystem.
 * Author: Marcin Polak
 * 2018/10/01 initial version
 */
const fs = require('fs')

const findParent = async (item) => {
  const { stat } = require('fs/promises')
  const { resolve, join, dirname, parse } = require('path')

  const f = async (i) => {
    try {
      const stats = await stat(i)
      if (stats.isFile()) {
        return i
      }
    } catch (error) {
      // console.log(error);
    }

    const parent = dirname(resolve('..', i))
    // console.log(parent);
    if (parse(parent).root === parent) {
      return null
    }
    return await f(join('..', i))
  }

  return await f(item)
}

const getFiles = (source) => {
  const { join } = require('path')
  return fs.readdirSync(source).filter((name) => !fs.lstatSync(join(source, name)).isDirectory())
}

const myReadFileSync = (...args) => fs.readFileSync(...args)

function accessible(file) {
  if (!file) return false

  try {
    fs.accessSync(file)
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  myReadFileSync,
  findParent,
  getFiles,
}

const { pack } = require('@nexssp/packunpack')
const minimist = require('minimist')

const program = 'nexss'
const example = `${program} myfile.ext myfolder myarchive.tar.gz`
module.exports = () => {
  const opts = {}
  const what = process.argv.slice(3)
  if (what.length < 1) {
    console.error(`Enter parameters eg: ${example}`)
  }
  // Default archiveName is the first folder/file name passed to pack + tar.gz
  // else if (what.length < 2) {
  //   console.error(`Last parameter is the archive name for example: ${example}`);
  // }

  if (!what) {
    console.error(example)
    return
  }

  const params = minimist(what)
  if (params.force) {
    opts.force = true
  }
  const archiveName = params._.pop()
  let result
  try {
    result = pack(params._, archiveName, opts)
  } catch (e) {
    console.log(`${bold('nexss')}: `, red(e.message))
    process.exit(1)
  }

  if (params.json) {
    console.log(JSON.stringify(result))
  } else {
    console.log(JSON.stringify({ sizeMB: result.sizeMB, file: archiveName }))
  }
}

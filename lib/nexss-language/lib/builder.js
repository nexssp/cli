const fs = require('fs')
const path = require('path')
const { ensureInstalled } = require('@nexssp/ensure')

module.exports.getBuilder = (file) => {
  const { language1 } = require('../../config/language')
  language1.start()

  const fileName = file.name

  const languageDefinition = language1.byFilename(fileName)

  let builder
  if (languageDefinition) {
    builder = languageDefinition.builders[Object.keys(languageDefinition.builders)[0]]
  }
  if (!builder) return
  if (!fs.existsSync(`_nexss`)) {
    try {
      fs.mkdirSync(`_nexss`, { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') throw err
    }
  }
  try {
    if (typeof builder.build === 'function') {
      cmd = builder.build()
    } else if (typeof eval(`(${builder.build})`) === 'function') {
      // During cache we need to eval to get that is function.
      cmd = eval(`(${builder.build})`)()
    } else {
      cmd = builder.build
    }
  } catch (error) {
    cmd = builder.build
  }

  if (!cmd) cmd = builder.cmd
  ensureInstalled(cmd, builder.install, {
    progress: cliArgs.progress,
  })

  return builder
}

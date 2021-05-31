const cache = require('@nexssp/cache')

const cache1 = cache({
  bucket: 'languages',
  recreateCache: process.argv.includes('--nocache'),
  auto: true, // It will create directory if does not exist.
})

module.exports = { cache1 }

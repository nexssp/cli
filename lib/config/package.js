const { cache1 } = require('./cache')
const package = require('@nexssp/package')

const package1 = package({ cache: cache1, repos: require('./package-repos.json') })

module.exports = { package1 }

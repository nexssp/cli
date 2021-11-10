const nexssConfig = require('../../lib/config').loadConfigContent()

let projectPath
if (nexssConfig) {
  delete require.cache[require.resolve('../../config/config')]
  const { NEXSS_PROJECT_PATH } = require('../../config/config')

  projectPath = path.resolve(NEXSS_PROJECT_PATH)
  const envConfigPath = projectPath ? `${projectPath}/config.env` : `./config.env`

  dotenv.config({ path: envConfigPath })
}

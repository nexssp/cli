module.exports.note = (...args) => {
  const isLearningMode = cliArgs.nxsLearning
  if (isLearningMode) {
    console.error(`Learning note:`, ...args)
  }
}

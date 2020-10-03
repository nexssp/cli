module.exports.note = (...args) => {
  const isLearningMode = process.argv.indexOf("--nxsLearning") >= 0;
  if (isLearningMode) {
    console.error(`Learning note:`, ...args);
  }
};

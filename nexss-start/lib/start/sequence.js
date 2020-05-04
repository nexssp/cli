// SEQUENCES
// more: https://github.com/nexssp/cli/wiki/Sequences

const getSequence = (seqName, nexssConfig) => {
  if (!seqName) {
    return nexssConfig.files || nexssConfig.sequences["default"];
  }

  if (!nexssConfig) {
    error(
      "You can use 'sequences' ONLY in the Nexss Programmer Project. Create new project in the current folder by 'nexss project new .'"
    );
    process.exit();
  }

  if (!nexssConfig.sequences) {
    error(
      `There is no 'sequences' section in the _nexss.yml file: ${nexssConfig.filePath}
more: https://github.com/nexssp/cli/wiki/Sequences`
    );
    process.exit();
  }

  if (!nexssConfig.sequences[seqName]) {
    error(`${seqName} sequence does not exist in the _nexss.yml`);
    process.exit();
  } else {
    return nexssConfig.sequences[seqName];
  }
};

module.exports = { getSequence };
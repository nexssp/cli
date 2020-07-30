// SEQUENCES
// more: https://github.com/nexssp/cli/wiki/Sequences
const { error } = require("../../../lib/log");
const { bold } = require("../../../lib/color");
const getSequence = (seqName, nexssConfig, passedData) => {
  if (!seqName) {
    return (
      nexssConfig.files ||
      (nexssConfig.sequences ? nexssConfig.sequences["default"] : null)
    );
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

  const foundSequence = searchSequence(seqName, nexssConfig.sequences);

  seqName = foundSequence && foundSequence.seq;
  // console.log("FOUND SEQNAME: ", foundSequence);
  if (!nexssConfig.sequences[seqName]) {
    error(`${seqName} sequence does not exist in the _nexss.yml`);
    error(`searchSequence: ${foundSequence}`);
    console.log("PATH: ", bold(nexssConfig.filePath));
    if (nexssConfig.sequences) {
      console.log("Sequences: ");
      // When the server is running we do not display terminal colors, formatting etc
      if (process.argv.includes("--htmlOutput")) {
        console.log(nexssConfig.sequences);
      } else {
        console.log(
          require("util").inspect(nexssConfig.sequences, true, 4, true)
        );
      }
    }
    process.exit();
  } else {
    const seqBody = nexssConfig.sequences[seqName];

    if (seqBody.seq) {
      return getSequence(seqBody.seq, nexssConfig, foundSequence.data);
    }
    if (!seqBody[0].data) {
      seqBody[0].data = foundSequence.data || passedData;
    } else {
      Object.assign(seqBody[0].data, foundSequence.data, passedData);
    }
    return seqBody;
  }
};

// search for regular expressions
const searchSequence = (seqFrom, sequences) => {
  // We return sequence if exact name exists
  if (sequences[seqFrom]) {
    return { seq: seqFrom };
  }
  // Sequence as Regular expressions.
  // Capturing and Named groups available
  let data = {};
  for (regExpSequence of Object.keys(sequences)) {
    let r = new RegExp(regExpSequence, "ig");

    const matches = (seqFrom + "").matchAll(r);
    const ArrayMatch = Array.from(matches);

    if (ArrayMatch && ArrayMatch[0]) {
      if (ArrayMatch[0].groups) {
        // NAMED GROUP
        Object.keys(ArrayMatch[0].groups).forEach((e) => {
          data[e] = ArrayMatch[0].groups[e];
        });

        return { seq: regExpSequence, data };
      } else if (ArrayMatch[0].length > 1) {
        // CAPTURING GROUP
        let no = 0;
        for (match of ArrayMatch[0]) {
          data[`nxsParam_${no}`] = match;
          no++;
        }
        return {
          seq: regExpSequence,
          data,
        };
      } else {
        return {
          seq: regExpSequence,
        };
      }
    }
  }
};

module.exports = { getSequence };

const { getFiles } = require("./start/files");
const minimist = require("minimist");
const nexssFileParser = (content, filename, nxsArgs) => {
  let lineNumber = 0;
  const nexssProgram = content
    .toString()
    .trim()
    .split(/\r?\n/);
  const totalLines = nexssProgram.length;

  const files = nexssProgram
    .map(line => {
      line = line.trim(); // if there is unnecessary space at the end of line.
      lineNumber++;
      let splitter = line.split(" ");
      const name = splitter.shift();
      // Add parameters added to the .nexss program to the last one.
      if (totalLines === lineNumber && nxsArgs) {
        splitter = splitter.concat(nxsArgs);
      }

      // Check if some arguments needs to be passed
      // Don't think combining  will all other args will be good in this
      // case.

      let args = minimist(splitter);
      if (nxsArgs) {
        args.nxsArgs = nxsArgs;
      }

      if (name)
        return getFiles(
          {
            name,
            lineNumber,
            filename,
            path: require("path").dirname(filename)
          },
          args
        );
    })

    .flat();

  return files;
};

module.exports = nexssFileParser;

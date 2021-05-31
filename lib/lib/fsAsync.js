const fs = require('fs');

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

const file = '';
const filePath = path.resolve(process.cwd(), file);

/**
 * Check if a given file path is a directory or not.
 * @param {string} filePath The path to a file to check.
 * @returns {Promise<boolean>} `true` if the given path is a directory.
 */
async function isDirectory(pathTo) {
  try {
    return (await stat(pathTo)).isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      return false;
    }
    throw error;
  }
}

async function test() {
  if (await isDirectory(pathTo)) {
    log.error('It is a directory: %s', pathTo);
    return false;
  }

  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, output);
  } catch (ex) {
    log.error('Make folder:\n%s', ex);
    return false;
  }
}

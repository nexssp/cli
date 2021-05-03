const f = process.argv[2];
const functionsFolder = `./-functions/${f}.js`;
if (fs.existsSync(path.resolve(__dirname, functionsFolder))) {
  log.db(`Loading core${f} function, ${functionsFolder}`);
  const functionRun = require(functionsFolder);
  functionRun();
  process.exit(1);
}

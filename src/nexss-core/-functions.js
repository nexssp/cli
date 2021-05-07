const f = process.argv[2];
const functionsFolder = require("path").normalize(
  `${__dirname}/-functions/${f}.js`
);

if (fs.existsSync(path.resolve(functionsFolder))) {
  log.db(`Loading core${f} function, ${functionsFolder}`);
  const functionRun = require(functionsFolder);
  functionRun();
  process.exit(0);
}

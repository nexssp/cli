module.exports.getBuilder = async file => {
  // TODO: to implement more builders, now is taken first
  const languageInfo = await module.exports.getLangByFilename(file);

  let firstBuilder, installFirstBuilder;
  try {
    firstBuilder = languageInfo.getFirst("builders");
    installFirstBuilder = firstBuilder.install;
    const os = require(`./os/${process.platform}`);
    d(`Making sure ${builderName} is installed.`);
    os.ensureInstalled(builderName, installFirstBuilder);
    d(`Got builder ${firstBuilder}`);
  } catch (er) {
    d(red(`Error on getting builder.. ${er}`));
  }

  return firstBuilder;
};

const nexssBuildPath = buildFilePath;
const getExeFile = f => {
  return path.join(nexssBuildPath, `${f}.exe`);
};

module.exports.build = async file => {
  let builder = await module.exports.getBuilder(file);

  if (!builder) {
    d(
      red(
        `Can't compile ${file} as there is no builders.[builder].build specified in the language config.`
      )
    );
    process.exit();
  } else {
    if (typeof builder.build === "function") {
      builder.build = builder.build();
    }
    d(green(`Selected builder: ${builder.build}`));
  }

  if (!(await promisify(fs.exists)(nexssBuildPath))) {
    d(`${nexssBuildPath} does not exist. Creating..`);
    await promisify(fs.mkdir)(nexssBuildPath);
  }

  const exeFile = getExeFile(file);

  let operation = builder.build
    .replace(/<file>/g, file)
    //.replace(/<destinationPath>/g, dirname(exeFile))
    .replace(/<destinationFile>/g, exeFile);
  d(
    `first builder ${inspect(operation)} (${red(
      "to fix - allow for configuration of build per file"
    )})`
  );
  // Set for scripts to build with custom scripts. (eg CPP)
  process.env["NEXSS_BUILD_PATH_FILE"] = exeFile;
  d(green(`Build filepath: ${exeFile}`));

  if (!nexssConfig.rebuildFlag()) {
    if (!(await promisify(fs.exists)(exeFile))) {
      d(yellow(`Exe file does not exist. Building..`));
      compress = true;
    } else {
      d("Exe file exists. checking changes..");
      // has file changed after last built?
      if (
        nexssCache.getFileUpdatedDate(exeFile) <
        nexssCache.getFileUpdatedDate(file)
      ) {
        d(yellow(`There was changes of the sources. Recompiling..`));
      } else {
        d(green(`File is compiled and up to date. Executing ${exeFile}`));
        builder.exeFile = exeFile;
        //args.shift();
        return builder;
      }
    }
  } else {
    d(`--rebuild flag enabled. Rebuilding..`);
  }

  try {
    d(`starting building`);
    builder.args = builder.args
      .replace(/<file>/g, file)
      .replace(/<destinationFile>/g, exeFile);

    d(green(`Execute: ${`${operation} ${builder.args}`}`));

    await promisify(exec)(`${operation} ${builder.args}`).catch(e =>
      console.error(e)
    );

    d(yellow(`build completed..`));
  } catch (error) {
    console.log(error);
    process.exit();
  }

  return builder;
};

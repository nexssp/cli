const 

module.exports.getCompiler = filename => {
  const ext = path.extname(filename);
  const langInfo = getLang(ext);
  if (langInfo) {
    return langInfo.getFirst("compilers");
    const firstCompiler = langInfo.getFirst("compilers");

    return { compile: firstCompiler.compile };
    console.log(firstCompiler);
    process.exit(1);
    installfirstCompiler = firstCompiler.install;

    if (langInfo.customCompiler && langInfo.customCompiler[process.platform]) {
      const customCompiler = langInfo.customCompiler[process.platform];
      d(`nexss-languages.js checking custom compiler ${customCompiler}`);
      const customCompilerPath = path.join(
        nexssConfig.getSourceFilePath(),
        customCompiler
      );
      //console.warn(nexssConfig.getSourceFilePath());

      if (fs.existsSync(customCompilerPath)) {
        d(
          green(
            `[OK]custom compiler exists in the project folder ${customCompilerPath}`
          )
        );
        return customCompilerPath;
      } else {
        const langFolder = path.dirname(langInfo.configFile);
        const compilerLanguageFolder = path.join(langFolder, customCompiler);
        if (fs.existsSync(compilerLanguageFolder)) {
          d(
            green(
              `[OK] custom compiler exists in the nexss language folder. ${compilerLanguageFolder}`
            )
          );
          return compilerLanguageFolder;
        } else {
          d(
            yellow(
              `[WARN] custom compiler is set however does not exists. using standard compiler ${langInfo.compiler}`
            )
          );
        }
      }
    }
    return langInfo.compiler;
  } else {
    warn(`File type ${bold(ext)} is not handled yet. File: ${bold(name)}.`);
    process.exit(1);
  }
};

module.exports.parseCompilerOutput = (result, compilerExe, filename) => {
  // for vbs and whf we need to remove 3 first lines as it can be parsed.
  let r = result;
  if (compilerExe === "WScript.exe" || compilerExe === "cscript") {
    r = r.split("{");
    r.shift();
    if (Array.isArray(r) && r.length > 0) {
      r = "{" + r.join("{");
    } else {
      r = r.join("");
    }
  }
  return r;
};

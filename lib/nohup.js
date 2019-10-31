// function from
var fs = require("fs"),
  exec = require("child_process").exec,
  isWin = process.platform.indexOf("win") === 0;

function nohup(cmd, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  if (isWin) {
    var cmdEscape = cmd.replace(/"/g, '""'),
      file = ".nohup.cmd.vbs",
      script = "";
    script += "Dim shell\n";
    script += 'Set shell=Wscript.CreateObject("WScript.Shell")\n';
    script += 'shell.Run "cmd.exe /c start /b ' + cmdEscape + '", 0, TRUE';
    fs.writeFileSync(file, script);
    exec('cscript.exe /nologo "' + file + '"', options, function() {
      fs.unlinkSync(file);
      if (callback) callback();
    });
  } else {
    exec("nohup " + cmd + " > /dev/null 2>&1 &", options, callback);
  }
}

module.exports.nohup = nohup;

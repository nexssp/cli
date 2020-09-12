const { execSync } = require("child_process");

try {
  const r = execSync(`nexss Nexss/Test/Errors --file=any.jpg --nxsPipeErrors`, {
    shell: true,
  }).toString();
  return r;
} catch (er) {
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!", er, "zzzzzzzzzzzzzzzzzzzz");

  process.exitCode = 1;
}

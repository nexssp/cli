var request = require("request");

// https://github.com/api/v2/json/repos/show/nexssp
// https://api.github.com/users/nexssp

options = {
  url:
    "https://api.github.com/users/nexssp/repos?q=language_+in:name(language_)",
  headers: {
    "User-Agent": "nexssp 2.0" //
  }
};
let d = "";
console.time("s");
var stream = request
  .get(options)
  //   .on("response", d => console.log("============zzzzzzzz", d.data))
  .on("data", function(chunk) {
    // console.log("============================================");
    d += chunk;
    //   response.forEach(element => {
    //     console.log(element.name);
    //   });
    //   console.table(JSON.stringify(response));
  })
  .on("end", () => {
    console.timeEnd("s");
    const x = JSON.parse(d);
    console.log(
      Object.values(x).map(e => ({
        name: e.name,
        desc: e.description,
        updated_at: e.updated_at,
        clone_url: e.clone_url
      }))
      //   Object.values(x)
    );
  });

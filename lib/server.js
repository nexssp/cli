const { yellow } = require("./color");
const { spawn } = require("child_process");
const { PassThrough } = require("stream");
const parser = require("url");
const http = require("http");
const { info, warn } = require("./log");
const fs = require("fs");

// python -m SimpleHTTPServer 8080
// php -S localhost:80
module.exports.startServer = (server, router, runSequence) => {
  const mimeTypes = require("../config/mimeTypes");
  // if (!server) {
  //   warn("Server not specified so no run.");
  //   return;
  // }

  // console.log(
  //   router.paths.reduce((p,n) => p.concat({
  //     n.url : parser.parse(n.destination));
  //   },{})
  // );

  // process.exit(1);
  const host = server && server.host ? server.host : "127.0.0.1";
  const port = server && server.port ? server.port : 8080;

  if (host && port) {
    info(
      `Starting server..${yellow(host)}:${yellow(
        port
      )}, CTRL+C (twice) to exit.`
    );

    let nexssStartArgs = process.argv.splice(2);
    // console.log(nexssStartArgs);
    const index = nexssStartArgs.indexOf("--server");
    if (index > -1) {
      nexssStartArgs.splice(index, 1);
    }

    // console.log(nexssStartArgs);
    var server = http.createServer(
      // {
      //   key: fs.readFileSync("./key.pem"),
      //   cert: fs.readFileSync("./cert.pem")
      // },

      async function(req, res) {
        // if (req.url !== "/favicon.ico") {
        console.time("Nexss request");
        var pt = new PassThrough();
        // pt.on("pipe", e => console.log(`pipe:`, Object.keys(e)));
        // pt.on("data", d => console.log(`data:`, d.toString()));

        let url = parser.parse(req.url, true);

        // console.log(`url parsed: ${inspect(url)}`);

        console.log(`${req.method}/${req.httpVersion} ${req.url}:`);

        let spawnOptions = {
          detached: false,
          shell: true,
          stdio: ["ignore", "pipe", "pipe"]
        };

        // spawnOptions.input = JSON.stringify(url.query);
        if (!nexssStartArgs.includes("--quiet"))
          nexssStartArgs = nexssStartArgs.concat("--quiet");

        //We make sure we don't have --seq at start - review later
        nexssStartArgs = nexssStartArgs.filter(e => {
          return !e.startsWith("--seq=");
        });

        if (url.pathname && url.pathname !== "/") {
          if (url.pathname.startsWith("/")) {
            url.pathname = url.pathname.slice(1);
          }

          // For server we read files as

          const extension = url.pathname.split(".").pop();
          if (extension in mimeTypes) {
            if (!fs.existsSync(url.pathname)) {
              url.pathname = "404.html";
            }

            if (!fs.existsSync(url.pathname)) {
              res.writeHead(404, { "Content-Type": "text/plain" });
              res.end(`File not found: ${url.pathname}`);
              return;
            }

            const fileData = fs.readFileSync(url.pathname);
            // console.log(mimeTypes[extension] + "; charset=utf-8");
            res.writeHead(200, {
              "Content-Type": mimeTypes[extension] + "; charset=utf-8"
            });
            res.end(fileData);
            console.timeEnd("Nexss request");
            return;
          }

          nexssStartArgs = nexssStartArgs.concat(`--seq=${url.pathname}`);
        }

        // console.log("nexss", nexssStartArgs);

        var responder = spawn("nexss", nexssStartArgs, spawnOptions);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

        // Stream to the result
        if ((str = 0)) {
          let data;
          responder.stdout.on("data", d => {
            console.log("data");
            data += d;
          });

          responder.stdout.on("end", () => {
            res.end(data);
            console.timeEnd("Nexss request");
          });
        } else {
          responder.stdout.pipe(pt).pipe(res);
          console.timeEnd("Nexss request");
        }
        // }
      }
    );

    server.listen(port, host, () => {
      console.log(`Your Node.js server is running at http://${host}:${port}/`);
    });

    server.on("error", e => {
      if (e.code === "EADDRINUSE") {
        console.log("Address in use, retrying...");
        setTimeout(() => {
          server.close();
          server.listen(port, host);
        }, 1000);
      }
    });

    //process.exit(0);
  } else {
    console.log("specify host and port for server");
    process.exit(1);
  }
};

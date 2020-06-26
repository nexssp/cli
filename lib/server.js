const { yellow, bold } = require("./color");
const { spawn } = require("child_process");
const { PassThrough } = require("stream");
const parser = require("url");
const http = require("http");
const { info, warn, error } = require("./log");
const fs = require("fs");

module.exports.startServer = (server, opts, runSequence) => {
  const mimeTypes = require("../config/mimeTypes");
  const host = server && server.host ? server.host : "127.0.0.1";
  const port = server && server.port ? server.port : 9369;

  // require("dns").lookup(require("os").hostname(), function(err, add, fam) {
  //   console.log("addr: " + add);
  // });

  info(
    `Starting server.. ${yellow(host)}:${yellow(
      bold(port)
    )}, CTRL+C (twice) to exit.`
  );

  let nexssStartArgs = process.argv.splice(2);
  // console.log(nexssStartArgs);
  const index = nexssStartArgs.indexOf("--server");
  if (index > -1) {
    nexssStartArgs.splice(index, 1);
  }

  nexssStartArgs = nexssStartArgs.concat([
    "--pipeerrors",
    "--quiet",
    "--htmlOutput",
  ]);

  if (opts && opts.cwd) {
    nexssStartArgs = nexssStartArgs.concat([`--cwd=${opts.cwd}`]);
  }
  const keyPem = server && server.key ? server.key : null;
  if (keyPem && !fs.existsSync(keyPem)) {
    error(
      `Server key '${server.key}' which is specified in the _nexss.yml does not exist. (./key.pem?)`
    );
    process.exit();
  }
  const certPem = server && server.cert ? server.cert : null;

  if (certPem && !fs.existsSync(certPem)) {
    error(
      `Server cert '${server.key}' which is specified in the _nexss.yml does not exist. (./cert.pem?)`
    );
    process.exit();
  }
  // console.log(nexssStartArgs);
  var server = http.createServer(
    {
      key: keyPem,
      cert: certPem,
    },

    async function (req, res) {
      console.time("Nexss request");
      console.log(`${req.method}/${req.httpVersion} ${req.url}:`);
      if (req.url === "/favicon.ico") {
        if (!fs.existsSync("favicon.ico")) {
          // loading default Nexss if there is no custom one icon
          const fileData = fs.createReadStream(
            `${__dirname}/assets/favicon.ico`
          );
          // console.log(mimeTypes[extension] + "; charset=utf-8");
          res.writeHead(200, {
            "Content-Type": mimeTypes["ico"],
          });
          fileData.pipe(res);
          console.timeEnd("Nexss request");
          return;
        }
      }

      var pt = new PassThrough();
      // pt.on("pipe", e => console.log(`pipe:`, Object.keys(e)));
      // pt.on("data", d => console.log(`data:`, d.toString()));

      let url = parser.parse(req.url, true);

      // console.log(`url parsed: ${inspect(url)}`);

      let spawnOptions = {
        detached: false,
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
      };

      // spawnOptions.input = JSON.stringify(url.query);

      // We make sure we don't have --seq and nxsOut at start - review later
      // --nxsField=nxsOut
      nexssStartArgs = nexssStartArgs.filter((e) => {
        return !e.startsWith("--seq=") && !e.startsWith("--nxsField=nxsOut");
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
            res.writeHead(404, {
              "Content-Type": "text/plain",
            });
            res.end(`File not found: ${url.pathname}`);
            console.timeEnd("Nexss request");
            return;
          }

          const fileData = fs.createReadStream(url.pathname);
          // console.log(mimeTypes[extension] + "; charset=utf-8");
          res.writeHead(200, {
            "Content-Type": mimeTypes[extension] + "; charset=utf-8",
          });
          fileData.pipe(res);
          console.timeEnd("Nexss request");
          return;
        }

        nexssStartArgs = nexssStartArgs.concat(`--seq=${url.pathname}`);
      }

      // nexssStartArgs = nexssStartArgs.concat("--nxsField=nxsOut");
      console.log("Spawning.. " + bold("nexss " + nexssStartArgs.join(" ")));
      var responder = spawn("nexss", nexssStartArgs, spawnOptions);
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });

      // Stream to the result
      if ((str = 0)) {
        let data;
        responder.stdout.on("data", (d) => {
          console.log("data");
          data += d;
        });

        responder.stdout.on("end", () => {
          res.end(data);
          console.timeEnd("Nexss request");
        });
      } else {
        responder.stdout.pipe(pt).pipe(res);
        // responder.stderr.pipe(pt);
        console.timeEnd("Nexss request");
      }
      // }
    }
  );

  server.listen(port, host, () => {
    console.log(
      `Your Nexss Programmer server is running at http://${host}:${port}/`
    );
  });

  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.log("Address in use, retrying...");
      setTimeout(() => {
        server.close();
        server.listen(port, host);
      }, 1000);
    }
  });
};

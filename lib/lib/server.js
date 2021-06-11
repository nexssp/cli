const { spawn } = require('child_process')
const { PassThrough } = require('stream')
const parser = require('url')
const http = require('http')
const fs = require('fs')
const path = require('path')
const nexssOS = require('@nexssp/os')
const { ddd } = require('@nexssp/dddebug')
const os1 = new nexssOS()

module.exports.startServer = (server, opts, runSequence) => {
  const mimeTypes = require('../config/mimeTypes')
  const host = server && server.host ? server.host : '127.0.0.1'
  const port = server && server.port ? server.port : 9369

  // require("dns").lookup(require("os").hostname(), function(err, add, fam) {
  //   console.log("addr: " + add);
  // });
  const hostAddress = `${host}:${port}`
  log.info(`Starting server.. ${yellow(hostAddress)}, CTRL+C (twice) to exit.`)

  let nexssStartArgs = process.argv.splice(2)
  // console.log(nexssStartArgs);
  const index = nexssStartArgs.indexOf('--server')
  if (index > -1) {
    nexssStartArgs.splice(index, 1)
  }

  if (process.platform === 'win32') {
    nexssStartArgs = nexssStartArgs.map((a) =>
      a.indexOf('=') > -1 ? `${a.replace('=', '="')}"` : a
    )
  } else {
    nexssStartArgs = nexssStartArgs.map((a) =>
      a.indexOf('=') > -1 ? `${a.replace('=', "='")}'` : a
    )
  }
  nexssStartArgs = nexssStartArgs.concat(['--nxsPipeErrors', '--htmlOutput']) //'--quiet',

  if (opts && opts.cwd) {
    if (process.platform === 'win32') {
      nexssStartArgs = nexssStartArgs.concat([`--cwd="${opts.cwd}"`])
    } else {
      nexssStartArgs = nexssStartArgs.concat([`--cwd='${opts.cwd}'`])
    }
  }
  const keyPem = server && server.key ? server.key : null
  if (keyPem && !fs.existsSync(keyPem)) {
    log.error(
      `Server key '${server.key}' which is specified in the _nexss.yml does not exist. (./key.pem?)`
    )
    process.exit()
  }
  const certPem = server && server.cert ? server.cert : null

  if (certPem && !fs.existsSync(certPem)) {
    log.error(
      `Server cert '${server.key}' which is specified in the _nexss.yml does not exist. (./cert.pem?)`
    )
    process.exit()
  }
  // console.log(nexssStartArgs);
  var server = http.createServer(
    {
      key: keyPem,
      cert: certPem,
    },

    async (req, res) => {
      console.time('Nexss request')
      console.log(`${req.method}/${req.httpVersion} ${req.url}:`)
      if (req.url === '/favicon.ico') {
        if (!fs.existsSync('favicon.ico')) {
          // loading default Nexss if there is no custom one icon
          const fileData = fs.createReadStream(`${__dirname}/assets/favicon.ico`)
          // console.log(mimeTypes[extension] + "; charset=utf-8");
          res.writeHead(200, {
            'Content-Type': mimeTypes.ico,
          })
          fileData.pipe(res)
          console.timeEnd('Nexss request')
          return
        }
      }

      const pt = new PassThrough()
      // pt.on("pipe", e => console.log(`pipe:`, Object.keys(e)));
      // pt.on("data", d => console.log(`data:`, d.toString()));

      const url = parser.parse(req.url, true)

      // spawnOptions.input = JSON.stringify(url.query);

      // We make sure we don't have --seq and nxsOut at start - review later
      // --nxsField=nxsOut
      nexssStartArgs = nexssStartArgs.filter(
        (e) =>
          !e.startsWith('--seq=') &&
          !e.startsWith('--nxsUrlPath=') &&
          !e.startsWith('--nxsUrlSearch=') // && !e.startsWith("--nxsField=nxsOut");
      )

      url.pathname = url.pathname.replace('/%22', '')

      if (url.pathname && url.pathname !== '/') {
        if (url.pathname.startsWith('/')) {
          url.pathname = url.pathname.slice(1)
        }
        // For server we read files as

        const extension = url.pathname.split('.').pop().replace('/%22', '')
        if (extension in mimeTypes) {
          const publicUrl = `public/${url.pathname.replace(/\.\./g, '')}`
          if (fs.existsSync(publicUrl)) {
            url.pathname = publicUrl
            // Make sure cwd (to not access any)
          }
          // if (!fs.existsSync(
          //   path.join(process.cwd(), url.pathname.replace(/\.\./g, ""))
          // )
          else {
            url.pathname = '404.html'
          }

          if (!fs.existsSync(url.pathname)) {
            res.writeHead(404, {
              'Content-Type': 'text/plain',
            })
            res.end(`File not found: ${publicUrl}, ${process.cwd()}`)
            console.timeEnd('Nexss request')
            return
          }

          const fileData = fs.createReadStream(url.pathname)
          // console.log(mimeTypes[extension] + "; charset=utf-8");
          res.writeHead(200, {
            'Content-Type': `${mimeTypes[extension]}; charset=utf-8`,
          })
          fileData.pipe(res)
          console.timeEnd('Nexss request')
          return
        }
        let sequence = url.path
        if (sequence.charAt(0) === '/') {
          sequence = sequence.substr(1)
        }

        nexssStartArgs = nexssStartArgs.concat(`--seq="${sequence.replace('%22', '')}"`)
      }

      // console.log(nexssStartArgs);
      // nexssStartArgs = nexssStartArgs.concat("--nxsField=nxsOut");

      const spawnOptions = {
        detached: false,
        shell: os1.getShell(),
        stdio: ['pipe', 'pipe', 'pipe'], // can be also 'pipe', but for debugging it is ['pipe',...]
      }

      spawnOptions.shell = process.shell

      // const node = process.platform !== 'win32' ? process.argv0 : `'${process.argv0}'`
      // const node = process.argv0 // if process argv0 contains space then this does not work.
      const node = 'node'

      const args = [path.resolve(process.env.NEXSS_SRC_PATH, 'nexss.js'), ...nexssStartArgs]

      console.log('Spawning:\n', node, args.join(' '))

      const responder = spawn(node, args, spawnOptions)

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      })

      // Stream to the result

      // let dataX;
      //   responder.stdout.on("data", (d) => {
      //     console.log("data");
      //     dataX += d;
      //   });

      //   responder.stdout.on("end", () => {
      //     res.end(dataX);
      //     // console.timeEnd("Nexss request");
      //   });

      responder.stderr &&
        responder.stderr.on('data', (e) => {
          log.error(
            'Error on:\n',
            magenta(bold(node)),
            yellow(bold(args)),
            '\n' + bold(e.toString())
          )
        })

      responder.stdout.pipe(pt).pipe(res)
      // responder.stderr.pipe(pt);
      console.timeEnd('Nexss request')

      const data = { url, hostAddress }
      responder.stdin.write(Buffer.from(JSON.stringify(data)))
      responder.stdin.end()

      // }
    }
  )

  server.listen(port, host, () => {
    console.log(`Your Nexss Programmer server is running at http://${hostAddress}/`)
  })

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log('Address in use, retrying...')
      setTimeout(() => {
        server.close()
        server.listen(port, host)
      }, 1000)
    }
  })
}

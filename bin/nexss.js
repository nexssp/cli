#!/usr/bin/env node

/**
 * @fileoverview Over 50 programming languages together..
 * @author Marcin Polak / Nexss.com
 * @email mapoart@gmail.com
 */

const NexssProgrammer = require('../lib/nexss-programmer')

  ; (async () => {
    await NexssProgrammer(process.argv.slice(2))
  })()

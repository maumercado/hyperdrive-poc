// Remember to set type: module in package.json or use .mjs extension
import fp from 'fastify-plugin'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export default fp(async function (fastify) {
  // Set up the database
  // db.json file path
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const file = join(__dirname, './../db.json')

  const adapter = new JSONFile(file)
  const db = new Low(adapter, { drives: [] })
  // Read data from JSON file, this will set db.data content
  // If JSON file doesn't exist, defaultData is used instead
  await db.read()
  fastify.decorate('db', db)
})

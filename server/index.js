import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import hyperstart from './plugins/hyperstart.js'
import fastifyCors from '@fastify/cors'
import util from 'util'
import { pipeline } from 'stream'

const pump = util.promisify(pipeline)

const fastify = Fastify({ logger: true })

const IGNORE = /(\.drives|\.git |\.github | package - lock\.json | node_modules\/\.package-lock\.json|cores)(\/|$)/i

await fastify.register(multipart)
await fastify.register(fastifyCors, {origin: '*', methods: 'GET,POST,PUT,DELETE, OPTIONS'})

await fastify.register(hyperstart)

fastify.get('/files', async () => {
  const files = []

  for await (const entry of fastify.drive.readdir()) {
    if (IGNORE.test(entry)) continue
    const file = await fastify.drive.entry(entry)
    files.push({
      name: entry,
      metadata: file.value.metadata
    })
  }
  return { files }
})

fastify.get('/info', async () => {
  const key = await fastify.drive.key.toString('hex')
  return { key }
})

fastify.post('/upload', async (request) => {
  const data = await request.file()
  const { filename, mimetype, file, fields } = data
  const readStream = file
  const writeStream = fastify.drive.createWriteStream(filename, { metadata: fields.description.value })
  await pump(readStream, writeStream)
  return { filename, mimetype, message: 'File uploaded successfully!' }
})

// Start the server
fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err
  fastify.log.info(`Server listening on ${address}`)
})

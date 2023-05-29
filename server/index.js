import { mkdir } from 'node:fs/promises'
import { pipeline } from 'stream'
import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import Localdrive from 'localdrive'
// import debounce from 'debounceify'
import Hyperdrive from 'hyperdrive'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import b4a from 'b4a'
import util from 'util'
import goodbye from 'graceful-goodbye'
import db from './plugins/db.js'
import onSwarm from './plugins/onSwarm.js'
import fastifyCors from '@fastify/cors'

const fastify = Fastify({ logger: true })

// const pump = util.promisify(pipeline)

const LOCAL_BASEDIR = './uploads'
const CORESTORE_BASEDIR = './drives'

// Set up Fastify to receive file uploads
await fastify.register(multipart)
await fastify.register(db)
await fastify.register(onSwarm)
await fastify.register(fastifyCors, {origin: '*', methods: 'GET,POST,PUT,DELETE, OPTIONS'})

fastify.post('/upload', async (req) => {

})

fastify.post('/create-drive', async (req, res) => {
  const { username } = await req.body


  // req.log.info('info', {data: fastify.db.data})
  const exists = fastify.db.data.drives.find((drives) => drives.username === username)
  if (exists) {
    res.code(400)
    return {message: 'Drive already exists!'}
  } else {
    // Create a new Corestore instance
    const store = new Corestore(`${CORESTORE_BASEDIR}/${username}`)

    // Create a new Localdrive path
    await mkdir(`${LOCAL_BASEDIR}/${username}`, { recursive: true })
    // Create a new Hyperdrive instance
    const drive = new Hyperdrive(store)
    await drive.ready()
    fastify.db.data.drives.push({
      username, key: b4a.toString(drive.key, 'hex'),
      discoveryKey: b4a.toString(drive.discoveryKey, 'hex'),
      path: `${LOCAL_BASEDIR}/${username}`
    })
    await fastify.db.write()
    return { message: 'Drive created successfully!', key: b4a.toString(drive.key, 'hex'), discoveryKey: b4a.toString(drive.discoveryKey, 'hex') }
  }
})

// Set up Fastify to list all files and topics
fastify.get('/:drive/files', async (req, res) => {
  // find drive inside db.drives that matches the username :drive
  const foundDrive = fastify.db.data.drives.find((drive) => drive.username === req.params.drive)
  if (!foundDrive) {
    res.code(404)
    return { message: 'Drive not found!' }
  }
  // can we initialize hyperdrive with a path here and then list files? do we also have to initialize corestore? and join the swarm?
  const store = new Corestore(b4a.from(foundDrive.discoveryKey, 'hex'), { path: `${CORESTORE_BASEDIR}/${req.params.drive}` })
  const drive = new Hyperdrive(store, b4a.from(foundDrive.discoveryKey, 'hex'))
  goodbye(() => drive.close())

  const swarm = new Hyperswarm(drive.discoveryKey)
  goodbye(() => swarm.destroy(), 1)

  fastify.onSwarm(swarm, drive)

  await drive.ready()
  let files = []
  for await (const file of drive.readdir('/')) {
    files.push(file)
  }
  return { files }

})

fastify.get('/drives', (request, reply) => {
  const drives = fastify.db.data.drives.filter((drive) => drive.username !== 'value')
  reply.send(drives);
});

// Start the server
fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err
  fastify.log.info(`Server listening on ${address}`)
})

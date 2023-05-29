import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'stream'
import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import Localdrive from 'localdrive'
import unixPathResolve from 'unix-path-resolve'
// import debounce from 'debounceify'
import Hyperdrive from 'hyperdrive'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import b4a from 'b4a'
import util from 'util'
import db from './plugins/db.js'
import onSwarm from './plugins/onSwarm.js'
import fastifyCors from '@fastify/cors'

const fastify = Fastify({ logger: true })

// const pump = util.promisify(pipeline)

const IGNORE = /\/(\.drives|\.git|\.github|package-lock\.json|node_modules\/\.package-lock\.json|corestore)(\/|$)/i

const LOCAL_BASEDIR = './uploads'
const CORESTORE_BASEDIR = './hdrives'

function executeOnCall(...fns) {
  return function () {
    fns.forEach(fn => fn());
  }
}

// Set up Fastify to receive file uploads
await fastify.register(multipart)
await fastify.register(db)
await fastify.register(onSwarm)
await fastify.register(fastifyCors, {origin: '*', methods: 'GET,POST,PUT,DELETE, OPTIONS'})

fastify.post('/:drive/upload', async (req, res) => {

  // find drive inside db.drives that matches the username :drive
  const foundDrive = fastify.db.data.drives.find((drive) => drive.username === req.params.drive)
  const corestoreDir = `${CORESTORE_BASEDIR}/${foundDrive.username}`

  if (!foundDrive) {
    res.code(404)
    return { message: 'Drive not found!' }
  }
  // can we initialize hyperdrive with a path here and then list files? do we also have to initialize corestore? and join the swarm?
  const store = new Corestore(path.resolve(corestoreDir))
  const drive = new Hyperdrive(store, b4a.from(foundDrive.discoveryKey, 'hex'))

  const swarm = new Hyperswarm()

  await drive.ready()
  fastify.onSwarm(swarm, drive)

  const goodbye = executeOnCall(
    () => drive.close(),
    () => swarm.destroy()
  )

  const data = await req.file({ limits: { fileSize: 1048576 } })

  const driveContent = []
  for await (const chunk of data.file) {
    driveContent.push(chunk);
  }
  const finalDriveContent = Buffer.concat(driveContent)

  try {
    if (IGNORE.test(data.filename)) return { message: 'File not allowed!' }
    req.log.info('putting into drive', { filename: data.filename, description: data.fields.description.value})
    await drive.put(data.filename, finalDriveContent, { metadata: { description: data.fields.description.value } })
    req.log.info('drive put successful')
    return { file, message: 'File uploaded successfully!' }
  } catch (err) {
    req.log.error(err)
    res.code(500)
    return { message: 'Error uploading file!' }
  } finally {
    goodbye()
  }

})

fastify.post('/create-drive', async (req, res) => {
  const { username } = await req.body
  // req.log.info('info', {data: fastify.db.data})
  const exists = fastify.db.data.drives.find((drives) => drives.username === username)
  let goodbye = () => { }
  if (exists) {
    res.code(400)
    return {message: 'Drive already exists!'}
  } else {
    // Create a new Corestore instance
    const store = new Corestore(`${CORESTORE_BASEDIR}/${username}`)
    try {
      // Create a new Localdrive path
      await mkdir(`${LOCAL_BASEDIR}/${username}`, { recursive: true })
      // Create a new Hyperdrive instance
      const drive = new Hyperdrive(store)
      await drive.ready()
      goodbye = executeOnCall(() => drive.close())
      fastify.db.data.drives.push({
        username,
        key: b4a.toString(drive.key, 'hex'),
        discoveryKey: b4a.toString(drive.discoveryKey, 'hex'),
      })
      await fastify.db.write()
      return { message: 'Drive created successfully!', key: b4a.toString(drive.key, 'hex'), discoveryKey: b4a.toString(drive.discoveryKey, 'hex') }
    } catch (err) {
      req.log.error(err)
      res.code(500)
      return { message: 'Error creating drive!' }
    } finally {
      goodbye()
    }

  }
})

// Set up Fastify to list all files and topics
fastify.get('/:drive/files', async (req, res) => {
  // find drive inside db.drives that matches the username :drive
  const foundDrive = fastify.db.data.drives.find((drive) => drive.username === req.params.drive)
  const corestoreDir = `${CORESTORE_BASEDIR}/${foundDrive.username}`

  if (!foundDrive) {
    res.code(404)
    return { message: 'Drive not found!' }
  }
  // can we initialize hyperdrive with a path here and then list files? do we also have to initialize corestore? and join the swarm?
  const store = new Corestore(corestoreDir)
  const drive = new Hyperdrive(store, b4a.from(foundDrive.discoveryKey, 'hex'))

  const swarm = new Hyperswarm()
  const goodbye = executeOnCall(
    () => drive.close(),
    () => swarm.destroy()
  )
  try {
    let files = []
    await drive.ready()
    fastify.onSwarm(swarm, drive)

    for await (const name of drive.readdir(path.resolve(corestoreDir))) {
      if (IGNORE.test(name)) continue
      req.log.info(name, 'processing one file on readdir')

      let file = await drive.entry(name)
      files.push({ name, size: file.size })
    }
    return { files }

  } catch (err) {
    req.log.error(err)
    res.code(500)
    return { message: 'Error listing files!' }
  } finally {
    goodbye()
  }

})

fastify.get('/drives', (_, res) => {
  const drives = fastify.db.data.drives.filter((drive) => drive.username !== 'value')
  res.send(drives);
});

// Start the server
fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) throw err
  fastify.log.info(`Server listening on ${address}`)
})

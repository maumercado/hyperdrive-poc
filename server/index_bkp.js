const fastify = require('fastify')({ logger: true })
const multipart = require('@fastify/multipart')
const Localdrive = require('localdrive')
const debounce = require('debounceify')
const Hyperdrive = require('hyperdrive')
const Hyperswarm = require('hyperswarm')
const Corestore = require('corestore')
const fs = require('fs')
const util = require('util')
const crypto = require('crypto')
const { pipeline } = require('stream')

const pump = util.promisify(pipeline)

const LOCAL_BASEDIR = './uploads'
const CORESTORE_BASEDIR = './drives'

async function mirrorDrive () {
  fastify.log.info('started mirroring changes from \'./writer-dir\' into the drive')
  const mirror = local.mirror(drive)
  await mirror.done()
  fastify.log.info('finished mirroring:', mirror.count)
}


// Join the swarm to find peers sharing the topic
const swarm = new Hyperswarm()

swarm.on('connection', (socket, info) => {
  fastify.log.info('New peer connected:', info)

  // Replicate the drive with the new peer
  const stream = drive.replicate({ live: true })
  socket.pipe(stream).pipe(socket)
  fastify.log.info('Replication complete!')
})

// Set up Fastify to receive file uploads
fastify.register(multipart)

fastify.post('/upload', async (req) => {
  // Get the file from the request
  // Get the topic from the request
  const { fields, file } = await req.file({ limits: { fileSize: 1048576 } })

  const topic = crypto.randomBytes(32)
  // Join the swarm for the specified topic
  swarm.join(topic, {
    lookup: true, // find and connect to peers
    announce: true // announce ourselves as a peer
  })

  // Save the file to the local filesystem
  await pump(file, fs.createWriteStream(`./uploads/${fields.file.filename}`))

  // Import changes from the local drive into the Hyperdrive
  debounce(mirrorDrive)()

  // Add the file to the drive

  return { filename: file.filename, topic: fields.topic, description: fields.description, message: 'File uploaded successfully!' }
})

fastify.post('/create-drive', async (req) => {
  const {fields} = await req.file()
    // Create a new Corestore instance
  const store = new Corestore(`${CORESTORE_BASEDIR}/${fields.username}}`)

  // Create a new Localdrive instance
  new Localdrive(`${LOCAL_BASEDIR}/${fields.username}`)
  // Create a new Hyperdrive instance
  const drive = new Hyperdrive(store)
  await drive.ready()

  return { message: 'Drive created successfully!', key: BigInt64Array.toString(drive.key, 'hex') }
})

// Set up Fastify to list all files and topics
fastify.get('/files', async () => {
  const files = []
  for await (const file of await drive.list('/')) {
    const metadata = await drive.entry(file).metadata

    files.push({
      name: file,
      description: metadata.description,
      topic: metadata.topic
    })
  }

  return { files }
})

// Start the server
fastify.listen({ port: 3001 }, (err, address) => {
  if (err) throw err
  fastify.log.info(`Server listening on ${address}`)
})

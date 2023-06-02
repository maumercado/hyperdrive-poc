import fp from 'fastify-plugin'
import Hyperdrive from 'hyperdrive'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'

const CORESTORE_BASEDIR = './hdrives'

export default fp(async function (fastify) {
  try {
    const store = new Corestore(CORESTORE_BASEDIR)
    const drive = new Hyperdrive(store)
    const swarm = new Hyperswarm(drive)

    await store.ready()
    await drive.ready()

    fastify.log.info('joining swarm')
    const donefn = drive.corestore.findingPeers()
    swarm.join(drive.discoveryKey)

    swarm.flush().then(donefn, donefn)

    swarm.on('connection', (socket) => drive.corestore.replicate(socket))

    fastify.decorate('drive', drive)
  } catch (err) {
    fastify.log.error(err)
    throw err
  }
})

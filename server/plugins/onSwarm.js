import fp from 'fastify-plugin'

function onSwarm(swarm, drive) {
  swarm.join(drive.discoveryKey)
  const done = drive.corestore.findingPeers()

  swarm.flush().then(done, done)
  swarm.on('connection', (socket) => {
    drive.corestore.replicate(socket)
  })
}

export default fp(async (fastify) => {
  fastify.decorate('onSwarm', onSwarm)
})


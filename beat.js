const ssbKeys = require('ssb-keys')
const keys = ssbKeys.loadOrCreateSync('/Users/micro/.creature/secret')
const type = 'heartbeat'
const bpm = Math.floor(160 * Math.random())

ssbClient(
  keys,
  opts,
  (err, server, config) => {
    server.publish({ type, bpm }, (err, msg) => {
      console.dir(msg)
    })
  }
)

const fs = require('fs')
const pull = require('pull-stream')
const Client = require('ssb-client')
const Config = require('ssb-config/inject')

const ssb_appname = process.env.ssb_appname
const config = Config(ssb_appname)

const opts = {
  manifest: JSON.parse(fs.readFileSync(`/Users/micro/.${ssb_appname}/manifest.json`)),
  port: config.port,
  host: config.host || `localhost`,
  caps: config.caps,
  key: config.key || config.keys && config.keys.id
}

Client(config.keys, opts, (err, server) => {
  if (err) throw err

  const type = `heartbeat`
  let heartbeat

  // populate latest bpm
  pull(
    server.messagesByType({ type, reverse: true, limit: 1 }),
    pull.collect((err, msgs) => {
      bpm = msgs.length && msgs[0].value && msgs[0].value.content && msgs[0].value.content.bpm ? msgs[0].value.content.bpm : 80 + Math.round(40 * Math.random())
    })
  )

  // show live bpm messages
  pull(
    server.messagesByType({ type, live: true, keys: false }),
    pull.drain((msg) => {
      const { sequence, content } = msg
      if (!content) return
      const { bpm } = content
      console.log(`❤️ ${sequence}: ${bpm}`)

      // updateHeartBeat
      if (heartbeat) { clearTimeout(heartbeat) }
      heartbeat = setTimeout(() => {
        const delta = Math.max(1, bpm * 0.1 * Math.random()) * (Math.random() > 0.5 ? 1 : -1)
        const newbpm = Math.round(Math.max(40, Math.min(120, bpm + delta)))
        server.publish({ type, bpm: newbpm })
      }, bpm * 500)
    })
  )
})

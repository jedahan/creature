// see package.json for usage
// node examples/wrap.js ./remote.js LONGDATKEYHERE
// will sync to remote/LONGDATKEYHERE
import { Creature } from '../src/Creature'
import fs from 'fs'
import path from 'path'

const key = process.argv[3]
const creature = new Creature({ key, datPath: path.join(`remote`, key) })

creature.on('connection', console.dir)
creature.on('update', console.dir)
creature.sync().then(innerCreature => {
  const key = innerCreature.dat.key.toString('hex')
  console.log(`dat://${key} syncing!`)

  const stats = innerCreature.dat.trackStats()
  let fsTimeout = null
  stats.on('update', _stats => {
    const filePath = path.join(`remote`, key, `data.json`)
    clearInterval(fsTimeout)
    fsTimeout = setTimeout(() => {
      fs.readFile(filePath, (err, data) => {
        if (err) console.error(err)
        else console.dir(JSON.parse(data))
      })
    }, 1000)
  })

  process.stdin.setRawMode(true)
  process.stdin.on('data', data => {
    const keyMap = {
      'q': () => process.exit(0),
      'h': () => process.stdout.write(`'q' to quit\n`)
    }

    keyMap[String(data) in keyMap ? String(data) : 'h']()
  })
})
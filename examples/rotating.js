import ascii from 'ascii-faces'
import { getPath } from '../src/getPath'
import { Creature } from '../src/Creature'
const initialFace = 'what face'
const { filePath, datPath } = getPath()

const creature = new Creature({ initialFace, filePath, datPath })
creature.on('connection', console.dir)
creature.on('update', console.dir)

process.stdin.setRawMode(true)
process.stdin.on('data', data => {
  const keyMap = {
    'q': () => process.exit(0),
    'p': () => creature.update({ creature: ascii() }),
    'h': () => process.stdout.write(`'p' to pet, 'q' to quit\n`)
  }

  keyMap[String(data) in keyMap ? String(data) : 'h']()
})

creature.sync()
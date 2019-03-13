import ascii from 'ascii-faces'
import { Creature } from '../src/Creature'
const initialFace = '=)'

const creature = new Creature({ initialData: { face: initialFace } })

creature.on('connection', console.dir)
creature.on('update', console.dir)

creature.sync().then(innerCreature => {
  const key = innerCreature.dat.key.toString('hex')
  console.log(`dat://${key} is ready`)
  process.stdin.setRawMode(true)
  process.stdin.on('data', data => {
    const keyMap = {
      'q': () => process.exit(0),
      'p': () => innerCreature.pets = innerCreature.pets + 1 || 1,
      'f': () => innerCreature.face = ascii(),
      'h': () => process.stdout.write(`'f' for new face, p' to pet, 'q' to quit\n`)
    }

    keyMap[String(data) in keyMap ? String(data) : 'h']()
  })
})
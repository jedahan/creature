import ascii from 'ascii-faces'
import { Weird } from '../src/Weird'

const creature = new Weird({ initialData: { face: '=)' } })

creature.on('connection', console.dir)
creature.on('update', console.dir)

creature.on('created', innerCreature => {
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

creature.sync()
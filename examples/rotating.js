import ascii from 'ascii-faces'
import { getPath } from '../src/getPath'
import { Creature } from '../src/Creature'
const initialFace = 'what face'
const { filePath, datPath } = getPath()

const creature = new Creature({ initialFace, filePath, datPath })
creature.on('connection', console.dir)
creature.on('update', console.dir)

/*
creature.on('created', () => {
  setInterval(() => {
    creature.update({ creature: ascii() })
  }, 5000)
})
*/
creature.sync()
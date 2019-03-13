import fs from 'fs'
import Dat from 'dat-node'
import path from 'path'
import { EventEmitter } from 'events'

/**
 * A Creature is a dat-synced object. It can be local or remote.
 *
 * Sync a remote creature to the `.dat` folder:
 * 
 *     new Creature('dat://blahblahlongkey1234')
 * 
 * Create a new creature with a face:
 * 
 *     new Creature({face: ':)'})
 * 
 * Sync a remote creature to the `remote/creature` folder:
 * 
 *     new Creature('./remote/creature', 'dat://somelongkey')
 * 
 * 
 * Once you have a creature, there are some events that can happen:
 * 
 *        `update`: when the data has changed - will happen multiple times
 *    `connection`: when another dat note has connected to our data
 * 
 * The `update` event gets emitted twice, once when the file changes, 
 * once when we update locally. This maybe only happens when updating locally...
 * 
 * To update the creature, just access its properties like a regular old object:
 * 
 *     creature.face = '-.-' 
 */

const _dat = Symbol('dat')
const _network = Symbol('network')
const _files = Symbol('files')
const _data = Symbol('data')
const _datPath = Symbol('datPath')
const _key = Symbol('key')

class Creature extends EventEmitter {
  constructor({ datPath, key, initialData }) {
    super()
    if (!datPath) datPath = 'dat'
    this[_datPath] = datPath
    this[_key] = key
    if (key && initialData) throw new Error('Please provide one of key or initialData, found both')
    this[_data] = key ? {} : initialData
    this[_dat] = null
    this[_network] = null
    this[_files] = null
  }
  update(data) {
    fs.writeFile(path.join(this[_datPath], 'data.json'), JSON.stringify(data), (err) => {
      if (err) console.error(err)
      this.emit('update', Object.assign(this[_data], data))
    })
  }
  sync() {
    return new Promise((resolve, reject) => {
      const setDat = (err, dat) => {
        if (err) console.error(err)
        this[_dat] = dat

        if (!this[_key]) {
          // Sync files to the given folder, and emit when updated
          this[_files] = this[_dat].importFiles({ watch: true })
          let data = ''
          this[_files].on('put', () => data = '')
          this[_files].on('put-data', (chunk) => data += chunk)
          this[_files].on('put-end', () => this.update(JSON.parse(data)))
        }

        // Sync with the dat network, and emit when we see a new connection
        this[_network] = this[_dat].joinNetwork()
        this[_network].on('connection', (connectionInfo, networkInfo) => {
          const { remoteId, key, discoveryKey } = connectionInfo
          const { id, host } = networkInfo
          const connection = { id, remoteId, key, discoveryKey, host }
          Object.entries(connection).forEach(([k, v]) => k !== 'host' ? connection[k] = v.toString('hex') : '')
          this.emit('connection', connection)
        })

        // Proxy this.data so updating is just a matter of setting some data
        this[_network].on('listening', () => {
          const that = this
          resolve(
            new Proxy(this, {
              set(target, name, value) {
                that.update({ ...target[_data], [name]: value })
                return true
              },
              get(target, name) {
                if (['pause', 'resume', 'data'].includes(name)) return target[name]
                if (name === 'dat') return target[_dat]
                return target[_data][name]
              }
            })
          )
        })
      }

      if (this[_key]) {
        Dat(this[_datPath], { key: this[_key] }, setDat)
      } else {
        Dat(this[_datPath], setDat)
      }
    })
  }

  data() {
    return this[_data]
  }

  pause() {
    if (this[_dat]) this[_dat].pause()
  }

  resume() {
    if (this[_dat]) this[_dat].resume()
  }
}

export { Creature }
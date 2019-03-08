import fs from 'fs'
import createDat from 'dat-node'
import { EventEmitter } from 'events';

class Creature extends EventEmitter {
  constructor({ filePath, datPath, initialFace }) {
    super()
    this.face = initialFace || 'noface'
    this.datPath = datPath
    this.filePath = filePath
    this.datKey = ''
    this.dat = null
    this.network = null
    // TODO: dont hang on here
    this.face = JSON.parse(fs.readFileSync(this.filePath)).creature
  }

  sync() {
    createDat(this.datPath, (err, dat) => {
      if (err) console.error(err)
      this.dat = dat
      this.datKey = this.dat.key
      this.files = this.dat.importFiles({ watch: true })
      let data = ''
      this.files.on('put', () => data = '')
      this.files.on('put-data', (chunk) => data += chunk)
      this.files.on('put-end', () => this.emit('update', JSON.parse(data)))
      this.network = this.dat.joinNetwork()
      this.network.on('connection', (connectionInfo, networkInfo) => {
        const { remoteId, key, discoveryKey } = connectionInfo
        const { id, host } = networkInfo
        const connection = { id, remoteId, key, discoveryKey, host }
        Object.entries(connection).forEach(([k, v]) => k !== 'host' ? connection[k] = v.toString('hex') : '')
        this.emit('connection', connection)
      })
      this.network.on('listening', () => {
        this.emit('created', this)
      })
    })
  }

  pause() {
    if (this.dat) this.dat.pause()
  }

  resume() {
    if (this.dat) this.dat.resume()
  }

  update({ creature }) {
    fs.writeFile(this.filePath, JSON.stringify({ creature }), (err) => {
      if (err) console.error(err)
    })
  }
}

export { Creature }
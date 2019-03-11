import fs from 'fs'
import { EventEmitter } from 'events'
import sane from 'sane'
/**
 * A Weird is a proxied object with an EventEmitter
 *
 * You edit fields, and it will emit events when they change
 * 
 * It will also sync to the filesystem.
 * 
 *     const somedata = new Weird({path: './somedata/', initialData: {hi: 'friend'}})
 *     somedata.on('update', console.dir)
 */

const _data = Symbol('data')
const _path = Symbol('path')
const _key = Symbol('key')
const _watcher = Symbol('watcher')

class Weird extends EventEmitter {
  constructor({ path, key, initialData }) {
    super()
    this[_path] = path || 'data'
    this[_key] = key
    this[_data] = key ? {} : initialData
  }
  update(data) {
    fs.writeFile(`${this[_path]}/data.json`, JSON.stringify(data), (err) => {
      if (err) console.error(err)
      Object.assign(this[_data], data)
    })
  }
  sync() {
    this[_watcher] = sane(this[_path], { glob: ['data.json'] })
    this[_watcher].on('change', (filepath) => {
      const data = JSON.parse(fs.readFileSync(`${this[_path]}/${filepath}`))
      this.emit('update', data)
    })

    const that = this
    this.emit('created', new Proxy(this, {
      set(target, name, value) {
        that.update({ ...target[_data], [name]: value })
        return true
      },
      get(target, name) {
        if (['key', 'path'].includes(name)) return target[name]
        return target[_data][name]
      }
    }))
  }
}

export { Weird }
import Dat from 'dat-node'
import process from 'process'
import React, { useState, useEffect } from 'react'
import { render, Box, StdinContext, Color } from 'ink'
import ascii from 'ascii-faces'

const KeyHandler = ({ stdin, setRawMode, handleKey, children }) => {
  useEffect(() => {
    setRawMode(true)
    stdin.on('data', handleKey)
    return () => {
      stdin.off('data', handleKey)
      setRawMode(false)
    }
  }, [stdin, setRawMode])
  return children
}

const App = ({ initialCreature, updateCreature, dat, network }) => {
  const [syncing, setSyncing] = useState(false)
  const [creature, setCreature] = useState(initialCreature)
  const [creatures, setCreatures] = useState([])
  const [networkInfo, setNetworkInfo] = useState({ id: null, host: null })
  const [connectionInfo, setConnectionInfo] = useState({ remoteId: null, key: null, discoveryKey: null })

  // pause and resume syncing with dat
  useEffect(() => {
    if (syncing) dat.resume()
    else dat.pause()
  }, [syncing])

  const handleKey = data => {
    if (data === 's') setSyncing(syncing => !syncing)
    if (data === 'p') setCreature(ascii())
    if (data === 'q') process.exit(0)
  }

  const handleConnection = (connectionInfo, networkInfo) => {
    const { remoteId, key, discoveryKey } = connectionInfo
    const { id, host } = networkInfo
    setConnectionInfo({ remoteId, key, discoveryKey })
    setNetworkInfo({ id, host })
  }

  // update creature on the backend
  useEffect(() => {
    updateCreature({ creature })
  }, [creature])

  useEffect(() => {
    network.on('connection', handleConnection)
    return () => network.off('connection', handleConnection)
  }, [network])

  return (
    <StdinContext.Consumer>
      {({ stdin, setRawMode }) => {
        return (
          <KeyHandler stdin={stdin} setRawMode={setRawMode} handleKey={handleKey} >
            <Pid />
            <Box flexDirection="column">
              <Box flexDirection="row" justifyContent="space-between">
                <Box>'p' - pet creature</Box>
                <Box>'q' - quit</Box>
                <Box>'s' - toggle sync</Box>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Creature creature={creature} />
                <DatElement dat={dat} />
                <Sync syncing={syncing} />
              </Box>

              <Box flexDirection="row">
                <NetworkInfo networkInfo={networkInfo} connectionInfo={connectionInfo} />
              </Box>
              {creatures.forEach(creature => (
                <Creature creature={creature} />
              ))}
            </Box>
          </KeyHandler>
        )
      }}
    </StdinContext.Consumer>
  )
}

const NetworkInfo = ({ connectionInfo, networkInfo }) => {
  const { remoteId, key, discoveryKey } = connectionInfo
  const { id, host } = networkInfo

  return (
    <Box flexDirection="column">
      <Box>{id ? id.toString('hex') : 'no id'}</Box>
      <Box>({host ? host : 'no host'})</Box>
      <Box>{remoteId ? remoteId.toString('hex') : ''}</Box>
      <Box>{key ? key.toString('hex') : ''}</Box>
      <Box>{discoveryKey ? discoveryKey.toString('hex') : ''}</Box>
    </Box>
  )
}

const Creature = ({ creature }) => (
  <Box><Color blue>{creature}</Color></Box>
)

const DatElement = ({ dat }) => {
  const key = dat.key && dat.key.toString('hex')
  return (
    <Box><Color yellow>( dat://{key} )</Color></Box>
  )
}

const Pid = () => {
  const [pid, setPid] = useState(process.pid || 'no pid')
  return (
    <Box>
      pid: {pid}
    </Box>
  )
}

const Sync = ({ syncing }) => {
  return (
    <Box label="syncing">
      {syncing ? <Color green>✓ syncing</Color> : <Color red>✘ not syncing </Color>}
    </Box >
  )
}

import fs from 'fs'
if (process.argv.length < 3) {
  console.error('please share a filename for the creature')
  process.exit(1)
}
const filePath = process.argv[2]
const path = require('path')
const datPath = path.dirname(filePath)

Dat(datPath, (err, dat) => {
  if (err) console.error(err)
  const progress = dat.importFiles({ watch: true })
  progress.on('put', (src, dest) => {
    console.log('Importing ', src.name, ' into archive')
  })
  const network = dat.joinNetwork()
  const updateCreature = ({ creature }) => {
    fs.writeFile(filePath, JSON.stringify({ creature }), (err) => {
      if (err) console.error(err)
    })
  }


  fs.readFile(filePath, (err, data) => {
    if (err) console.error(err)
    const { creature } = JSON.parse(data)
    render(<App initialCreature={creature} updateCreature={updateCreature} dat={dat} network={network} />)
  })
})

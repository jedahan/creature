import Dat from 'dat-node'
import process from 'process'
import React, { useState, useEffect } from 'react'
import { render, Box, StdinContext } from 'ink'
import ascii from 'ascii-faces'

import { Pid } from './components/Pid'
import { DatKey } from './components/DatKey'
import { Sync } from './components/Sync'
import { Creature } from './components/Creature'
import { NetworkInfo } from './components/NetworkInfo'

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

  // pause and resume syncing with dat
  useEffect(() => {
    if (syncing) dat.resume()
    else dat.pause()
  }, [syncing])

  // subscribe to network updates
  useEffect(() => {
    network.on('connection', handleConnection)
    return () => network.off('connection', handleConnection)
  }, [network])

  return (
    <StdinContext.Consumer>
      {({ stdin, setRawMode }) => {
        return (
          <KeyHandler stdin={stdin} setRawMode={setRawMode} handleKey={handleKey} >
            <Box flexDirection="column">
              <Box flexDirection="row" justifyContent="space-between">
                <Box>'p' - pet creature</Box>
                <Box>'q' - quit</Box>
                <Box>'s' - toggle sync</Box>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Creature creature={creature} />
                <DatKey dat={dat} />
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

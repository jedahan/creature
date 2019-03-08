import React, { useState, useEffect } from 'react'
import { render } from 'ink'
import ascii from 'ascii-faces'

import { Dashboard } from './components/Dashboard'
import { useKeypress } from './hooks/useKeypress'

const useConnectionHandler = (network, connectionHandler) => {
  // subscribe to network updates
  useEffect(() => {
    network.on('connection', connectionHandler)
    return () => network.off('connection', connectionHandler)
  }, [network])
}

const App = ({ initialCreature, updateCreature, dat, network }) => {
  const [syncing, setSyncing] = useState(false)
  const [creature, setCreature] = useState(initialCreature)
  const [creatures, setCreatures] = useState([])
  const [networkInfo, setNetworkInfo] = useState({ id: null, host: null })
  const [connectionInfo, setConnectionInfo] = useState({ remoteId: null, key: null, discoveryKey: null })

  // handle keypresses
  useKeypress((str, key) => {
    if (str === 's') setSyncing(syncing => !syncing)
    if (str === 'p') setCreature(ascii())
    if (str === 'q') process.exit(0)
  })

  // handle network conneciton and disconnection
  useConnectionHandler(network, (connectionInfo, networkInfo) => {
    const { remoteId, key, discoveryKey } = connectionInfo
    const { id, host } = networkInfo
    setConnectionInfo({ remoteId, key, discoveryKey })
    setNetworkInfo({ id, host })
  })

  // update creature on the backend
  useEffect(() => {
    updateCreature({ creature })
  }, [creature])

  // pause and resume syncing with dat
  useEffect(() => {
    if (syncing) dat.resume()
    else dat.pause()
  }, [syncing])

  return (
    <Dashboard {...{ creature, dat, syncing, networkInfo, connectionInfo, creatures }} />
  )
}

import fs from 'fs'

import createDat from 'dat-node'

import { getPath } from './getPath'

const { filePath, datPath } = getPath()

const handleDat = (err, dat) => {
  if (err) console.error(err)

  dat.importFiles({ watch: true })
  const network = dat.joinNetwork()
  const updateCreature = ({ creature }) => {
    fs.writeFile(filePath, JSON.stringify({ creature }), (err) => {
      if (err) console.error(err)
    })
  }

  fs.readFile(filePath, (err, data) => {
    if (err) console.error(err)
    const { creature: initialCreature } = JSON.parse(data)
    render(<App {...{ initialCreature, updateCreature, dat, network }} />)
  })
}

createDat(datPath, handleDat)
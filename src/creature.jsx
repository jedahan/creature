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

const App = ({ initialCreature, updateCreature, datKey }) => {
  const [syncing, setSyncing] = useState(false)
  const [creature, setCreature] = useState(initialCreature)

  const handleKey = data => {
    if (data === 's') setSyncing(syncing => !syncing)
    if (data === 'p') setCreature(ascii())
    if (data === 'q') process.exit(0)
  }

  // update creature on the backend
  useEffect(() => {
    updateCreature({ creature })
  }, [creature])

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
                <DatKey datKey={datKey} />
                <Sync syncing={syncing} />
              </Box>
            </Box>
          </KeyHandler>
        )
      }}
    </StdinContext.Consumer>
  )
}

const Creature = ({ creature }) => (
  <Box><Color blue>{creature}</Color></Box>
)

const DatKey = ({ datKey }) => (
  <Box><Color yellow>( dat://{datKey} )</Color></Box>
)

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
const creature_file = 'creature-a.json'

Dat('./', (err, dat) => {
  if (err) throw err
  dat.importFiles()
  dat.joinNetwork()
  const datKey = dat.key.toString('hex')
  const filePath = `${dat.path}/${creature_file}`
  const updateCreature = ({ creature }) => {
    fs.writeFile(filePath, JSON.stringify({ creature }), (err) => { if (err) throw err })
  }

  fs.readFile(filePath, (err, data) => {
    if (err) throw err
    const { creature } = JSON.parse(data)
    render(<App initialCreature={creature} updateCreature={updateCreature} datKey={datKey} />)
  })
})

import Dat from 'dat-node'
import raidb from 'random-access-idb'

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

const App = ({ initialCreature, setDatCreature, repo }) => {
  const [syncing, setSyncing] = useState(false)
  const [creature, setCreature] = useState(initialCreature)

  const handleKey = data => {
    if (data === 's') setSyncing(syncing => !syncing)
    if (data === 'p') setDatCreature(repo, setCreature)
  }

  return (
    <StdinContext.Consumer>
      {({ stdin, setRawMode }) => {
        return (
          <KeyHandler stdin={stdin} setRawMode={setRawMode} handleKey={handleKey} >
            <Pid />

            <Box flexDirection="column">
              <Box flexDirection="row" justifyContent="space-between">
                <Box>'p' - pet creature</Box>
                <Box>'s' - toggle sync</Box>
              </Box>
              <Box flexDirection="row" justifyContent="space-between">
                <Creature creature={creature} />
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

Dat('./', (err, dat) => {
  if (err) throw err
  dat.importFiles()
  dat.joinNetwork()
  const datKey = dat.key.toString('hex')
  render(<App initialCreature={data.creature} setDatCreature={setDatCreature} datKey={datKey} />)
})


const db = raidb('dats')
const dat = new Dat()

const creature_file = 'creature-a.json'

const setDatCreature = (repo, cb) => {
  const newCreature = { creature: ascii() }
  repo.archive.writeFile(creature_file, JSON.stringify(newCreature), (err) => {
    cb(err, newCreature.creature)
  })
}

if (!localStorage.getItem('creature_repo_url')) {
  const repo = dat.create({ db })
  setDatCreature((err, creature) => {
    localStorage.setItem('creature_repo_url', repo.url)
  })
}

const creature_repo_url = localStorage.getItem('creature_repo_url')
const repo = dat.get(creature_repo_url, { db })

repo.archive.readFile(creature_file, 'utf-8', (err, data) => {
  if (err) throw err
  render(<App initialCreature={data.creature} repo={repo} setDatCreature={setDatCreature} />)
})


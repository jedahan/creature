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

const App = () => {
  const [syncing, setSyncing] = useState(false)
  const [creature, setCreature] = useState(ascii())

  const handleKey = data => {
    if (data === 's') setSyncing(syncing => !syncing)
    if (data === 'p') setCreature(ascii())
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

render(<App />)
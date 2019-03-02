import React, { useState, useEffect } from 'react'
import { render, Box, StdinContext } from 'ink'
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
            <Sync syncing={syncing} />
            <Creature creature={creature} />
            <Box>Press 's' to toggle syncing</Box>
            <Box>Press 'p' to pet the creature</Box>
          </KeyHandler>
        )
      }}
    </StdinContext.Consumer>
  )
}

const Creature = ({ creature }) => {
  return (
    <Box>
      creature: {creature}
    </Box>
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
    <Box label="syncing" width={2} left={2} >
      syncing: {syncing ? '✓' : '✘'}
    </Box>
  )
}

render(<App />)
import React from 'react'
import { Box, Color } from 'ink'

const Sync = ({ syncing }) => {
  return (
    <Box label="syncing">
      {syncing ? <Color green>✓ syncing</Color> : <Color red>✘ not syncing </Color>}
    </Box >
  )
}
export { Sync }
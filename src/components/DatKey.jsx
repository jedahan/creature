import React from 'react'
import { Color } from 'ink'
import Box from 'ink-box'

const DatKey = ({ dat }) => {
  const key = dat.key && dat.key.toString('hex')
  const url = `dat://${key}`
  return (
    <Box borderStyle="round">
      <Color yellow>{url}</Color>
    </Box>
  )
}

export { DatKey }
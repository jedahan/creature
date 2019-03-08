import React from 'react'
import { Color } from 'ink'
import Box from 'ink-box'

const DatKey = ({ datKey }) => {
  const key = datKey && datKey.toString('hex')
  const url = `dat://${key}`
  return (
    <Box borderStyle="round">
      <Color yellow>{url}</Color>
    </Box>
  )
}

export { DatKey }
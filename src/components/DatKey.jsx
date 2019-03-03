import React from 'react'
import { Box, Color } from 'ink'

const DatKey = ({ dat }) => {
  const key = dat.key && dat.key.toString('hex')
  return (<Box><Color yellow>dat://{key}</Color></Box>)
}

export { DatKey }
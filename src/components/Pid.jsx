import process from 'process'
import React, { useState } from 'react'
import { Box } from 'ink'

const Pid = () => {
  const [pid, _setPid] = useState(process.pid || 'no pid')
  return (
    <Box> pid: {pid} </Box>
  )
}

export { Pid }
import React from 'react'
import { Box } from 'ink'

const NetworkInfo = ({ connectionInfo, networkInfo }) => {
  const { remoteId, key, discoveryKey } = connectionInfo
  const { id, host } = networkInfo

  return (
    <Box flexDirection="column">
      <Box>{id ? id.toString('hex') : 'no id'}</Box>
      <Box>({host ? host : 'no host'})</Box>
      <Box>{remoteId ? remoteId.toString('hex') : ''}</Box>
      <Box>{key ? key.toString('hex') : ''}</Box>
      <Box>{discoveryKey ? discoveryKey.toString('hex') : ''}</Box>
    </Box>
  )
}
export { NetworkInfo }
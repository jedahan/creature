import React from 'react'
import { Box } from 'ink'

import { DatKey } from './DatKey'
import { Sync } from './Sync'
import { Creature } from './Creature'
import { NetworkInfo } from './NetworkInfo'

const Dashboard = ({ creature, dat, syncing, networkInfo, connectionInfo, creatures }) => (
  <Box flexDirection="column">
    <Box flexDirection="row" justifyContent="space-between">
      <Box>'p' - pet creature</Box>
      <Box>'q' - quit</Box>
      <Box>'s' - toggle sync</Box>
    </Box>

    <Box flexDirection="row" justifyContent="space-between">
      <Creature creature={creature} />
      <DatKey dat={dat} />
      <Sync syncing={syncing} />
    </Box>

    <Box flexDirection="row">
      <NetworkInfo networkInfo={networkInfo} connectionInfo={connectionInfo} />
    </Box>

    {creatures.map(creature => (
      <Creature creature={creature} />
    ))}
  </Box>
)
export { Dashboard }
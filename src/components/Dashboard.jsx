import React from 'react'
import { Box, Text } from 'ink'

import { DatKey } from './DatKey'
import { Sync } from './Sync'
import { Creature } from './Creature'

const Dashboard = ({ creature, dat, syncing, creatures }) => (
  <>
    <DatKey dat={dat} />
    <Box>
      <Box flexDirection="column" padding={1}>
        <Box flexDirection="row"><Text underline>p</Text>et creature</Box>
        <Box flexDirection="row">toggle <Text underline>s</Text>ync</Box>
        <Box flexDirection="row"><Text underline>q</Text>uit</Box>
      </Box>

      <Box flexDirection="column" padding={1}>
        <Creature creature={creature} />
        <Sync syncing={syncing} />

      </Box>

      <Box flexDirection="column" padding={1}>
        {creatures.map(creature => (
          <Creature creature={creature} />
        ))}
      </Box>
    </Box>
  </>
)
export { Dashboard }
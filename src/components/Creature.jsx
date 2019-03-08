import React from 'react'
import { Box, Color } from 'ink'
const Creature = ({ creature }) => (<Box flexDirection="row"><Color blue>{creature.face}</Color></Box>)
export { Creature }

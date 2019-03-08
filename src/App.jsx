import React, { useState, useEffect } from 'react'
import { render } from 'ink'
import ascii from 'ascii-faces'

import { Dashboard } from './components/Dashboard'
import { useKeypress } from './hooks/useKeypress'

const App = ({ creature }) => {
  const [syncing, setSyncing] = useState(false)
  const [face, setFace] = useState(creature.face)
  const [creatures, setCreatures] = useState([])
  const [connection, setConnection] = useState({ id: null, remoteId: null, key: null, discoveryKey: null, host: null })

  // handle keypresses
  useKeypress((str, key) => {
    if (str === 's') setSyncing(syncing => !syncing)
    if (str === 'p') setFace(ascii())
    if (str === 'q') process.exit(0)
  })

  useEffect(() => {
    creature.on('connection', setConnection)
    return () => creature.off('connection', setConnection)
  }, [creature])

  // update creature on the backend
  useEffect(() => {
    creature.update({ creature: face })
  }, [face])

  // pause and resume syncing with dat
  useEffect(() => {
    if (syncing) creature.resume()
    else creature.pause()
  }, [syncing])

  return (
    <Dashboard {...{ creature, syncing, connection, creatures }} />
  )
}

import { getPath } from './getPath'
import { Creature } from './Creature'
const initialFace = 'what face'
const { filePath, datPath } = getPath()
const creature = new Creature({ initialFace, filePath, datPath })

creature.on('created', (newCreature) => {
  newCreature.on('connection', console.dir)
  newCreature.on('update', console.dir)
  setInterval(() => {
    newCreature.update({ creature: ascii() })
  }, 5000)
})

creature.sync()
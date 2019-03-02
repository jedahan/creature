import React, { useState } from 'react'
import blessed from 'neo-blessed'
import { createBlessedRenderer } from 'react-blessed'
const render = createBlessedRenderer(blessed)

const App = () => {
  return (
    <>
      <Pid />
      <Sync />
      <box label='creature'
           border={{type: 'line'}}
           left='60%'
           style={{border: {fg: 'red'} }} >
        {'creature box'}
      </box>
    </>
  )
}

const Pid = () => {
  const [pid, setPid] = useState(process.pid || 'no pid')
  return (
    <box label="pid"
         width='20%'
         border={{type: 'line'}}
         style={{border: {fg: 'cyan'}}} >
      {pid}
    </box>
  )
}

const Sync = () => {
  const [ syncing, setSyncing ] = useState(false)

  return (
    <box label="syncing"
         width='40%'
         left='20%'
         border={{type: 'line'}}
         style={{border: {fg: 'orange'}}} >

      {syncing ? 'syncing' : 'not syncing'}

      <button mouse border={{type: 'line'}} height={5} width={5} top={2} left={4} onPress={() => setSyncing(!syncing)}>+</button>
    </box>
  )
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'creature test'
})

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  return process.exit(0)
})

render(<App/>, screen)

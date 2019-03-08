import { useEffect, useContext } from 'react'
import { StdinContext } from 'ink'

// TODO: memo? useRef? Will this re-init on render?
// Should this re-initialize only if the keypressHandler changes?
const useKeypress = keypressHandler => {
  const { stdin, setRawMode } = useContext(StdinContext)

  useEffect(() => {
    setRawMode(true)
    stdin.on('keypress', keypressHandler)
    return () => {
      stdin.off('keypress', keypressHandler)
      setRawMode(false)
    }
  }, [stdin, setRawMode])
}

export { useKeypress }
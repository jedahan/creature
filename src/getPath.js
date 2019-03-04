import process from 'process'

// Get the filePath and datPath from the commandline
const getPath = () => {
  if (process.argv.length < 3) {
    console.error('please share a filename for the creature')
    process.exit(1)
  }
  const filePath = process.argv[2]
  const path = require('path')
  const datPath = path.dirname(filePath)
  return { filePath, datPath }
}

export { getPath }
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(__dirname, '..', 'api', 'catalogs.json')

console.log('Deleting catalogs file...')
fs.unlinkSync(DATA_FILE)
console.log('Catalogs file deleted.')

import fs from 'fs'
import path from 'path'

const catalogsPath = new URL('../src/data/catalogs.json', import.meta.url)
fs.rmSync(catalogsPath)
console.log(`Catalogs file deleted at ${path.resolve(catalogsPath.pathname)}`)

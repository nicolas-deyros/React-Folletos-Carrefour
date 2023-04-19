import fs from 'fs'
import path from 'path'

const catalogsPath = new URL('../src/data/catalogs.json', import.meta.url)
if (fs.existsSync(catalogsPath)) {
	fs.rmSync(catalogsPath)
	console.log(`Catalogs file deleted at ${path.resolve(catalogsPath.pathname)}`)
} else {
	console.log(`Catalogs file does not exist at ${path.resolve(catalogsPath.pathname)}`)
}

import fs from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'

const DATA_DIR = path.join(__dirname, '..', 'api')
const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

export const fetchCatalogs = async () => {
	try {
		console.log('Fetching catalogs...')
		const res = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
		const data = await res.json()

		await fs.mkdir(DATA_DIR, { recursive: true })
		await fs.writeFile(DATA_FILE, JSON.stringify(data))
		console.log(`Catalogs file saved at ${DATA_FILE}`)
	} catch (e) {
		console.error(e)
	}
}

fetchCatalogs()
console.log('Catalogs file creation scheduled.')

export default fetchCatalogs

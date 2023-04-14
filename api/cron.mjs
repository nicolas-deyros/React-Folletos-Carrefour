import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import cron from 'node-cron'

const DATA_DIR = '/tmp'
const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

const fetchCatalogs = async () => {
	try {
		console.log('Fetching catalogs...')
		const res = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
		const data = await res.json()

		await writeFile(DATA_FILE, JSON.stringify(data))
		console.log(`Catalogs file saved at ${DATA_FILE}`)
	} catch (e) {
		console.error(e)
	}
}

// Fetch catalogs immediately
fetchCatalogs()

export default fetchCatalogs

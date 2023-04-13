import fs from 'fs'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import cron from 'node-cron'

const DATA_DIR = '/tmp'
const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

export const fetchCatalogs = async () => {
	try {
		console.log('Fetching catalogs...')
		const res = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
		const data = await res.json()

		if (!fs.existsSync(DATA_DIR)) {
			fs.mkdirSync(DATA_DIR, { recursive: true })
		}

		await writeFile(DATA_FILE, JSON.stringify(data))
		console.log(`Catalogs file saved at ${DATA_FILE}`)
	} catch (e) {
		console.error(e)
	}
}

// Fetch catalogs immediately
fetchCatalogs()

// Schedule cron job to fetch catalogs every day at midnight
cron.schedule('0 0 * * *', async () => {
	console.log('Scheduled job: Fetching catalogs...')
	await fetchCatalogs()
})

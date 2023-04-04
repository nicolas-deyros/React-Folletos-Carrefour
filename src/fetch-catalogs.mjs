import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import cron from 'node-cron'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

const fetchCatalogs = async () => {
	try {
		console.log('Fetching catalogs...')
		const res = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
		const data = await res.json()

		if (!fs.existsSync(DATA_FILE)) {
			fs.mkdirSync(DATA_DIR, { recursive: true })
		}

		await writeFile(DATA_FILE, JSON.stringify(data))
		console.log(`Catalogs file saved at ${DATA_FILE}`)
	} catch (e) {
		console.error(e)
	}
}

// Check if the file exists before scheduling the cron job
if (fs.existsSync(DATA_FILE)) {
	// Run the function daily at 1:00 AM
	cron.schedule('0 1 * * *', () => {
		console.log('Scheduled job: Fetching catalogs...')
		fetchCatalogs()
	})
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs().then(() => {
		// Run the function daily at 1:00 AM
		cron.schedule('0 1 * * *', () => {
			console.log('Scheduled job: Fetching catalogs...')
			fetchCatalogs()
		})
	})
}

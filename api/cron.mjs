import fs from 'fs'
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

		if (!fs.existsSync(DATA_DIR)) {
			fs.mkdirSync(DATA_DIR, { recursive: true })
		}

		await writeFile(DATA_FILE, JSON.stringify(data))
		console.log(`Catalogs file saved at ${DATA_FILE}`)
	} catch (e) {
		console.error(e)
	}
}

const fetchAndUpdateCatalogs = async () => {
	try {
		const now = new Date()
		if (fs.existsSync(DATA_FILE)) {
			const stat = fs.statSync(DATA_FILE)
			const mtime = new Date(stat.mtime)
			const diffHours = (now - mtime) / 1000 / 60 / 60
			if (diffHours < 24) {
				console.log(`Catalogs file exists and is less than 24 hours old. Skipping fetch.`)
				return
			}
		}
		await fetchCatalogs()
	} catch (e) {
		console.error(e)
	}
}

// Fetch catalogs immediately
fetchAndUpdateCatalogs()

// Schedule cron job to fetch catalogs every day at midnight
cron.schedule('0 6 * * *', async () => {
	console.log('Scheduled job: Fetching catalogs...')
	await fetchAndUpdateCatalogs()
})

export default fetchCatalogs

import fs from 'fs'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { CronJob } from 'cron'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const DATA_FILE = path.join(process.cwd(), 'api', 'catalogs.json')

export const fetchCatalogs = async () => {
	try {
		console.log('Fetching catalogs...')
		let shouldFetch = true
		if (fs.existsSync(DATA_FILE)) {
			const stats = fs.statSync(DATA_FILE)
			const hoursSinceLastFetch = (new Date() - stats.mtime) / 1000 / 60 / 60
			if (hoursSinceLastFetch < 24) {
				console.log(`Catalogs file exists and is less than 24 hours old. Skipping fetch.`)
				shouldFetch = false
			}
		}
		if (shouldFetch) {
			const res = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
			const data = await res.json()

			if (!fs.existsSync(DATA_FILE)) {
				fs.mkdirSync(DATA_DIR, { recursive: true })
			}

			await writeFile(DATA_FILE, JSON.stringify(data))
			console.log(`Catalogs file saved at ${DATA_FILE}`)
		}
	} catch (e) {
		console.error(e)
	}
}

export default async (req: VercelRequest, res: VercelResponse) => {
	if (req.method === 'GET') {
		await fetchCatalogs()
		res.status(200).send('Catalogs fetched')
	} else {
		res.status(404).send('Not found')
	}
}

new CronJob(
	'00 11 * * *',
	async () => {
		console.log('Scheduled job: Fetching catalogs...')
		await fetchCatalogs()
		console.log('Catalogs file updated.')
	},
	null,
	true,
	'America/Argentina/Buenos_Aires'
)

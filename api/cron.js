import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs/promises'
import path from 'path'

const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../tmp/catalogs.json')
const now = new Date()
const dayInMs = 24 * 60 * 60 * 1000

;(async () => {
	try {
		const stats = await fs.stat(filePath)
		const mtime = new Date(stats.mtimeMs)
		const diffMs = now - mtime
		const diffDays = diffMs / dayInMs

		if (diffDays >= 1) {
			console.log(`Catalogs file exists but it's ${diffDays} days old. Fetching catalogs...`)
			await fetchCatalogs()
			console.log('Catalogs file updated.')
		} else {
			console.log(`Catalogs file exists and is less than 24 hours old. Skipping fetch.`)
		}
	} catch (err) {
		console.log('Catalogs file does not exist. Creating file...')
		await fetchCatalogs()
		console.log('Catalogs file created.')
	}
})()

cron.schedule('00 12 * * *', async () => {
	console.log('Scheduled job: Fetching catalogs...')
	await fetchCatalogs()
	console.log('Catalogs file updated.')
})

export default fetchCatalogs

import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = new URL('../tmp/catalogs.json', import.meta.url).pathname
const now = new Date()

if (fs.existsSync(filePath)) {
	const stat = fs.statSync(filePath)
	const mtime = new Date(stat.mtime)
	const diffHours = (now - mtime) / 1000 / 60 / 60

	if (diffHours >= 24) {
		console.log(`Catalogs file exists but it's ${diffHours} hours old. Fetching catalogs...`)
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
		})
	} else {
		console.log(`Catalogs file exists and is less than 24 hours old. Skipping fetch.`)
	}
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file created.')
	})
}

cron.schedule('00 12 * * *', () => {
	console.log('Scheduled job: Fetching catalogs...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file updated.')
	})
})

export default fetchCatalogs

import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = new URL('../tmp/catalogs.json', import.meta.url).pathname
const now = new Date()
const date = new Date()
console.log(
	`Catalogs fetched at ${date.toLocaleString('en-US', {
		timeZone: 'America/Argentina/Buenos_Aires',
	})}`
)

if (fs.existsSync(filePath)) {
	const stats = fs.statSync(filePath)
	const ageInMs = now - stats.mtime
	const ageInHours = ageInMs / (1000 * 60 * 60)
	if (ageInHours < 24) {
		console.log('Catalogs file exists and is less than 24 hours old. Skipping fetch.')
		process.exit(0)
	}
	console.log('Catalogs file exists but is older than 24 hours. Fetching catalogs...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file updated.')
		process.exit(0)
	})
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file created. Fetching catalogs...')
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
			process.exit(0)
		})
	})
}

export default fetchCatalogs

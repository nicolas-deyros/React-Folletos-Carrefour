import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = new URL('../tmp/catalogs.json', import.meta.url).pathname

console.log(
	`Catalogs fetched at ${new Date().toLocaleString('en-US', {
		timeZone: 'America/Argentina/Buenos_Aires',
	})}`
)

const updateCatalogs = () => {
	console.log('Scheduled job: Fetching catalogs...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file updated.')
		process.exit(0)
	})
}

if (fs.existsSync(filePath)) {
	console.log('Catalogs file exists. Fetching catalogs...')
	fetchCatalogs().then(() => {
		cron.schedule('00 12 * * *', updateCatalogs)
	})
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file created.')
		cron.schedule('00 12 * * *', updateCatalogs)
	})
}

export default fetchCatalogs

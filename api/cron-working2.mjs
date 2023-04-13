import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = new URL('../tmp/catalogs.json', import.meta.url).pathname

// Check if catalogs file exists and is less than 24 hours old
if (fs.existsSync(filePath)) {
	const stat = fs.statSync(filePath)
	const mtime = new Date(stat.mtime)
	const diffHours = (Date.now() - mtime) / 1000 / 60 / 60
	if (diffHours < 24) {
		console.log(`Catalogs file exists and is less than 24 hours old. Skipping fetch.`)
	} else {
		console.log(`Catalogs file exists but it's ${diffHours} hours old. Fetching catalogs...`)
		fetchCatalogs()
			.then(() => {
				console.log('Catalogs file updated.')
			})
			.catch((error) => {
				console.error('Error fetching catalogs:', error)
			})
	}
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs()
		.then(() => {
			console.log('Catalogs file created.')
		})
		.catch((error) => {
			console.error('Error fetching catalogs:', error)
		})
}

// Schedule a job to fetch catalogs every day at 12:00
cron.schedule('0 12 * * *', () => {
	console.log('Scheduled job: Fetching catalogs...')
	fetchCatalogs()
		.then(() => {
			console.log('Catalogs file updated.')
		})
		.catch((error) => {
			console.error('Error fetching catalogs:', error)
		})
})

export default fetchCatalogs

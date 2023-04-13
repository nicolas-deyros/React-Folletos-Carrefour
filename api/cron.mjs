import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const logStream = fs.createWriteStream(path.join(__dirname, 'logs.txt'), { flags: 'a' })

console.log = function (message) {
	logStream.write(`${new Date().toISOString()} - ${message}\n`)
	process.stdout.write(`${new Date().toISOString()} - ${message}\n`)
}

console.error = console.log

cron.schedule('00 12 * * *', () => {
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

import { fetchCatalogs } from './fetch-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = new URL('../src/data/catalogs.json', import.meta.url).pathname
const now = new Date()
const date = new Date()
console.log(
	`Catalogs fetched at ${date.toLocaleString('en-US', {
		timeZone: 'America/Argentina/Buenos_Aires',
	})}`
)

let task = null

if (fs.existsSync(filePath)) {
	console.log('Catalogs file exists. Fetching catalogs...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file updated.')
	})
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs()
		.then(() => {
			console.log('Catalogs file created. Fetching catalogs...')
			return fetchCatalogs()
		})
		.then(() => {
			console.log('Catalogs file updated.')
			if (typeof callback === 'function') {
				callback()
			}
		})
}

task = cron.schedule('* * * * * *', () => {
	console.log('Scheduled job: Fetching catalogs...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file updated.')
	})
})

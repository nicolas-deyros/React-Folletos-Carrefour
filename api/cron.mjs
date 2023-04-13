// import { fetchCatalogs } from './update-catalogs.js'
// import cron from 'node-cron'

// console.log('Starting cron job...')

// export default function startCronJob() {
// 	cron.schedule('* * * *', async () => {
// 		console.log('Updating catalogs...')
// 		const result = await fetchCatalogs()
// 		if (result.success) {
// 			console.log('Catalogs file updated.')
// 		} else {
// 			console.error(`Error updating catalogs: ${result.error}`)
// 		}
// 	})
// }

// console.log('Cron job scheduled.')
import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = new URL('../api/catalogs.json', import.meta.url).pathname
const now = new Date()
const date = new Date()
console.log(
	`Catalogs fetched at ${date.toLocaleString('en-US', {
		timeZone: 'America/Argentina/Buenos_Aires',
	})}`
)

if (fs.existsSync(filePath)) {
	console.log('Catalogs file exists. Fetching catalogs...')
	fetchCatalogs()
	cron.schedule('00 12 * * *', () => {
		console.log('Scheduled job: Fetching catalogs...')
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
			process.exit(0)
		})
	})
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file created. Fetching catalogs...')
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
			cron.schedule('00 12 * * *', () => {
				console.log('Scheduled job: Fetching catalogs...')
				fetchCatalogs().then(() => {
					console.log('Catalogs file updated.')
					process.exit(0)
				})
			})
		})
	})
}

import { fetchCatalogs } from '../../src/fetch-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = path.join(__dirname, '..', 'src', 'data', 'catalogs.json')

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
	let scheduledTasks = 1
	let completedTasks = 0
	const finish = () => {
		completedTasks++
		if (completedTasks === scheduledTasks) {
			console.log('All tasks completed. Exiting process...')
			process.exit()
		}
	}
	cron.schedule('00 11 * * *', () => {
		console.log('Scheduled job: Fetching catalogs...')
		scheduledTasks++
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
			finish()
		})
	})
} else {
	console.log('Catalogs file does not exist. Creating file...')
	fetchCatalogs().then(() => {
		console.log('Catalogs file created. Fetching catalogs...')
		let scheduledTasks = 1
		let completedTasks = 0
		const finish = () => {
			completedTasks++
			if (completedTasks === scheduledTasks) {
				console.log('All tasks completed. Exiting process...')
				process.exit()
			}
		}
		fetchCatalogs().then(() => {
			console.log('Catalogs file updated.')
			cron.schedule('00 11 * * *', () => {
				console.log('Scheduled job: Fetching catalogs...')
				scheduledTasks++
				fetchCatalogs().then(() => {
					console.log('Catalogs file updated.')
					finish()
				})
			})
			finish()
		})
	})
}
export default fetchCatalogs

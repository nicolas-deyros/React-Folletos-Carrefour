import { fetchCatalogs } from './fetch-catalogs.mjs'
import cron from 'node-cron'

console.log('Catalogs file does not exist. Creating file...')
fetchCatalogs().then(() => {
	// Run the function daily at 1:00 AM
	cron.schedule('0 1 * * *', () => {
		console.log('Scheduled job: Fetching catalogs...')
		fetchCatalogs()
	})
})

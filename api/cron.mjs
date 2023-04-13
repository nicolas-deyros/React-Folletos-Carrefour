import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'

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

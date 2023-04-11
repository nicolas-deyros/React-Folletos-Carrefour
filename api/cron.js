import { fetchCatalogs } from './update-catalogs.js'
import cron from 'node-cron'

export default function startCronJob() {
	cron.schedule('00 12 * * *', async () => {
		console.log('Updating catalogs...')
		const result = await fetchCatalogs()
		if (result.success) {
			console.log('Catalogs file updated.')
		} else {
			console.error(`Error updating catalogs: ${result.error}`)
		}
	})
}

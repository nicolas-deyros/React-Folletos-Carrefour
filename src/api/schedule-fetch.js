import { fetchCatalogs } from '../fetch-catalogs.mjs'
import cron from 'node-cron'

export default (req, res) => {
	// Schedule the fetchCatalogs job to run every day at 11:00 am
	cron.schedule('0 11 * * *', () => {
		console.log('Fetching catalogs...')
		fetchCatalogs().then(() => {
			console.log('Catalogs updated.')
		})
	})

	res.status(200).send('Catalogs fetch scheduled as requested.')
}

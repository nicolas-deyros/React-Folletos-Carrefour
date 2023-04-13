// import { fetchCatalogs } from './update-catalogs.js'
// import cron from 'node-cron'

// export default function startCronJob() {
// 	cron.schedule('00 12 * * *', async () => {
// 		console.log('Updating catalogs...')
// 		const result = await fetchCatalogs()
// 		if (result.success) {
// 			console.log('Catalogs file updated.')
// 		} else {
// 			console.error(`Error updating catalogs: ${result.error}`)
// 		}
// 	})
// }

import { fetchCatalogs } from './update-catalogs.js'
import cron from 'node-cron'
import redis from 'redis'

const client = redis.createClient()

const CATALOG_HASH_KEY = 'catalog_hash'

export default function startCronJob() {
	cron.schedule('00 12 * * *', async () => {
		console.log('Checking catalogs...')

		// Get the hash of the last fetched catalog file from the cache
		const lastHash = await new Promise((resolve, reject) => {
			client.get(CATALOG_HASH_KEY, (err, res) => {
				if (err) reject(err)
				else resolve(res)
			})
		})

		// Fetch the catalog file and calculate its hash
		const result = await fetchCatalogs()
		const currentHash = result.hash

		// If the hashes match, return the cached data
		if (lastHash === currentHash) {
			console.log('Catalogs have not changed.')
			return
		}

		// Update the cached hash and data if the file has changed
		await new Promise((resolve, reject) => {
			client.set(CATALOG_HASH_KEY, currentHash, (err) => {
				if (err) reject(err)
				else resolve()
			})
		})

		console.log('Updating catalogs...')
		if (result.success) {
			console.log('Catalogs file updated.')
		} else {
			console.error(`Error updating catalogs: ${result.error}`)
		}
	})
}

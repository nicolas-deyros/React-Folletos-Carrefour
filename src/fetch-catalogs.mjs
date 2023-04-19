import fs from 'fs'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

let isFetching = false

export const fetchCatalogs = async () => {
	const timeout = new Promise((resolve, reject) => {
		setTimeout(() => reject(new Error('Request timed out')), 30000) // 30 seconds timeout
	})

	try {
		console.log('Fetching catalogs...')
		let shouldFetch = true

		// Add isFetching flag
		isFetching = true

		if (fs.existsSync(DATA_FILE)) {
			const stats = fs.statSync(DATA_FILE)
			const hoursSinceLastFetch = (new Date() - stats.mtime) / 1000 / 60 / 60
			if (hoursSinceLastFetch < 24) {
				console.log(`Catalogs file exists and is less than 24 hours old. Skipping fetch.`)
				shouldFetch = false
			}
		}

		if (shouldFetch) {
			const [res, _] = await Promise.race([
				fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json'),
				timeout,
			])
			const data = await res.json()

			if (!fs.existsSync(DATA_FILE)) {
				fs.mkdirSync(DATA_DIR, { recursive: true })
			}

			await writeFile(DATA_FILE, JSON.stringify(data))
			console.log(`Catalogs file saved at ${DATA_FILE}`)

			// Set isFetching to false before returning data
			isFetching = false
			return data
		}

		// Set isFetching to false if shouldFetch is false
		isFetching = false
		return null // or throw new Error('Data not fetched')
	} catch (e) {
		console.error(e)
		// Set isFetching to false if an error occurs
		isFetching = false
		return null // or throw e
	}
}

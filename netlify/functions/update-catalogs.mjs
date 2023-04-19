import { promises as fs } from 'fs'
import fetch from 'node-fetch'
import cron from 'node-cron'
import path from 'path'

const handler = async (event, context) => {
	const DATA_DIR = path.join(process.cwd(), 'src', 'data')
	const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

	async function deleteCatalogsFile() {
		await fs.access(DATA_FILE)
		await fs.unlink(DATA_FILE)
		console.log('Catalogs file deleted.')
	}

	async function fetchCatalogs() {
		const response = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
		const catalogs = await response.json()
		await fs.writeFile(DATA_FILE, JSON.stringify(catalogs, null, 2))
		console.log('Catalogs file created.')
	}

	async function initCatalogs() {
		try {
			await deleteCatalogsFile()
		} catch (error) {
			console.log('No catalogs file to delete.')
		}
		await fetchCatalogs()
	}

	cron.schedule('0 0 * * *', initCatalogs)
}

export { handler }

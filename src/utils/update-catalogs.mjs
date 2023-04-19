import { promises as fs } from 'fs'
import fetch from 'node-fetch'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const DATA_FILE = path.join(DATA_DIR, 'catalogs.json')

async function deleteCatalogsFile() {
	try {
		await fs.access(DATA_FILE)
		await fs.unlink(DATA_FILE)
		console.log('Catalogs file deleted.')
	} catch (error) {
		console.log('No catalogs file to delete.')
	}
}

async function fetchCatalogs() {
	try {
		const response = await fetch('https://folletos.carrefour.com.ar/metadata/catalogs.json')
		const catalogs = await response.json()
		await fs.writeFile(DATA_FILE, JSON.stringify(catalogs, null, 2))
		console.log('Catalogs file created.')
	} catch (error) {
		console.error('Error fetching catalogs:', error)
	}
}

async function initCatalogs() {
	try {
		await fs.access(DATA_FILE)
		await deleteCatalogsFile()
	} catch (error) {
		console.log('No catalogs file to delete.')
	}
	await fetchCatalogs()
}

initCatalogs()

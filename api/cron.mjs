import { fetchCatalogs } from './update-catalogs.mjs'
import cron from 'node-cron'
import fs from 'fs'
import path from 'path'

const filePath = new URL('../tmp/catalogs.json', import.meta.url).pathname
const updateTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

async function updateCatalogs() {
	console.log('Fetching catalogs...')
	await fetchCatalogs()
	console.log('Catalogs file updated.')
}

async function fetchAndWriteCatalogs() {
	try {
		await updateCatalogs()
		const catalogs = await fetchCatalogs()
		const catalogsJSON = JSON.stringify(catalogs)
		fs.writeFileSync(filePath, catalogsJSON)
		console.log('Catalogs file written.')
	} catch (error) {
		console.error('Error updating catalogs:', error)
	}
}

async function initialize() {
	if (!fs.existsSync(filePath)) {
		await fetchAndWriteCatalogs()
	} else {
		const fileStat = fs.statSync(filePath)
		const timeSinceUpdate = Date.now() - fileStat.mtimeMs
		if (timeSinceUpdate >= updateTime) {
			await fetchAndWriteCatalogs()
		} else {
			console.log('Catalogs file exists and is less than 24 hours old. Skipping fetch.')
		}
	}
}

initialize()

cron.schedule('0 12 * * *', async () => {
	await fetchAndWriteCatalogs()
})

export default fetchCatalogs

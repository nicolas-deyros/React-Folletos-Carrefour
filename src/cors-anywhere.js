const cors_api_url = 'https://cors-anywhere.herokuapp.com/'
const target_url = 'https://folletos.carrefour.com.ar/metadata/catalogs.json'

fetch(cors_api_url + target_url)
	.then((response) => response.json())
	// .then((data) => console.log(data))
	.catch((error) => console.error(error))

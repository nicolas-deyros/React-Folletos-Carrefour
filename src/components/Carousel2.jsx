import React, { useState, useEffect } from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import '../cors-anywhere.js'
import Card2 from './Card2'

export default function Carousel2({ selectedState }) {
	const [catalogs, setCatalogs] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const [catalogs, setCatalogs] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				'https://cors-anywhere.herokuapp.com/https://folletos.carrefour.com.ar/metadata/catalogs.json'
			)
			const data = await response.json()
			// const filteredData = filterData(data, selectedState)
			const filteredData = data[selectedState]
			setCatalogs(filteredData)
			// setCatalogs(filteredData)
		}
		fetchData()
	}, [selectedState])

	return (
		<div>
			{catalogs.map((catalog, index) => (
				<div key={index}>
					<h2>{catalog.title}</h2>
					<img src={`https://folletos.carrefour.com.ar/${catalog.thumb}`} alt={catalog.title} />
				</div>
			))}
		</div>
	)
}

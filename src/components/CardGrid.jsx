import React, { useState, useEffect } from 'react'
import '../cors-anywhere.js'
import { Grid, GridItem, Box, Image, Text } from '@chakra-ui/react'

export default function CardGrid({ selectedState }) {
	const [catalogs, setCatalogs] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				'https://cors-anywhere.herokuapp.com/https://folletos.carrefour.com.ar/metadata/catalogs.json'
			)
			const data = await response.json()
			const filteredData = data[selectedState]
			setCatalogs(filteredData)
		}
		fetchData()
	}, [selectedState])

	console.log(catalogs)
	return selectedState === null || selectedState === undefined || selectedState === '' ? null : (
		<Grid
			templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
			gap={6}
			borderWidth='1px'
			borderRadius='lg'
			overflow='hidden'>
			{catalogs &&
				catalogs.map((catalog, index) => (
					<GridItem key={index} colSpan={{ base: 'auto', md: 1 }}>
						<Image src={`https://folletos.carrefour.com.ar/${catalog.thumb}`} alt={catalog.title} />
						<Box p='6'>
							<Text fontWeight='bold' fontSize='2xl' mb='2'>
								{catalog.title}
							</Text>
						</Box>
					</GridItem>
				))}
		</Grid>
	)
}

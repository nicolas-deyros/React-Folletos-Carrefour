import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import Card from './Card'

export default function Carousel({ selectedState }) {
	const responsive = {
		0: { items: 1 },
		568: { items: 2 },
		1024: { items: 3 },
	}

	const items = [
		<Card key='1' className='item' selectedState={selectedState} />,
		<Card key='2' className='item' selectedState={selectedState} />,
		<Card key='3' className='item' selectedState={selectedState} />,
	]

	return selectedState === null || selectedState === undefined || selectedState === '' ? null : (
		<AliceCarousel
			autoPlay
			disableAutoPlayControls
			autoPlayStrategy='none'
			autoPlayInterval={2000}
			animationDuration={5000}
			animationType='fadeout'
			infinite
			touchTracking={false}
			disableDotsControls
			disableButtonsControls
			mouseTracking
			items={items}
			responsive={responsive}
			controlsStrategy='alternate'
		/>
	)
}

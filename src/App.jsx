import React, { useState } from 'react'

import States from './components/States'
import Carousel from './components/Carousel'

export default function App() {
	const [selectedState, setSelectedState] = useState(null)

	const handleStateChange = (event) => {
		setSelectedState(event.target.value)
	}

	return (
		<>
			<States onStateChange={handleStateChange} />
			<Carousel selectedState={selectedState} />
		</>
	)
}

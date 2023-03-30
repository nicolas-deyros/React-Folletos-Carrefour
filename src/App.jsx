import React, { useState } from 'react'

import States from './components/States'
import CardGrid from './components/CardGrid'

export default function App() {
	const [selectedState, setSelectedState] = useState(null)

	const handleStateChange = (e) => {
		setSelectedState(e.target.value)
	}

	return (
		<>
			<States onStateChange={handleStateChange} />
			<CardGrid selectedState={selectedState} />
		</>
	)
}

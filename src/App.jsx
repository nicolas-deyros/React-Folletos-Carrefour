import React, { useState } from 'react'

import States from './components/States'
import CardGrid from './components/CardGrid'
import Header from './components/Header'

export default function App() {
	const [selectedState, setSelectedState] = useState(null)
	const [selectedLabel, setSelectedLabel] = useState(null)

	const handleStateChange = (e) => {
		setSelectedState(e.target.value)
		const selectedOption = e.target.options[e.target.selectedIndex]
		setSelectedLabel(selectedOption.label)
	}

	return (
		<>
			<Header />
			<States onStateChange={handleStateChange} />
			<CardGrid selectedState={selectedState} selectedLabel={selectedLabel} />
		</>
	)
}

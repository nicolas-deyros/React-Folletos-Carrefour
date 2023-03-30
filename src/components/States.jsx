import React from 'react'
import states from '../data/states.json'
import { Select } from '@chakra-ui/react'

export default function States({ onStateChange }) {
	return (
		<Select my={3} placeholder='Seleccione su provincia' onChange={onStateChange}>
			{states.map((state) => {
				return (
					<option key={state.id} value={state.id}>
						{state.provincia}
					</option>
				)
			})}
		</Select>
	)
}

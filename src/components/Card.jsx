import React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'

export default function CardUI({ selectedState }) {
	return (
		<Card>
			<CardBody>
				<Text>
					View a summary of all your customers over the last month in{' '}
					{selectedState ? selectedState : 'all provinces'}.
				</Text>
			</CardBody>
		</Card>
	)
}

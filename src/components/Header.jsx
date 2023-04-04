import React from 'react'
import { Box, Heading } from '@chakra-ui/react'
import headerBg from '../assets/header-bg.jpg'

export default function Header() {
	return (
		<>
			<Box
				backgroundImage={`url(${headerBg})`}
				backgroundSize='cover'
				height='300px'
				display='flex'
				alignItems='center'
				justifyContent='center'
				borderRadius='lg'
				boxShadow='lg'
				sx={{
					'@media (max-width: 768px)': {
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						height: '200px',
					},
				}}>
				<Heading as='h2' size='xl' color='white'>
					Folletos Carrefour
				</Heading>
			</Box>
		</>
	)
}

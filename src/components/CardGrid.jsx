import React, { useState, useEffect, useRef } from 'react'
import '../cors-anywhere.js'
import {
	Grid,
	GridItem,
	Box,
	Image,
	Text,
	Button,
	Flex,
	Modal,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'

export default function CardGrid({ selectedState, selectedLabel }) {
	const [catalogs, setCatalogs] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedCatalog, setSelectedCatalog] = useState(null)
	const [imageWidth, setImageWidth] = useState(0)
	const imageRef = useRef(null)

	const handleImageError = (event) => {
		event.target.src = placeholderImage
	}

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				'https://cors-anywhere.herokuapp.com/https://folletos.carrefour.com.ar/metadata/catalogs.json'
			)
			const data = await response.json()
			const filteredData = data[selectedState].filter((catalog) => {
				const now = new Date()
				const from = new Date(catalog.from)
				const to = new Date(catalog.to)
				return now >= from && now <= to
			})

			setCatalogs(filteredData)
		}
		fetchData()
	}, [selectedState])

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedCatalog(null)
	}

	const handleOpenModal = (catalog) => {
		setSelectedCatalog(catalog)
		setIsModalOpen(true)
	}

	const handleImageLoad = () => {
		if (imageRef.current) {
			const { height } = imageRef.current.getBoundingClientRect()
			const desiredHeight = 327
			const desiredWidth = 250
			setImageWidth((desiredWidth * height) / desiredHeight)
		}
	}

	const fallbackImage = 'https://placehold.co/250x327/png'

	return selectedState === null ||
		selectedState === undefined ||
		selectedState === '' ||
		catalogs.length === 0 ? (
		<Flex alignItems='center' justifyContent='center' height='100%'>
			<Alert status='warning'>
				<AlertIcon />
				<AlertDescription>
					No hay folletos disponibles en <b>{selectedLabel}</b>{' '}
				</AlertDescription>
			</Alert>
		</Flex>
	) : (
		<Grid
			key={selectedState}
			templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
			gap={6}
			borderWidth='1px'
			borderRadius='lg'
			overflow='hidden'
			py={3}
			justifyContent='center'
			alignItems='center'>
			{catalogs &&
				catalogs.map((catalog, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: index * 0.1 }}>
						<GridItem colSpan={{ base: 'auto', md: 1 }} gridColumn='auto'>
							<Flex direction='column' alignItems='center' justifyContent='center' height='100%'>
								<motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
									<Image
										src={`https://folletos.carrefour.com.ar/${catalog.thumb}`}
										alt={catalog.title}
										fallbackSrc={fallbackImage}
										height='327px'
										width={`${327 * (catalog.thumbWidth / catalog.thumbHeight)}px`}
									/>
								</motion.div>
								<Box p='6'>
									<Flex direction='column' alignItems='center' justifyContent='center'>
										<Text fontWeight='bold' fontSize='2xl' mb='2'>
											{catalog.title}
										</Text>
										<Button onClick={() => handleOpenModal(catalog)}>Ver Folleto</Button>
									</Flex>
								</Box>
							</Flex>
						</GridItem>
					</motion.div>
				))}
			{selectedCatalog && (
				<AnimatePresence>
					{isModalOpen && (
						<motion.div
							key={selectedCatalog.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20, transition: { delay: 0.2, duration: 0.3 } }}>
							<Modal
								isOpen={isModalOpen}
								onClose={handleCloseModal}
								size='full'
								motionPreset='scale'
								onCloseComplete={() => setSelectedCatalog(null)}>
								<ModalOverlay />
								<ModalContent>
									<ModalHeader zIndex='10' bg='white'>
										<Flex alignItems='center'>
											<Box>{selectedCatalog?.title}</Box>
											<ModalCloseButton zIndex='10' />
										</Flex>
									</ModalHeader>
									<ModalBody padding={0} height='100%' zIndex='0'>
										<motion.iframe
											style={{
												position: 'absolute',
												top: 0,
												bottom: 0,
												left: 0,
												right: 0,
												width: '100%',
												height: '100%',
												border: 'none',
												zIndex: '0',
											}}
											src={`https://folletos.carrefour.com.ar/${selectedCatalog?.link}`}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										/>
									</ModalBody>
								</ModalContent>
							</Modal>
						</motion.div>
					)}
				</AnimatePresence>
			)}
		</Grid>
	)
}

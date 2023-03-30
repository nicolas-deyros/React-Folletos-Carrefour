import React from 'react'
import '../cors-anywhere.js'

export default function Card2({ catalog }) {
	if (!catalog || catalog.length === 0) {
		return null
	}

	return (
		<>
			{catalog.map((item, index) => (
				<div className='item' key={index}>
					<h2>{item.title}</h2>
					<img src={`https://folletos.carrefour.com.ar/${item.thumb}`} alt={item.title} />
				</div>
			))}
		</>
	)
}

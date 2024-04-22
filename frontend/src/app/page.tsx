'use client';

import { useState } from 'react';
import HeroContainer from './components/heroContainer';
import MapContainer from './components/mapContainer';
import { ComparisonElement } from './types/similarityDataSet';
import CardContainer from './components/card/cardContainer';

export default function Home() {
	const [selectedState, setSelectedState] = useState<string | null>(null);
	const [selectedComparisonElement, setSelectedComparisonElement] =
		useState<ComparisonElement | null>(null);

	return (
		<main className="flex flex-col h-screen w-screen items-center">
			<HeroContainer />
			<div className="flex w-4/6 h-3/6">
				<MapContainer
					selectedState={selectedState}
					setSelectedState={setSelectedState}
				/>
				<CardContainer
					selectedState={selectedState}
					selectedComparisonElement={selectedComparisonElement}
					setSelectedComparisonElement={setSelectedComparisonElement}
				/>
			</div>
		</main>
	);
}

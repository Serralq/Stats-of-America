'use client';

import { useState } from 'react';
import { ComparisonElement } from '../types/similarityDataSet';
import HeroContainer from './heroContainer';
import MapContainer from './mapContainer';
import CardContainer from './card/cardContainer';
import { StateMap } from '../types/map';

export default function RootContainer({ stateMap }: { stateMap: StateMap }) {
	const [selectedState, setSelectedState] = useState<string | null>(null);
	const [selectedComparisonElement, setSelectedComparisonElement] =
		useState<ComparisonElement | null>(null);
	const [loadedComparisons, setLoadedComparisons] = useState<
		ComparisonElement[]
	>([]);

	return (
		<div className="h-full w-full flex items-center flex-col">
			<HeroContainer />
			<div className="flex w-4/6 h-3/6">
				<MapContainer
					selectedState={selectedState}
					setSelectedState={setSelectedState}
					loadedComparisons={loadedComparisons}
					setLoadedComparisons={setLoadedComparisons}
					stateMap={stateMap}
				/>
				<CardContainer
					selectedState={selectedState}
					selectedComparisonElement={selectedComparisonElement}
					setSelectedComparisonElement={setSelectedComparisonElement}
					loadedComparisons={loadedComparisons}
					setLoadedComparisons={setLoadedComparisons}
				/>
			</div>
		</div>
	);
}

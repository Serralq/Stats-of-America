'use client';

import { useState } from 'react';
import { Repo } from '../types/propsRepo';
import {
	ComparisonElement,
	SimilarityDataSet,
} from '../types/similarityDataSet';
import HeroContainer from './heroContainer';
import MapContainer from './mapContainer';
import CardContainer from './card/cardContainer';
import { StateMap } from '../types/map';

export default function RootContainer({
	stateMap,
	similarityDataSet,
}: {
	stateMap: StateMap;
	similarityDataSet: Map<string, ComparisonElement[]>;
}) {
	const [selectedState, setSelectedState] = useState<string | null>(null);
	const [selectedComparisonElement, setSelectedComparisonElement] =
		useState<ComparisonElement | null>(null);

	return (
		<div className='h-full w-full flex items-center flex-col'>
			<HeroContainer />
			<div className="flex w-4/6 h-3/6">
				<MapContainer
					selectedState={selectedState}
					setSelectedState={setSelectedState}
					stateMap={stateMap}
				/>
				<CardContainer
					selectedState={selectedState}
					selectedComparisonElement={selectedComparisonElement}
					setSelectedComparisonElement={setSelectedComparisonElement}
					similarityDataSet={similarityDataSet}
				/>
			</div>
		</div>
	);
}

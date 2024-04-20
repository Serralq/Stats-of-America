'use client';

import { useState } from 'react';
import HeroContainer from './components/heroContainer';
import MapContainer from './components/mapContainer';

export default function Home() {
	const [selectedState, setSelectedState] = useState<string | null>(null);

	return (
		<main className="flex flex-col h-screen w-screen items-center">
			<HeroContainer />
			<div className="flex w-4/6 h-3/6">
				<MapContainer
					selectedState={selectedState}
					setSelectedState={setSelectedState}
				/>
			</div>
		</main>
	);
}

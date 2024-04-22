'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { RenderableGeography } from '../types/map';
import { Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';
import { basicFetcher } from '../util/functions';
import { GEO_URL } from '../util/constants';

export default function MapContainer({
	selectedState,
	setSelectedState,
}: {
	selectedState: string | null;
	setSelectedState: Dispatch<SetStateAction<string | null>>;
}) {
	const { data, error, isLoading } = useSWR(GEO_URL, basicFetcher);

	return (
		<div className="bg-gray-700 mt-24 p-8 w-3/6 drop-shadow-sm rounded-md border-solid border-gray-600 border flex flex-col items-center">
			{isLoading && (
				<h3 className="text-gray-300 font-semibold">
					Loading state map data...
				</h3>
			)}
			{selectedState && !isLoading && (
				<h3 className="text-gray-300 font-semibold">
					Selected State: {selectedState}
				</h3>
			)}
			{!selectedState && !isLoading && (
				<h3 className="text-gray-300 font-semibold">
					Select a state to get started!
				</h3>
			)}
			{!isLoading && (
				<ComposableMap
					projection="geoAlbersUsa"
					projectionConfig={{ scale: 1100 }}
					className="w-full h-full"
				>
					<Geographies geography={data} key="states">
						{({ geographies }: { geographies: RenderableGeography[] }) =>
							geographies.map((geo, i) => (
								<Geography
									id={i.toString()}
									key={geo.rsmKey}
									geography={geo}
									onMouseDown={_ => {
										if (selectedState == geo.properties.name)
											return setSelectedState(null);
										else setSelectedState(geo.properties.name);
									}}
									fill={
										geo.properties.name != selectedState
											? 'rgb(31 41 55)'
											: 'rgb(75 85 99)'
									} // unselected: bg-gray-800; selected: bg-gray-600
									style={{
										default: { outline: 'none' },
										hover: { outline: 'none', fill: 'rgb(107 114 128)' }, // bg-gray-500
										pressed: { outline: 'none', fill: 'rgb(75 85 99)' }, // bg-gray-600
									}}
									stroke="rgb(156 163 175)" // bg-gray-400
								/>
							))
						}
					</Geographies>
				</ComposableMap>
			)}
		</div>
	);
}

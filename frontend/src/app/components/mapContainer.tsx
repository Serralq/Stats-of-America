'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { GEO_URL } from '../util/constants';
import { RenderableGeography } from '../types/map';
import { Dispatch, SetStateAction, useState } from 'react';

export default function MapContainer({
	selectedState,
	setSelectedState,
}: {
	selectedState: string | null;
	setSelectedState: Dispatch<SetStateAction<string | null>>;
}) {
	return (
		<div className="bg-gray-700 mt-24 p-8 drop-shadow-sm rounded-md border-solid border-gray-600 border flex flex-col items-center">
			{!selectedState ? (
				<h3 className="text-gray-300 font-semibold">
					Select a state to get started!
				</h3>
			) : (
				<h3 className="text-gray-300 font-semibold">
					Selected State: {selectedState}
				</h3>
			)}
			<ComposableMap
				projection="geoAlbersUsa"
				projectionConfig={{ scale: 1100 }}
				className="w-full h-full"
			>
				<Geographies geography={GEO_URL} key="states">
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
		</div>
	);
}

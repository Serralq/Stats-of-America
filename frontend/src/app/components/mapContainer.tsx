'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { GEO_URL } from '../util/constants';
import { RenderableGeography } from '../types/map';

export default function MapContainer() {
	return (
		<div className="bg-gray-700 mt-24 p-8 drop-shadow-sm rounded-md border-solid border-gray-600 border flex flex-col items-center">
			<h3 className="text-gray-300 font-semibold">
				Select a state to get started!
			</h3>
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
								fill="rgb(31 41 55)"
								style={{
									default: { outline: 'none' },
									hover: { outline: 'none' },
									pressed: { outline: 'none' },
								}}
								stroke="rgb(156 163 175)"
							/>
						))
					}
				</Geographies>
			</ComposableMap>
		</div>
	);
}

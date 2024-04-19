'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { GEO_URL } from '../util/constants';
import { RenderableGeography } from '../types/map';

export default function MapContainer() {
	return (
		<ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 400 }} style={{ height: '100%' }}>
			<Geographies geography={GEO_URL} key="states">
				{({ geographies }: { geographies: RenderableGeography[] }) => (
					geographies.map((geo, i) => (
						<Geography id={i.toString()} key={geo.rsmKey} geography={geo} fill='rgb(31 41 55)' stroke='rgb(156 163 175)' />
					))
				)
				}
			</Geographies>
		</ComposableMap>
	);
}
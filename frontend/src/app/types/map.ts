export interface StateMap {
	type: MapType;
	bbox: number[];
	transform: {
		scale: number[];
		translate: number[];
	};
	objects: {
		states: MapObject;
	};
	arcs: number[][];
}

export interface RenderableGeography extends Geometry {
	rsmKey: string;
	path: number[][];
}

type MapType = 'Topology' | 'GeometryCollection' | 'Polygon' | 'MultiPolygon';

interface MapObject {
	type: MapType;
	geometries: Geometry[];
}

interface Geometry {
	type: MapType;
	arcs: number[];
	id: string;
	properties: {
		name: string;
	};
}

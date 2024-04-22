import { StateMap } from '../types/map';
import {
	ComparisonElement,
	SimilarityDataSet,
} from '../types/similarityDataSet';
import { GEO_URL, STATE_ABBREVIATION_MAPPINGS } from './constants';

export async function getStateMap() {
	const res = await fetch(GEO_URL);
	return (await res.json()) as StateMap;
}

export async function getSimilarityDataForState(state: string) {
	const res = await fetch(
		`${process.env.API_BASE}/comparison/${STATE_ABBREVIATION_MAPPINGS[state]}`
	);
	return (await res.json()) as ComparisonElement[];
}

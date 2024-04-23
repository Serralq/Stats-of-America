import { StateMap } from '../types/map';
import { GEO_URL, STATE_ABBREVIATION_MAPPINGS } from './constants';

export async function getStateMap() {
	const res = await fetch(GEO_URL);
	return (await res.json()) as StateMap;
}

export function getStateFromAbbreviation(abbreviation: string) {
	for (const key in STATE_ABBREVIATION_MAPPINGS) {
		if (STATE_ABBREVIATION_MAPPINGS[key] == abbreviation)
			return key;
	}
}
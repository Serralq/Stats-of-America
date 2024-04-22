import RootContainer from './components/rootContainer';
import { ComparisonElement } from './types/similarityDataSet';
import { STATE_ABBREVIATION_MAPPINGS } from './util/constants';
import { getSimilarityDataForState, getStateMap } from './util/functions';

export default async function Home() {
	const stateMap = await getStateMap();
	const similarityDataSet: Map<string, ComparisonElement[]> = new Map();

	for (const state in STATE_ABBREVIATION_MAPPINGS) {
		const similarityData = await getSimilarityDataForState(state);
		similarityDataSet.set(state, similarityData);
	}

	return (
		<main className="flex flex-col h-screen w-screen items-center">
			<RootContainer
				stateMap={stateMap}
				similarityDataSet={similarityDataSet}
			/>
		</main>
	);
}

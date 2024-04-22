import RootContainer from './components/rootContainer';
import { ComparisonElement } from './types/similarityDataSet';
import { STATE_ABBREVIATION_MAPPINGS } from './util/constants';
import { getSimilarityDataForState, getStateMap } from './util/functions';

export default async function Home() {
	const stateMap = await getStateMap();

	return (
		<main className="flex flex-col h-screen w-screen items-center">
			<RootContainer stateMap={stateMap} />
		</main>
	);
}

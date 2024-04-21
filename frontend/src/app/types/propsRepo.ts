import { StateMap } from './map';
import { SimilarityDataSet } from './similarityDataSet';

export type Repo = {
	similarityDataSet: SimilarityDataSet;
	stateMap: StateMap;
};

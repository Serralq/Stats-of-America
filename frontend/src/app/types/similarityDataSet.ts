export interface SimilarityDataSet {
	[key: string]: {
		state: string;
		comparedData: [[string, string], [string, string]];
		path: [string, string];
		similarity: number;
	}[];
}

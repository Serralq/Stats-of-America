export interface SimilarityDataSet {
	[key: string]: ComparisonElement[];
}

export interface ComparisonElement {
	state: string;
	comparedData: [[string, string], [string, string]];
	path: [string, string];
	similarity: number;
}
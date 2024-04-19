export interface DataSet {
	[key: string]: {
	  state: string;
	  comparedData: [[string, string], [string, string]];
	  path: [string, string];
	  similarity: number;
	}[];
  }
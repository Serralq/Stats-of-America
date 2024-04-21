import { GetStaticProps } from 'next';
import { Repo } from '../types/propsRepo';
import { GEO_URL } from './constants';
import { StateMap } from '../types/map';
import { SimilarityDataSet } from '../types/similarityDataSet';

export const getStaticProps = (async context => {
	const mapFetch = await fetch(GEO_URL);
	const stateMap = (await mapFetch.json()) as StateMap;
	const comparisonsFetch = await fetch(`${process.env.API_BASE}/comparison`);
	const similarityDataSet =
		(await comparisonsFetch.json()) as SimilarityDataSet;
	return { props: { repo: { stateMap, similarityDataSet } } };
}) satisfies GetStaticProps<{
	repo: Repo;
}>;

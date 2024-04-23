import { ComparisonElement } from '@/app/types/similarityDataSet';
import { Dispatch, SetStateAction, useState } from 'react';
import Card from './card';
import useSWR from 'swr';
import { STATE_ABBREVIATION_MAPPINGS } from '@/app/util/constants';
import ChartDisplay from '../chart/chartDisplay';
import { getStateFromAbbreviation } from '@/app/util/functions';

const fetcher = (data: [string, number]) =>
	fetch(
		`${process.env.API_BASE}/partial_comparison/${
			STATE_ABBREVIATION_MAPPINGS[data[0]]
		}?page=${data[1]}`
	).then(res => res.json() as Promise<ComparisonElement[]>);

export default function CardContainer({
	selectedState,
	selectedComparisonElement,
	setSelectedComparisonElement,
	loadedComparisons,
	setLoadedComparisons,
	page,
	setPage,
}: {
	selectedState: string | null;
	selectedComparisonElement: ComparisonElement | null;
	setSelectedComparisonElement: Dispatch<
		SetStateAction<ComparisonElement | null>
	>;
	loadedComparisons: ComparisonElement[];
	setLoadedComparisons: Dispatch<SetStateAction<ComparisonElement[]>>;
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
}) {
	let shouldFetch = selectedState != null;
	const { data, isLoading } = useSWR(
		shouldFetch ? [selectedState!, page] : null,
		fetcher
	);

	if (!isLoading && data && loadedComparisons.length == 0) {
		setLoadedComparisons([...data]);
	} else if (!isLoading && data && loadedComparisons.length < page * 10) {
		setLoadedComparisons([...loadedComparisons, ...data]);
	}

	return (
		<div className="bg-gray-700 mt-24 ml-20 w-5/6 overflow-y-auto overflow-x-hidden justify-center drop-shadow-sm rounded-md border-solid border-gray-600 border flex flex-wrap items-center">
			{!selectedState && !selectedComparisonElement && (
				<h3 className="text-gray-300 font-semibold">
					Select a state to get started!
				</h3>
			)}
			{selectedState &&
				isLoading &&
				loadedComparisons.length == 0 &&
				!selectedComparisonElement && (
					<h3 className="text-gray-300 font-semibold">
						State comparison data loading...
					</h3>
				)}
			{selectedState &&
				!isLoading &&
				loadedComparisons.length == 0 &&
				!selectedComparisonElement && (
					<h3 className="text-gray-300 font-semibold">
						Could not fetch state data for {selectedState}!
					</h3>
				)}
			{selectedState &&
				loadedComparisons.length > 0 &&
				!selectedComparisonElement && (
					<>
						{loadedComparisons.map((e, i) => {
							return (
								<div key={i} className="p-3 pb-0 w-full">
									<Card
										comparisonElement={e}
										handleSelect={_ => {
											if (e != selectedComparisonElement)
												setSelectedComparisonElement(e);
										}}
									/>
								</div>
							);
						})}
						<button
							onClick={_ => setPage(page + 1)}
							className="p-2 m-2 text-gray-300 font-semibold bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-500 hover:border-gray-400 active:bg-gray-700 active:border-gray-600 shadow-sm"
						>
							{isLoading ? 'Loading More...' : 'Load More'}
						</button>
					</>
				)}
			{selectedComparisonElement && selectedState && (
				<div className="h-full w-full flex items-center justify-center">
					<div className="w-2/4">
						<ChartDisplay
							currentState={selectedState}
							selectedComparisonElement={selectedComparisonElement}
						/>
					</div>
					<div className="flex-1 items-center flex flex-col justify-end w-2/4 mx-3">
						<h3 className="text-gray-300 font-semibold">
							{selectedState} vs.{' '}
							{getStateFromAbbreviation(selectedComparisonElement.state)}
						</h3>
						<h3 className="text-gray-400 text-center mt-2">
							<strong>{selectedState} Data:</strong>{' '}
							{selectedComparisonElement.comparedData[0][0]} vs.{' '}
							{selectedComparisonElement.comparedData[0][1]}
						</h3>
						<h3 className="text-gray-400 text-center mt-2 mb-2">
							<strong>
								{getStateFromAbbreviation(selectedComparisonElement.state)}{' '}
								Data:
							</strong>{' '}
							{selectedComparisonElement.comparedData[1][0]} vs.{' '}
							{selectedComparisonElement.comparedData[1][1]}
						</h3>
						<button
							onClick={_ => setSelectedComparisonElement(null)}
							className="p-2 m-2 text-gray-300 font-semibold bg-gray-600 border border-gray-500 rounded-md hover:bg-gray-500 hover:border-gray-400 active:bg-gray-700 active:border-gray-600 shadow-sm"
						>
							Back
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

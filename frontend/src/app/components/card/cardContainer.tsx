import { ComparisonElement } from '@/app/types/similarityDataSet';
import { Dispatch, SetStateAction } from 'react';
import Card from './card';
import useSWR from 'swr';
import { basicFetcher } from '@/app/util/functions';
import { STATE_ABBREVIATION_MAPPINGS } from '@/app/util/constants';

export default function CardContainer({
	selectedState,
	selectedComparisonElement,
	setSelectedComparisonElement,
}: {
	selectedState: string | null;
	selectedComparisonElement: ComparisonElement | null;
	setSelectedComparisonElement: Dispatch<
		SetStateAction<ComparisonElement | null>
	>;
}) {
	let similarityData: ComparisonElement[] | undefined = undefined;
	let loadingData: boolean = false;
	if (selectedState) {
		const { data, isLoading } = useSWR(
			`${process.env.API_BASE}/comparison/${STATE_ABBREVIATION_MAPPINGS[selectedState]}`,
			basicFetcher
		);
		loadingData = isLoading;
		similarityData = data;
	}

	return (
		<div className="bg-gray-700 mt-24 ml-20 w-5/6 overflow-y-auto overflow-x-hidden drop-shadow-sm rounded-md border-solid border-gray-600 border flex flex-col items-center justify-center">
			{loadingData && (
				<h3 className="text-gray-300 font-semibold">
					Loading comparison data...
				</h3>
			)}
			{!selectedState && !loadingData && (
				<h3 className="text-gray-300 font-semibold">
					Select a state to get started!
				</h3>
			)}
			{selectedState && !loadingData && !similarityData && (
				<h3 className="text-gray-300 font-semibold">
					Could not load comparison data for {selectedState}!
				</h3>
			)}
			{selectedState &&
				!loadingData &&
				similarityData &&
				similarityData.map(e => (
					<Card
						comparisonElement={e}
						handleSelect={_ => {
							if (selectedComparisonElement != e)
								setSelectedComparisonElement(selectedComparisonElement);
							else setSelectedComparisonElement(null);
						}}
					/>
				))}
		</div>
	);
}

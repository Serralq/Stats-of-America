import {
	ComparisonElement,
	SimilarityDataSet,
} from '@/app/types/similarityDataSet';
import { Dispatch, SetStateAction } from 'react';
import Card from './card';

export default function CardContainer({
	selectedState,
	selectedComparisonElement,
	setSelectedComparisonElement,
	similarityDataSet,
}: {
	selectedState: string | null;
	selectedComparisonElement: ComparisonElement | null;
	setSelectedComparisonElement: Dispatch<
		SetStateAction<ComparisonElement | null>
	>;
	similarityDataSet: Map<string, ComparisonElement[]>;
}) {
	return (
		<div className="bg-gray-700 mt-24 ml-20 w-5/6 overflow-y-auto overflow-x-hidden justify-center drop-shadow-sm rounded-md border-solid border-gray-600 border flex flex-col items-center">
			{selectedState ? (
				similarityDataSet.get(selectedState)?.map(e => {
					return (
						<Card
							comparisonElement={e}
							handleSelect={_ => {
								if (e != selectedComparisonElement)
									setSelectedComparisonElement(e);
							}}
						/>
					);
				})
			) : (
				<h3 className="text-gray-300 font-semibold">
					Select a state to get started!
				</h3>
			)}
		</div>
	);
}
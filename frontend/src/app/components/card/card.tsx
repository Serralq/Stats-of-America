import { ComparisonElement } from '@/app/types/similarityDataSet';

export default function Card({
	comparisonElement,
	handleSelect,
}: {
	comparisonElement: ComparisonElement;
	handleSelect: (e: React.MouseEvent) => void;
}) {
	return (
		<div
			className="cursor-pointer h-full w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm p-1 flex justify-between hover:bg-gray-500 hover:border-gray-400 active:bg-gray-700 active:border-gray-600"
			onMouseDown={handleSelect}
		>
			<div className="flex-1 w-1/2 pl-2">
				<h3 className="text-gray-300 font-semibold">
					{comparisonElement.comparedData[0][0]} vs.{' '}
					{comparisonElement.comparedData[0][1]}
				</h3>
				<h4 className="text-gray-400">
					Compared against: {comparisonElement.comparedData[1][0]} vs.{' '}
					{comparisonElement.comparedData[1][1]}
				</h4>
			</div>
			<div className="flex-1 w-1/2 flex flex-col items-end pr-2">
				<h3 className="text-gray-300 font-semibold">
					State: {comparisonElement.state}
				</h3>
				<h3 className="text-gray-300 font-semibold">
					Similarity: {comparisonElement.similarity.toFixed(2)}
				</h3>
			</div>
		</div>
	);
}

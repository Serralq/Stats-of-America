import { DataSet } from '@/app/types/dataSet';
import { ComparisonElement } from '@/app/types/similarityDataSet';
import { STATE_ABBREVIATION_MAPPINGS } from '@/app/util/constants';
import useSWR from 'swr';
import D3Chart from './d3Chart';

const fetcher = async (data: [string, [string, string]]) => {
	const res = await fetch(`${process.env.API_BASE}/data/${data[0]}`, {
		method: 'POST',
		body: JSON.stringify({
			comparison: data[1],
		}),
	});
	return res.json() as Promise<DataSet>;
};

export default function ChartDisplay({
	currentState,
	selectedComparisonElement,
}: {
	currentState: string;
	selectedComparisonElement: ComparisonElement;
}) {
	const {
		data: currentStateData,
		isLoading: currentStateDataLoading,
		error: currentStateDataError,
	} = useSWR(
		[
			STATE_ABBREVIATION_MAPPINGS[currentState],
			selectedComparisonElement.comparedData[0],
		],
		fetcher
	);

	const {
		data: comparedStateData,
		isLoading: comparedStateDataLoading,
		error: comparedStateDataError,
	} = useSWR(
		[
			selectedComparisonElement.state,
			selectedComparisonElement.comparedData[1],
		],
		fetcher
	);

	return (
		<div className="h-full w-full flex items-center justify-center">
			{currentStateDataLoading ||
				(comparedStateDataLoading && (
					<h3 className="text-gray-300 font-semibold">Loading data...</h3>
				))}
			{!currentStateDataLoading &&
				!comparedStateDataLoading &&
				(currentStateDataError || comparedStateDataError) && (
					<h3 className="text-gray-300 font-semibold">Error loading data</h3>
				)}
			{currentStateData && comparedStateData && (
				<div className="h-fit w-fit bg-gray-800 px-10 border border-gray-600 rounded-md shadow-sm">
					<D3Chart datasets={[currentStateData, comparedStateData]} />
				</div>
			)}
		</div>
	);
}

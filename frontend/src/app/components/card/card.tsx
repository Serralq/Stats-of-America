import { ComparisonElement } from '@/app/types/similarityDataSet';

export default function Card({
	comparisonElement,
	handleSelect,
}: {
	comparisonElement: ComparisonElement;
	handleSelect: (e: React.MouseEvent) => void;
}) {
	return <div className="cursor-pointer" onMouseDown={handleSelect}></div>;
}

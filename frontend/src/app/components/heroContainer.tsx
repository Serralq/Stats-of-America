export default function HeroContainer() {
	return (
		<div className='bg-gray-700 mt-24 p-8 w-4/6 justify-center h-1/6 drop-shadow-sm rounded-md border-solid border-gray-600 border flex'>
			<div className='flex flex-col'>
				<h1 className='font-semibold text-6xl text-center text-gray-200'>
					Stats of America
				</h1>
				<h2 className='mt-2 text-center text-xl font-semibold bg-gradient-to-r from-red-500 to-blue-500 text-transparent bg-clip-text'>
					United we stand, divided we fall; we are unified by statistics.
				</h2>
			</div>
		</div>
	)
}
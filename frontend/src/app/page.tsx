import HeroContainer from './components/heroContainer';
import MapContainer from './components/mapContainer';

export default function Home() {
  return (
    <main className='flex flex-col h-screen w-screen items-center'>
		<HeroContainer />
		<div className='flex w-4/6 h-3/6'>
			<MapContainer />
		</div>
		{/* <div className='flex-1 flex items-center w-1/6 h-3/6 justify-center bg-slate-300'>
			<MapContainer />
		</div>
		<div className='flex-1'>

		</div> */}
	</main>
  );
}

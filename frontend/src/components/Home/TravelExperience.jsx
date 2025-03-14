import americaImg from '../../assets/wc1.webp';
import africaImg from '../../assets/wc1.webp';
import asiaImg from '../../assets/wc1.webp';
import europeImg from '../../assets/wc1.webp';

export default function TravelExperience(){
    const destinations = [
            { name: 'America', image: americaImg },
            { name: 'Africa', image: africaImg },
            { name: 'Asia', image: asiaImg },
            { name: 'Europe', image: europeImg },
          ];
    return(
        <div className="flex flex-col md:flex-row items-center justify-between  bg-gray-50  pl-40 pb-20 pt-20 pr-30">
      <div className="md:w-1/2 space-y-6">
        <h3 className="text-lg font-semibold text-indigo-600">Get To Know Us</h3>
        <h1 className="text-4xl font-bold text-gray-900">Get the Best Travel Experience</h1>

        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">✈️</div>
            <div>
              <h4 className="text-xl font-semibold">Best of Hotel</h4>
              <p className="text-gray-600">We don’t just work with concrete and steel. We work to be approachable, with even our highest standards.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-3xl">🌍</div>
            <div>
              <h4 className="text-xl font-semibold">Friendly Price</h4>
              <p className="text-gray-600">We don’t just work with concrete and steel. We work to be approachable, with even our highest standards.</p>
            </div>
          </div>
        </div>

        <button className="bg-gray-900 text-white px-6 py-3 rounded-full mt-4">FIND OUT MORE</button>
      </div>

      <div className="md:w-1/2 flex flex-wrap justify-center gap-4 mt-10 md:mt-0">
        {destinations.map((destination) => (
          <div key={destination.name} className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
            <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 text-white font-semibold text-sm">{destination.name}</span>
          </div>
        ))}
      </div>
    </div>
    )
}
import { useLocation } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';

function PaymentPage() {
  const location = useLocation();
  const billData = location.state?.billData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block bg-yellow-300 px-4 py-1 rounded-full mb-4">
            Explore the World
          </div>
          <h1 className="text-5xl font-bold mb-4">Secure Payments</h1>
          <h2 className="text-3xl font-semibold mb-6">Book with Confidence</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Easily manage your travel expenses with Pearlora's Secure Payment System. 
            Choose from multiple payment options, including credit card, PayPal, and 
            bank transfers, and complete your bookings with fast, safe, and hassle-free 
            transactions. Track your payment history, receive instant confirmations, and 
            enjoy a seamless travel experience with 100% secure payments. Your adventure 
            starts here!
          </p>
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex">
              {"★★★★★".split('').map((star, i) => (
                <span key={i} className="text-yellow-400 text-xl">{star}</span>
              ))}
            </div>
            <span className="text-gray-700 font-medium">5.0 Stars</span>
            <span className="text-gray-500">(2.5k Reviews)</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-100 rounded-full z-0"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-100 rounded-full z-0"></div>
          <img 
            src="/traveler.png" 
            alt="Happy Traveler" 
            className="relative z-10 w-full h-auto rounded-2xl shadow-xl"
          />
        </div>
      </div>
      <PaymentForm billData={billData} />
    </div>
  );
}

export default PaymentPage;
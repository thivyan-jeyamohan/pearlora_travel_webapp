import { paymentService } from '../api/paymentService';
import { paymentMethodService } from '../api/paymentMethodService';

function UserDashboard() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);

  useEffect(() => {
    fetchPaymentHistory();
    fetchPaymentMethods();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await paymentService.getAllPayments();
      setPaymentHistory(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentMethodService.getAllPaymentMethods();
      setSavedPaymentMethods(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    try {
      await paymentMethodService.deletePaymentMethod(id);
      setSavedPaymentMethods(methods => methods.filter(method => method._id !== id));
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    }
  };

  const handleRequestRefund = async (paymentId) => {
    try {
      await paymentService.updatePayment(paymentId, { status: 'refund_requested' });
      setPaymentHistory(payments => 
        payments.map(payment => 
          payment._id === paymentId 
            ? { ...payment, status: 'refund_requested' }
            : payment
        )
      );
    } catch (error) {
      console.error('Failed to request refund:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === 'completed' && (
                      <button
                        onClick={() => handleRequestRefund(payment._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Request Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saved Payment Methods */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPaymentMethods.map((method) => (
            <div key={method._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-500">Processing Fee: {method.processingFee}</p>
                </div>
                <button
                  onClick={() => handleDeletePaymentMethod(method._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
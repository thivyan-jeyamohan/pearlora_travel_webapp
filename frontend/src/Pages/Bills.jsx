import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { billService } from '../api/billService';
import { paymentService } from '../api/paymentService';
import { Link } from 'react-router-dom';

function Bills() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'asc' });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 6; // Show 6 bills per page for 2x3 grid

  const categories = [
    'Flight Booking',
    'Hotel Reservation',
    'Package Tour',
    'Transportation',
    'Travel Insurance',
    'Visa Services',
    'Excursions',
    'Cruise Booking',
    'Car Rental',
    'Travel Consultation'
  ];

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      const response = await billService.getAllBills();
      setBills(response.data.data);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePayment = async (bill) => {
    try {
      // First get the bill with populated user data
      const response = await billService.getBill(bill._id);
      const billWithUserData = response.data.data;
      
      // Ensure we have the user data before navigating
      if (!billWithUserData.userId) {
        throw new Error('No user data available for this bill');
      }
      
      navigate('/payment', { 
        state: { 
          billData: {
            ...billWithUserData,
            user: billWithUserData.userId // Include the full user object
          }
        } 
      });
    } catch (error) {
      console.error('Failed to fetch bill details:', error);
    }
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    return bills.reduce((acc, bill) => {
      acc.total += bill.amount;
      acc.count++;
      if (bill.status === 'Overdue') acc.overdue++;
      return acc;
    }, { total: 0, count: 0, overdue: 0 });
  }, [bills]);

  // Filter and sort bills
  const filteredBills = useMemo(() => {
    return bills
      .filter(bill => {
        const matchesSearch = searchTerm === '' ||
          bill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || bill.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'dueDate') {
          return sortConfig.direction === 'asc'
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  }, [bills, searchTerm, categoryFilter, statusFilter, sortConfig]);

  // Add pagination calculation
  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * billsPerPage;
    return filteredBills.slice(startIndex, startIndex + billsPerPage);
  }, [filteredBills, currentPage]);

  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadgeClass = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Paid': return `${baseClass} bg-green-100 text-green-800`;
      case 'Pending': return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'Overdue': return `${baseClass} bg-red-100 text-red-800`;
      case 'Cancelled': return `${baseClass} bg-gray-100 text-gray-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-20">


<div className='flex'>
  <Link to="/bills" className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-4xl hover:from-purple-600 hover:to-purple-800 transition-all">
    TO BE PAID
  </Link>
  <Link to="/payment-history" className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-4xl hover:from-purple-600 hover:to-purple-800 transition-all ml-4">
    PAYMENT HISTORY
  </Link>
</div>


      {/* Header with summary stats */}
      <div className="mb-8 mt-10">
        <h1 className="text-3xl font-bold mb-6">To Be Paid</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Outstanding</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">${summary.total.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Bills</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.count}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Overdue Bills</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">{summary.overdue}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search bills..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchBills}
            className="w-full px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Bills Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800"></div>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No bills match your criteria</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedBills.map((bill) => (
              <div key={bill._id} className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-1">{bill.category}</h2>
                      <p className="text-sm text-gray-500">{new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={getStatusBadgeClass(bill.status)}>{bill.status}</span>
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow">{bill.description}</p>
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Due Date</span>
                      <span className="font-medium text-gray-800">
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Amount</span>
                      <span className="font-semibold text-lg text-purple-800">
                        ${bill.amount.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePayment(bill)}
                      disabled={bill.status === 'Paid' || bill.status === 'Cancelled'}
                      className={`mt-6 w-full px-4 py-3 rounded-lg text-white transition-all ${
                        bill.status === 'Paid' || bill.status === 'Cancelled'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-purple-800 hover:bg-purple-700 transform hover:-translate-y-0.5'
                      }`}
                    >
                      {bill.status === 'Paid' 
                        ? 'Paid' 
                        : bill.status === 'Cancelled' 
                          ? 'Cancelled' 
                          : 'Pay Now'
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8 bg-white p-4 rounded-lg shadow-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-purple-800 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Category:</p>
                <p className="font-medium">{selectedBill.category}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount:</p>
                <p className="font-medium text-xl">${selectedBill.amount.toFixed(2)}</p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={paymentProcessing}
                  className="px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300"
                >
                  {paymentProcessing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bills;
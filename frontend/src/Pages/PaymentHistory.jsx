import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../api/paymentService';
import { BsPencil, BsTrash, BsDownload } from 'react-icons/bs';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';

// UpdateCardModal component
const UpdateCardModal = ({ isOpen, onClose, payment, onUpdate }) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: 'visa'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form with existing payment data when modal opens
  useEffect(() => {
    if (isOpen && payment) {
      setCardDetails(prev => ({
        ...prev,
        number: `**** **** **** ${payment.cardDetails?.lastFourDigits || ''}`,
        expiryMonth: payment.cardDetails?.expiryMonth || '',
        expiryYear: payment.cardDetails?.expiryYear || '',
        cvv: '',
        cardType: payment.cardDetails?.cardType || 'visa'
      }));
    }
  }, [isOpen, payment]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCardDetails({
        number: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardType: 'visa'
      });
      setError(null);
    }
  }, [isOpen]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  const detectCardType = (number) => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    const firstFourDigits = number.substring(0, 4);

    if (firstDigit === '4') return 'visa';
    if (firstTwoDigits >= '51' && firstTwoDigits <= '55') return 'mastercard';
    if (firstFourDigits === '6011' || firstTwoDigits === '65') return 'discover';
    if (firstTwoDigits === '34' || firstTwoDigits === '37') return 'amex';
    return 'unknown';
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    // Only allow editing if the number hasn't been masked
    if (!value.includes('****')) {
      const formattedValue = formatCardNumber(value);
      const cardType = detectCardType(value.replace(/\s+/g, ''));
      
      setCardDetails(prev => ({
        ...prev,
        number: formattedValue,
        cardType
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!cardDetails.number || !cardDetails.expiryMonth || 
          !cardDetails.expiryYear || !cardDetails.cvv) {
        throw new Error('Please fill in all card details');
      }

      const lastFourDigits = cardDetails.number.replace(/\s+/g, '').slice(-4);
      
      const updateData = {
        cardDetails: {
          lastFourDigits,
          expiryMonth: cardDetails.expiryMonth,
          expiryYear: cardDetails.expiryYear,
          cardType: cardDetails.cardType
        }
      };

      await onUpdate(payment._id, updateData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update card details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Show a fallback UI for completed payments
  if (payment?.status === 'completed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Completed</h2>
            <p className="text-gray-600 mb-4">
              This payment has been completed and cannot be modified.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Update Card Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={handleCardNumberChange}
                maxLength="19"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {cardDetails.cardType === 'visa' && 
                  <span className="text-blue-600 font-semibold">VISA</span>}
                {cardDetails.cardType === 'mastercard' && 
                  <span className="text-red-600 font-semibold">MasterCard</span>}
                {cardDetails.cardType === 'amex' && 
                  <span className="text-green-600 font-semibold">Amex</span>}
                {cardDetails.cardType === 'discover' && 
                  <span className="text-orange-600 font-semibold">Discover</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Month</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={cardDetails.expiryMonth}
                onChange={(e) => setCardDetails(prev => ({ ...prev, expiryMonth: e.target.value }))}
                required
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1;
                  return (
                    <option key={month} value={month < 10 ? `0${month}` : `${month}`}>
                      {month < 10 ? `0${month}` : month}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Year</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={cardDetails.expiryYear}
                onChange={(e) => setCardDetails(prev => ({ ...prev, expiryYear: e.target.value }))}
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails(prev => ({
                  ...prev,
                  cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 4)
                }))}
                maxLength="4"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white ${
                loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? 'Updating...' : 'Update Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function PaymentHistory() {
  const navigate = useNavigate();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const itemsPerPage = 10;
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, id: null });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.getAllPayments();
      setPaymentHistory(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    return paymentHistory.reduce((acc, payment) => {
      acc.total += payment.amount;
      acc.count++;
      if (!acc.methods[payment.method]) {
        acc.methods[payment.method] = 1;
      } else {
        acc.methods[payment.method]++;
      }
      return acc;
    }, { total: 0, count: 0, methods: {} });
  }, [paymentHistory]);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    return paymentHistory
      .filter(payment => {
        const matchesSearch = searchTerm === '' || 
          (payment.paymentMethod?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.status.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' 
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        return 0;
      });
  }, [paymentHistory, searchTerm, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadgeClass = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case 'completed': return `${baseClass} bg-green-100 text-green-800`;
      case 'pending': return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'failed': return `${baseClass} bg-red-100 text-red-800`;
      default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const handleEditPayment = (payment) => {
    if (payment.paymentMethod?.icon === 'credit-card' && payment.status !== 'completed') {
      setSelectedPayment(payment);
      setIsUpdateModalOpen(true);
    }
  };

  const handleUpdatePayment = async (paymentId, updateData) => {
    try {
      await paymentService.updatePayment(paymentId, updateData);
      fetchPaymentHistory(); // Refresh the list after update
    } catch (error) {
      console.error('Failed to update payment:', error);
      throw error;
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await paymentService.deletePayment(paymentId);
      fetchPaymentHistory(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete payment:', error);
    }
  };

  const handleDownloadReceipt = (payment) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200] // Standard receipt width (80mm) - typical thermal receipt size
    });
    
    // Set initial cursor position
    let y = 10;
    const leftMargin = 5;
    const width = 70; // Available width for content
    
    // Helper function for centered text
    const centerText = (text, y) => {
      const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const x = (width - textWidth) / 2 + leftMargin;
      doc.text(text, x, y);
    };
    
    // Helper function for left-right text
    const leftRightText = (leftText, rightText, y) => {
      doc.text(leftText, leftMargin, y);
      const rightTextWidth = doc.getStringUnitWidth(rightText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      doc.text(rightText, width - rightTextWidth + leftMargin, y);
    };

    // Helper function for drawing separator line
    const drawLine = (y) => {
      doc.setLineWidth(0.1);
      doc.line(leftMargin, y, width + leftMargin, y);
    };

    // Header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    centerText('PEARLORA', y);
    y += 5;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    centerText('Travel Payment Receipt', y);
    y += 5;
    
    centerText('----------------------------', y);
    y += 8;

    // Receipt details
    doc.setFontSize(8);
    
    // Transaction info
    doc.text(`Receipt #: ${payment.transactionId || payment._id}`, leftMargin, y);
    y += 4;
    doc.text(`Date: ${format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}`, leftMargin, y);
    y += 4;
    doc.text(`Status: ${payment.status.toUpperCase()}`, leftMargin, y);
    y += 6;

    drawLine(y);
    y += 6;

    // Payment Method
    if (payment.paymentMethod?.icon === 'credit-card' && payment.cardDetails) {
      doc.text('Payment Method:', leftMargin, y);
      y += 4;
      doc.text(`${payment.paymentMethod.name}`, leftMargin, y);
      y += 4;
      doc.text(`Card: **** **** **** ${payment.cardDetails.lastFourDigits}`, leftMargin, y);
      y += 4;
      doc.text(`Card Type: ${payment.cardDetails.cardType.toUpperCase()}`, leftMargin, y);
      y += 4;
      if (payment.cardHolderName) {
        doc.text(`Card Holder: ${payment.cardHolderName}`, leftMargin, y);
        y += 4;
      }
    } else {
      doc.text(`Payment Method: ${payment.paymentMethod?.name || 'N/A'}`, leftMargin, y);
      y += 4;
    }

    y += 2;
    drawLine(y);
    y += 6;

    // Amount
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    leftRightText('Amount:', `$${payment.amount.toFixed(2)}`, y);
    y += 6;

    drawLine(y);
    y += 6;

    // Billing Address
    if (payment.billingAddress) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Billing Address:', leftMargin, y);
      y += 4;
      if (payment.billingAddress.street) {
        doc.text(payment.billingAddress.street, leftMargin, y);
        y += 4;
      }
      if (payment.billingAddress.city || payment.billingAddress.zipCode) {
        doc.text(
          `${payment.billingAddress.city || ''} ${payment.billingAddress.zipCode || ''}`.trim(),
          leftMargin,
          y
        );
        y += 4;
      }
      if (payment.billingAddress.country) {
        doc.text(payment.billingAddress.country, leftMargin, y);
        y += 4;
      }
      y += 2;
      drawLine(y);
      y += 6;
    }

    // Contact Info
    doc.text(`Email: ${payment.email || 'N/A'}`, leftMargin, y);
    y += 4;
    doc.text(`Phone: ${payment.phoneNumber || 'N/A'}`, leftMargin, y);
    y += 6;

    drawLine(y);
    y += 6;

    // Footer
    doc.setFontSize(7);
    centerText('Thank you for your payment!', y);
    y += 3;
    centerText('For support: support@pearlora.com', y);
    y += 4;
    centerText('----------------------------', y);
    y += 4;
    const now = new Date();
    centerText(`Printed: ${format(now, 'MMM dd, yyyy HH:mm')}`, y);

    // Save the PDF
    doc.save(`receipt-${payment.transactionId || payment._id}.pdf`);
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

      {/* Header and Summary Stats */}
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment History</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Payments</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">${summary.total.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Number of Transactions</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{summary.count}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Average Payment</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              ${summary.count ? (summary.total / summary.count).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search payments..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button 
                onClick={fetchPaymentHistory}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800"></div>
          </div>
        ) : paginatedPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No payment history found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('date')}
                    >
                      Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('amount')}
                    >
                      Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.createdAt ? format(new Date(payment.createdAt), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.createdAt ? format(new Date(payment.createdAt), 'HH:mm') : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadgeClass(payment.status)}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentMethod?.name || 'Unknown Method'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.status === 'completed' ? (
                          <button 
                            onClick={() => handleDownloadReceipt(payment)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            title="Download Receipt"
                          >
                            <BsDownload />
                            <span>Receipt</span>
                          </button>
                        ) : (
                          payment.paymentMethod?.icon === 'credit-card' && 
                          payment.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleEditPayment(payment)} 
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit payment"
                              >
                                <BsPencil />
                              </button>
                              <button 
                                onClick={() => handleDeletePayment(payment._id)} 
                                className="text-red-600 hover:text-red-900 ml-2"
                                title="Delete payment"
                              >
                                <BsTrash />
                              </button>
                            </>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredPayments.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredPayments.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add UpdateCardModal */}
      <UpdateCardModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onUpdate={handleUpdatePayment}
      />
    </div>
  );
}

export default PaymentHistory;
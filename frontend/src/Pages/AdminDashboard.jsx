import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { BsCreditCard2Front, BsQrCode, BsBank, BsTrash, BsPencil, BsDownload, BsPlus, BsX, BsExclamationTriangle, BsFilePdf } from 'react-icons/bs';
import { paymentService } from '../api/paymentService';
import { paymentMethodService } from '../api/paymentMethodService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Initialize jsPDF with autotable plugin
window.jsPDF = jsPDF;

function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState({
    payments: true,
    methods: true
  });
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    name: '',
    description: '',
    isActive: true,
    processingFee: '',
    category: 'credit-card'
  });

  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [editingMethod, setEditingMethod] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ 
    show: false, 
    id: null,
    name: ''
  });

  const [currentMethodPage, setCurrentMethodPage] = useState(1);
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const methodsPerPage = 6; // 2x3 grid
  const paymentsPerPage = 10;

  const [statusConfirmation, setStatusConfirmation] = useState({ 
    show: false, 
    paymentId: null,
    currentStatus: '',
    newStatus: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchPaymentMethods();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getAllPayments();
      // Ensure we have valid payment data before setting state
      if (response.data?.data) {
        setPayments(response.data.data.map(payment => ({
          ...payment,
          paymentMethod: payment.paymentMethod || { name: 'Unknown', icon: null }
        })));
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setPayments([]);
    } finally {
      setLoading(prev => ({ ...prev, payments: false }));
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentMethodService.getAllPaymentMethods();
      if (response.data?.data) {
        setPaymentMethods(response.data.data.map(method => ({
          ...method,
          // Store the icon string value as category for form editing
          category: method.icon || 'credit-card',
          // Generate the React icon component based on the icon string
          icon: getMethodIcon(method.icon || 'credit-card')
        })));
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      setPaymentMethods([]);
    } finally {
      setLoading(prev => ({ ...prev, methods: false }));
    }
  };

  const getMethodIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'credit-card':
        return <BsCreditCard2Front />;
      case 'qr-code':
        return <BsQrCode />;
      case 'bank-transfer':
        return <BsBank />;
      default:
        return <BsCreditCard2Front />;
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      await paymentService.updatePayment(paymentId, { status: newStatus });
      setPayments(payments => 
        payments.map(payment => 
          payment._id === paymentId 
            ? { ...payment, status: newStatus }
            : payment
        )
      );
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await paymentService.deletePayment(paymentId);
      setPayments(payments => payments.filter(payment => payment._id !== paymentId));
    } catch (error) {
      console.error('Failed to delete payment:', error);
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    if (newMethod.name && newMethod.processingFee) {
      try {
        // Map category to icon for backend compatibility
        const methodToCreate = {
          ...newMethod,
          icon: newMethod.category // Map category to icon for backend
        };
        
        const response = await paymentMethodService.createPaymentMethod(methodToCreate);
        const createdMethod = response.data.data;
        setPaymentMethods([
          ...paymentMethods,
          {
            ...createdMethod,
            icon: getMethodIcon(createdMethod.icon || createdMethod.category || '')
          }
        ]);
        setNewMethod({
          name: '',
          description: '',
          isActive: true,
          processingFee: '',
          category: 'credit-card'
        });
        setShowMethodForm(false);
      } catch (error) {
        console.error('Failed to add payment method:', error);
      }
    }
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
  };

  const handleUpdateMethod = async (e) => {
    e.preventDefault();
    try {
      // Map category to icon for backend compatibility
      const methodToUpdate = {
        ...editingMethod,
        icon: editingMethod.category // Map category to icon for backend
      };
      
      const response = await paymentMethodService.updatePaymentMethod(editingMethod._id, methodToUpdate);
      
      setPaymentMethods(methods =>
        methods.map(method =>
          method._id === editingMethod._id
            ? { 
                ...method, 
                ...response.data.data,
                icon: getMethodIcon(response.data.data.icon || editingMethod.category || '')
              }
            : method
        )
      );
      setEditingMethod(null);
      setShowMethodForm(false);
    } catch (error) {
      console.error('Failed to update payment method:', error);
    }
  };

  const handleDeleteMethod = async (methodId) => {
    try {
      await paymentMethodService.deletePaymentMethod(methodId);
      setPaymentMethods(methods => methods.filter(method => method._id !== methodId));
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    }
  };

  const downloadSinglePaymentPDF = (payment) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Payment Receipt', 20, 20);
    
    // Add payment details
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${payment.transactionId || 'N/A'}`, 20, 40);
    doc.text(`Date: ${format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}`, 20, 50);
    doc.text(`Amount: $${payment.amount.toFixed(2)}`, 20, 60);
    doc.text(`Status: ${payment.status}`, 20, 70);
    doc.text(`Payment Method: ${payment.paymentMethod?.name || 'N/A'}`, 20, 80);
    doc.text(`Customer: ${payment.user?.email || 'N/A'}`, 20, 90);
    
    // Add billing address if available
    if (payment.billingAddress) {
      doc.text('Billing Address:', 20, 110);
      doc.text(payment.billingAddress.street || '', 30, 120);
      doc.text(`${payment.billingAddress.city || ''}, ${payment.billingAddress.zipCode || ''}`, 30, 130);
      doc.text(payment.billingAddress.country || '', 30, 140);
    }

    // Save the PDF
    doc.save(`payment-${payment.transactionId || payment._id}.pdf`);
  };

  // Create filtered payments list
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesDate = (!dateFilter.startDate || !dateFilter.endDate) ? true : 
        (new Date(payment.createdAt) >= new Date(dateFilter.startDate) &&
         new Date(payment.createdAt) <= new Date(dateFilter.endDate));
      
      const matchesMethod = methodFilter === 'all' ? true :
        payment.paymentMethod?._id === methodFilter;
      
      const matchesStatus = statusFilter === 'all' ? true :
        payment.status === statusFilter;

      return matchesDate && matchesMethod && matchesStatus;
    });
  }, [payments, dateFilter, methodFilter, statusFilter]);

  const generateReport = () => {
    // Filter payments based on all criteria
    const filteredPayments = payments.filter(payment => {
      const matchesDate = (!dateFilter.startDate || !dateFilter.endDate) ? true : 
        (new Date(payment.createdAt) >= new Date(dateFilter.startDate) &&
         new Date(payment.createdAt) <= new Date(dateFilter.endDate));
      
      const matchesMethod = methodFilter === 'all' ? true :
        payment.paymentMethod?._id === methodFilter;
      
      const matchesStatus = statusFilter === 'all' ? true :
        payment.status === statusFilter;

      return matchesDate && matchesMethod && matchesStatus;
    });

    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Payment Report', 20, 20);
    
    // Add filter information
    doc.setFontSize(10);
    if (dateFilter.startDate && dateFilter.endDate) {
      doc.text(`Period: ${format(new Date(dateFilter.startDate), 'MMM dd, yyyy')} - ${format(new Date(dateFilter.endDate), 'MMM dd, yyyy')}`, 20, 30);
    }
    
    // Add summary statistics
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    doc.setFontSize(12);
    doc.text(`Total Transactions: ${filteredPayments.length}`, 20, 40);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, 50);

    // Instead of autoTable, create a manual table
    // Table headers
    const headers = ['Date', 'Customer', 'Amount', 'Status', 'Method'];
    const colWidths = [30, 50, 30, 30, 40];
    let y = 70;
    
    // Draw headers
    doc.setFillColor(93, 56, 145); // purple-800
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    let x = 20;
    
    // Draw header background first
    doc.rect(x, y, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
    
    // Then draw header text
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], x + 5, y + 7);
      x += colWidths[i];
    }
    
    // Draw rows
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    y += 10;
    
    // Only include up to 20 records to avoid overcrowding
    const recordsToShow = filteredPayments.slice(0, 20);
    
    for (let j = 0; j < recordsToShow.length; j++) {
      const payment = recordsToShow[j];
      const rowData = [
        format(new Date(payment.createdAt), 'MMM dd, yyyy'),
        payment.user?.email || 'N/A',
        `$${payment.amount.toFixed(2)}`,
        payment.status,
        payment.paymentMethod?.name || 'N/A'
      ];
      
      // Add row background
      if (j % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, y, colWidths.reduce((a, b) => a + b, 0), 10, 'F');
      }
      
      // Add row content
      x = 20;
      for (let k = 0; k < rowData.length; k++) {
        doc.text(rowData[k], x + 5, y + 7, { maxWidth: colWidths[k] - 10 });
        x += colWidths[k];
      }
      y += 10;
      
      // Add new page if needed
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }
    
    // Add summary footer
    if (recordsToShow.length < filteredPayments.length) {
      y += 10;
      doc.text(`...and ${filteredPayments.length - recordsToShow.length} more records`, 20, y);
    }

    // Save the PDF
    doc.save('payment-report.pdf');
  };

  // Pagination for payment methods
  const paginatedMethods = useMemo(() => {
    const startIndex = (currentMethodPage - 1) * methodsPerPage;
    return paymentMethods.slice(startIndex, startIndex + methodsPerPage);
  }, [paymentMethods, currentMethodPage, methodsPerPage]);

  // Update pagination to use filtered payments
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPaymentPage - 1) * paymentsPerPage;
    return filteredPayments.slice(startIndex, startIndex + paymentsPerPage);
  }, [filteredPayments, currentPaymentPage, paymentsPerPage]);

  // Calculate total pages
  const totalMethodPages = Math.ceil(paymentMethods.length / methodsPerPage);
  const totalPaymentPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const handleMethodPageChange = (pageNumber) => {
    setCurrentMethodPage(pageNumber);
    window.scrollTo({ top: document.querySelector('#payment-methods').offsetTop - 100, behavior: 'smooth' });
  };

  const handlePaymentPageChange = (pageNumber) => {
    setCurrentPaymentPage(pageNumber);
    window.scrollTo({ top: document.querySelector('#payment-records').offsetTop - 100, behavior: 'smooth' });
  };

  const handleToggleMethodStatus = async (methodId, isActive) => {
    try {
      await paymentMethodService.updatePaymentMethod(methodId, { isActive });
      setPaymentMethods((methods) =>
        methods.map((method) =>
          method._id === methodId ? { ...method, isActive } : method
        )
      );
    } catch (error) {
      console.error('Failed to toggle payment method status:', error);
    }
  };

  const handleStatusToggle = (paymentId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    setStatusConfirmation({
      show: true,
      paymentId,
      currentStatus,
      newStatus
    });
  };

  const confirmStatusUpdate = async () => {
    try {
      await handleStatusUpdate(statusConfirmation.paymentId, statusConfirmation.newStatus);
      setStatusConfirmation({ show: false, paymentId: null, currentStatus: '', newStatus: '' });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-20">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg">Manage payment methods, view payment records, and generate reports with ease.</p>
      </div>

      {/* Payment Methods Management */}
      <div id="payment-methods" className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Payment Methods</h2>
          <button 
            onClick={() => setShowMethodForm(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 flex items-center space-x-2 shadow-md"
          >
            <BsPlus className="text-xl" />
            <span>Add Method</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading.methods ? (
            [...Array(3)].map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-gray-100 rounded-lg p-4 animate-pulse shadow-md">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))
          ) : paymentMethods && paymentMethods.length > 0 ? (
            paginatedMethods.map((method) => (
              <div key={method._id} className="bg-gray-50 rounded-lg p-6 shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={method.isActive}
                      onChange={(e) => handleToggleMethodStatus(method._id, e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Enabled</span>
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingMethod(method);
                        setShowMethodForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <BsPencil />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirmation({ show: true, id: method._id, name: method.name });
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <BsCreditCard2Front className="text-purple-800 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Payment Methods Available</h3>
              <p className="text-gray-500">Click the "Add Method" button to get started.</p>
            </div>
          )}
        </div>

        {/* Payment Methods Pagination */}
        {totalMethodPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handleMethodPageChange(currentMethodPage - 1)}
              disabled={currentMethodPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalMethodPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handleMethodPageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentMethodPage === index + 1
                    ? 'bg-purple-800 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handleMethodPageChange(currentMethodPage + 1)}
              disabled={currentMethodPage === totalMethodPages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Payments Management */}
      <div id="payment-records" className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Payment Records</h2>
            <button
              onClick={generateReport}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-500 flex items-center space-x-2 shadow-md"
            >
              <BsDownload />
              <span>Generate Report</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
              className="border rounded px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
              className="border rounded px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="border rounded px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Payment Methods</option>
              {paymentMethods.map(method => (
                <option key={method._id} value={method._id}>{method.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading.payments ? (
                [...Array(5)].map((_, index) => (
                  <tr key={`skeleton-payment-${index}`} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-7 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded-full w-5"></div>
                    </td>
                  </tr>
                ))
              ) : filteredPayments && filteredPayments.filter(payment => payment).length > 0 ? (
                paginatedPayments.filter(payment => payment).map((payment) => (
                  <tr key={payment?._id || Math.random()} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {payment?.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {payment?.createdAt ? format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      ${(payment?.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={payment?.status === 'completed'}
                          onChange={() => handleStatusToggle(payment?._id, payment?.status)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-700">
                          {payment?.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {payment?.paymentMethod?.name || 'Deleted Method'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadSinglePaymentPDF(payment)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Download PDF"
                        >
                          <BsFilePdf />
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment?._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Payment"
                        >
                          <BsTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <BsDownload className="text-purple-800 text-2xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No Payment Records Found</h3>
                      <p className="text-gray-500 max-w-md">
                        There are no payment records to display. Payment records will appear here once users make payments.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Payments Pagination */}
        {totalPaymentPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => handlePaymentPageChange(currentPaymentPage - 1)}
              disabled={currentPaymentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPaymentPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePaymentPageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPaymentPage === index + 1
                    ? 'bg-purple-800 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePaymentPageChange(currentPaymentPage + 1)}
              disabled={currentPaymentPage === totalPaymentPages}
              className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Payment Method Form Modal */}
      {showMethodForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </h3>
              <button 
                onClick={() => {
                  setShowMethodForm(false);
                  setEditingMethod(null);
                  setNewMethod({
                    name: '',
                    description: '',
                    isActive: true,
                    processingFee: '',
                    category: 'credit-card'
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <BsX className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={editingMethod ? handleUpdateMethod : handleAddPaymentMethod}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Method Name*
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={editingMethod ? editingMethod.name : newMethod.name}
                    onChange={(e) => {
                      if (editingMethod) {
                        setEditingMethod({...editingMethod, name: e.target.value});
                      } else {
                        setNewMethod({...newMethod, name: e.target.value});
                      }
                    }}
                    required
                    maxLength={50}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={editingMethod ? editingMethod.description || '' : newMethod.description}
                    onChange={(e) => {
                      if (editingMethod) {
                        setEditingMethod({...editingMethod, description: e.target.value});
                      } else {
                        setNewMethod({...newMethod, description: e.target.value});
                      }
                    }}
                    rows={3}
                    maxLength={200}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Fee (%)*
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={editingMethod ? editingMethod.processingFee : newMethod.processingFee}
                    onChange={(e) => {
                      if (editingMethod) {
                        setEditingMethod({...editingMethod, processingFee: e.target.value});
                      } else {
                        setNewMethod({...newMethod, processingFee: e.target.value});
                      }
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={editingMethod ? editingMethod.category || 'credit-card' : newMethod.category}
                    onChange={(e) => {
                      if (editingMethod) {
                        setEditingMethod({...editingMethod, category: e.target.value});
                      } else {
                        setNewMethod({...newMethod, category: e.target.value});
                      }
                    }}
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="qr-code">QR Code</option>
                    <option value="bank-transfer">Bank Transfer</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={editingMethod ? editingMethod.isActive : newMethod.isActive}
                    onChange={(e) => {
                      if (editingMethod) {
                        setEditingMethod({...editingMethod, isActive: e.target.checked});
                      } else {
                        setNewMethod({...newMethod, isActive: e.target.checked});
                      }
                    }}
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMethodForm(false);
                    setEditingMethod(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-800 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  {editingMethod ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Delete Payment Method</h3>
              <button 
                onClick={() => setDeleteConfirmation({ show: false, id: null, name: '' })}
                className="text-gray-500 hover:text-gray-700"
              >
                <BsX className="text-xl" />
              </button>
            </div>
            <div className="mb-4">
              <BsExclamationTriangle className="text-red-600 text-2xl mb-2" />
              <p className="text-gray-700">Are you sure you want to delete the payment method <strong>{deleteConfirmation.name}</strong>?</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation({ show: false, id: null, name: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteMethod(deleteConfirmation.id);
                  setDeleteConfirmation({ show: false, id: null, name: '' });
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Confirmation Modal */}
      {statusConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Update Payment Status</h3>
              <button 
                onClick={() => setStatusConfirmation({ show: false, paymentId: null, currentStatus: '', newStatus: '' })}
                className="text-gray-500 hover:text-gray-700"
              >
                <BsX className="text-xl" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-700">
                Are you sure you want to change the payment status from{' '}
                <span className="font-semibold">{statusConfirmation.currentStatus}</span> to{' '}
                <span className="font-semibold">{statusConfirmation.newStatus}</span>?
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStatusConfirmation({ show: false, paymentId: null, currentStatus: '', newStatus: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
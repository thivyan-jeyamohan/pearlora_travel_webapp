import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as QRCodeModule from 'qrcode.react';
import { BsCreditCard2Front, BsBank } from 'react-icons/bs';
import { paymentService } from '../api/paymentService';
import { userService } from '../api/userService';
import { paymentMethodService } from '../api/paymentMethodService';

function PaymentForm({ billData }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    cardHolderName: '',
    billingAddress: {
      street: '',
      city: '',
      zipCode: '',
      country: ''
    },
    sameAsShipping: false,
    cardDetails: {
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardType: 'visa'
    }
  });

  const [paymentType, setPaymentType] = useState(null); // 'card' or 'bank'
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [allPaymentMethods, setAllPaymentMethods] = useState([]);

  useEffect(() => {
    // Fetch all payment methods initially
    const fetchAllPaymentMethods = async () => {
      setLoadingMethods(true);
      try {
        const response = await paymentMethodService.getAllPaymentMethods();
        if (response.data?.success && response.data?.data) {
          setAllPaymentMethods(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch payment methods:', err);
        
      } finally {
        setLoadingMethods(false);
      }
    };

    fetchAllPaymentMethods();
  }, []);

  useEffect(() => {
    if (!paymentType || allPaymentMethods.length === 0) return;

    // Filter methods based on selected type
    const filteredMethods = allPaymentMethods.filter(method =>
      paymentType === 'card' ? method.icon === 'credit-card' : method.icon === 'bank-transfer'
    );
    setPaymentMethods(filteredMethods);
    setSelectedMethod(null);
  }, [paymentType, allPaymentMethods]);

  const renderPaymentMethodFallback = () => {
    if (loadingMethods) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      );
    }

    if (allPaymentMethods.length === 0) {
      return (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
            <BsBank className="text-2xl text-purple-800" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Methods Available</h3>
          <p className="text-gray-500 mb-4">Please contact support to set up payment methods.</p>
          <a
            href="mailto:support@pearlora.com"
            className="inline-flex items-center text-sm text-purple-800 hover:text-purple-900"
          >
            Contact Support
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      );
    }

    if (paymentType && paymentMethods.length === 0) {
      return (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
            {paymentType === 'card' ? (
              <BsCreditCard2Front className="text-2xl text-yellow-800" />
            ) : (
              <BsBank className="text-2xl text-yellow-800" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {paymentType === 'card' ? 'Card Payment' : 'Bank Transfer'} Methods Available
          </h3>
          <p className="text-gray-500 mb-4">
            Try selecting a different payment type or contact support for assistance.
          </p>
          <button
            type="button"
            onClick={() => setPaymentType(null)}
            className="text-sm text-purple-800 hover:text-purple-900 underline"
          >
            Select Different Payment Type
          </button>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the user data from either the nested userId object or the user object
        const userData = billData?.userId || billData?.user;

        if (userData) {
          setFormData(prev => ({
            ...prev,
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            cardHolderName: userData.name || ''
          }));
        }
      } catch (err) {
        console.error('Failed to process user data:', err);
      }
    };

    if (billData) {
      fetchUserData();
    }
  }, [billData]);

  // Format card number with spaces (e.g., 1234 5678 9012 3456)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Get card type based on the first few digits
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

  // Handle card input changes with formatting
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCardNumber(value);
    const cardType = detectCardType(value.replace(/\s+/g, ''));

    setFormData({
      ...formData,
      cardDetails: {
        ...formData.cardDetails,
        number: formattedValue,
        cardType
      }
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userId = billData?.userId || billData?.user?._id;
      if (!userId) {
        throw new Error('No user ID available');
      }

      if (!selectedMethod) {
        throw new Error('Please select a payment method');
      }

      // Check if card payment and validate card details
      const selectedMethodObj = paymentMethods.find(method => method._id === selectedMethod);
      if (selectedMethodObj?.icon === 'credit-card') {
        if (!formData.cardDetails.number || !formData.cardDetails.expiryMonth ||
            !formData.cardDetails.expiryYear || !formData.cardDetails.cvv) {
          throw new Error('Please fill in all card details');
        }
      }

      // Extract last four digits of card number for secure storage
      const lastFourDigits = formData.cardDetails.number ?
        formData.cardDetails.number.replace(/\s+/g, '').slice(-4) : '';

      const paymentData = {
        bill: billData._id,
        user: userId,
        amount: billData.amount,
        description: billData.description,
        paymentMethod: selectedMethod,
        cardHolderName: formData.cardHolderName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        billingAddress: formData.billingAddress
      };

      // Only include card details for card payments
      if (selectedMethodObj?.icon === 'credit-card') {
        paymentData.cardDetails = {
          lastFourDigits,
          expiryMonth: formData.cardDetails.expiryMonth,
          expiryYear: formData.cardDetails.expiryYear,
          cardType: formData.cardDetails.cardType
        };
      }

      const response = await paymentService.createPayment(paymentData);

      if (response.data.success) {
        // Navigate to payment success page or show success message
        navigate('/payment-success', {
          state: {
            paymentId: response.data.data._id,
            transactionId: response.data.data.transactionId
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code data with fixed bank details
  const generateQRCodeData = () => {
    const qrData = {
      merchantName: 'Pearlora Travel',
      bankName: 'Commercial Bank',
      accountNumber: '1234567890',
      branchCode: '001',
      swiftCode: 'CCEYLKLX',
      accountHolderName: 'Pearlora Travel (Pvt) Ltd',
      amount: billData.amount.toFixed(2), // Corrected from amount感应
      currency: 'USD',
      reference: `BILL-${billData._id}`,
      description: billData.description || ''
    };
    const qrString = JSON.stringify(qrData);
    console.log('QR Code Data:', qrString); // Debug log
    return qrString;
  };

  if (!billData) {
    return <div className="text-red-600">No bill data provided</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
      <div className="space-y-6">
        <div className="bg-purple-800 text-white px-6 py-3 rounded-full inline-block">
          <h3 className="text-lg font-semibold">Bill Details</h3>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Category</p>
              <p className="font-medium text-xl">{billData.category}</p>
            </div>
            <div>
              <p className="text-gray-600">Amount to Pay</p>
              <p className="font-bold text-2xl text-purple-800">${billData.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Due Date</p>
              <p className="font-medium">{new Date(billData.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Description</p>
              <p className="font-medium">{billData.description}</p>
            </div>
          </div>
        </div>

        {/* Bank Transfer QR Code Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Bank Transfer Details</h3>
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <QRCode
                value={generateQRCodeData()}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Scan QR code with your banking app</p>
              <p className="text-xs text-gray-500">to make the payment</p>
            </div>
            <div className="w-full space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank:</span>
                <span className="font-medium">Commercial Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">Pearlora Travel (Pvt) Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-medium">1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch Code:</span>
                <span className="font-medium">001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Swift Code:</span>
                <span className="font-medium">CCEYLKLX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-purple-800">${billData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium">BILL-{billData._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Example@youremail.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <input
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+94 123 456 789"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentType('card')}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                paymentType === 'card'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <BsCreditCard2Front className="text-2xl mb-2" />
              <p className="font-medium">Card Payment</p>
            </div>
            <div
              onClick={() => setPaymentType('bank')}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                paymentType === 'bank'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <BsBank className="text-2xl mb-2" />
              <p className="font-medium">Bank Transfer</p>
            </div>
          </div>
        </div>

        {paymentType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Payment Method</label>
            {renderPaymentMethodFallback() || (
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method._id}
                    onClick={() => setSelectedMethod(method._id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method._id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      {method.processingFee > 0 && (
                        <span className="text-sm text-gray-500">
                          Fee: {method.processingFee}%
                        </span>
                      )}
                    </div>

                    {/* Show QR code for selected bank transfer method */}
                    {selectedMethod === method._id &&
                     method.icon === 'bank-transfer' && (
                      <div className="mt-4 flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <QRCode
                            value={generateQRCodeData()}
                            size={200}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">Scan QR code with your banking app</p>
                          <p className="text-xs text-gray-500">or mobile wallet to make the payment</p>
                        </div>
                        <div className="w-full space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bank:</span>
                            <span className="font-medium">{method.bankName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account:</span>
                            <span className="font-medium">{method.accountNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">${billData.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Reference:</span>
                            <span className="font-medium">BILL-{billData._id}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Card Details Section - Only show if card payment is selected */}
        {paymentType === 'card' && selectedMethod && (
          <div className="space没了-6">
            <h3 className="text-lg font-semibold text-gray-800">Card Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardDetails.number}
                  onChange={handleCardNumberChange}
                  maxLength="19"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {formData.cardDetails.cardType === 'visa' &&
                    <span className="text-blue-600 font-semibold">VISA</span>}
                  {formData.cardDetails.cardType === 'mastercard' &&
                    <span className="text-red-600 font-semibold">MasterCard</span>}
                  {formData.cardDetails.cardType === 'amex' &&
                    <span className="text-green-600 font-semibold">Amex</span>}
                  {formData.cardDetails.cardType === 'discover' &&
                    <span className="text-orange-600 font-semibold">Discover</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Month</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.cardDetails.expiryMonth}
                  onChange={(e) => setFormData({
                    ...formData,
                    cardDetails: {
                      ...formData.cardDetails,
                      expiryMonth: e.target.value
                    }
                  })}
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
                  value={formData.cardDetails.expiryYear}
                  onChange={(e) => setFormData({
                    ...formData,
                    cardDetails: {
                      ...formData.cardDetails,
                      expiryYear: e.target.value
                    }
                  })}
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
                  value={formData.cardDetails.cvv}
                  onChange={(e) => setFormData({
                    ...formData,
                    cardDetails: {
                      ...formData.cardDetails,
                      cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 4)
                    }
                  })}
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card holder name</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex. Joy Lawson"
            value={formData.cardHolderName}
            onChange={(e) => setFormData({...formData, cardHolderName: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Billing address</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Street address"
            value={formData.billingAddress.street}
            onChange={(e) => setFormData({
              ...formData,
              billingAddress: {...formData.billingAddress, street: e.target.value}
            })}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={formData.billingAddress.country}
              onChange={(e) => setFormData({
                ...formData,
                billingAddress: {...formData.billingAddress, country: e.target.value}
              })}
              required
            >
              <option value="">Select</option>
              <option value="LK">Sri Lanka</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex. Colombo"
              value={formData.billingAddress.city}
              onChange={(e) => setFormData({
                ...formData,
                billingAddress: {...formData.billingAddress, city: e.target.value}
              })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip code</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex. 75923"
              value={formData.billingAddress.zipCode}
              onChange={(e) => setFormData({
                ...formData,
                billingAddress: {...formData.billingAddress, zipCode: e.target.value}
              })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedMethod}
          className={`w-full ${
            loading || !selectedMethod
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-gray-800'
          } text-white py-4 px-6 rounded-lg transition-colors`}
        >
          {loading ? 'Processing...' : `Pay $${billData.amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

export default PaymentForm;
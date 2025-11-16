'use client';

import { useState } from 'react';
import { X, CreditCard, Shield, Info } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    price: number;
    landlord: string;
  };
  onPaymentSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, property, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const annualRent = property.price;
  const cautionFee = annualRent * 0.5; // 50% of annual rent as caution fee
  const platformFee = annualRent * 0.1; // 10% platform fee
  const totalAmount = annualRent + cautionFee + platformFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate Paystack integration
    try {
      // In real implementation, this would integrate with Paystack API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      onPaymentSuccess();
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Property Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-900">{property.title}</h3>
            <p className="text-sm text-gray-600">Landlord: {property.landlord}</p>
          </div>

          {/* Payment Breakdown */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Payment Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Rent</span>
                <span className="font-medium">₦{annualRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Caution Fee (Security Deposit)</span>
                <span className="font-medium">₦{cautionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee (10%)</span>
                <span className="font-medium">₦{platformFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Caution Fee Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Caution Fee</p>
                <p>Your caution fee is held in escrow and will be refunded after your lease ends, provided there's no property damage.</p>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <span>Debit/Credit Card</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>Bank Transfer</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ussd"
                  checked={paymentMethod === 'ussd'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>USSD</span>
              </label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800 font-medium">
                Secured by Paystack - Your payment is protected
              </span>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ₦${totalAmount.toLocaleString()}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

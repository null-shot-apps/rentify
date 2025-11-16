// Paystack payment integration for Nigerian users
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_paystack_secret_key';
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key';
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Paystack API client
const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Initialize payment transaction
export const initializePayment = async (paymentData) => {
  try {
    const { email, amount, reference, metadata = {} } = paymentData;
    
    const response = await paystackAPI.post('/transaction/initialize', {
      email,
      amount: Math.round(amount * 100), // Convert to kobo (Paystack uses kobo)
      reference,
      currency: 'NGN',
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: "Payment Type",
            variable_name: "payment_type",
            value: metadata.payment_type || "rental"
          },
          {
            display_name: "Property ID",
            variable_name: "property_id", 
            value: metadata.property_id || ""
          }
        ]
      }
    });

    return {
      success: true,
      data: response.data.data,
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference
    };
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Payment initialization failed'
    };
  }
};

// Verify payment transaction
export const verifyPayment = async (reference) => {
  try {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);
    
    return {
      success: true,
      data: response.data.data,
      status: response.data.data.status,
      amount: response.data.data.amount / 100, // Convert from kobo to naira
      customer: response.data.data.customer,
      metadata: response.data.data.metadata
    };
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Payment verification failed'
    };
  }
};

// Create transfer recipient (for paying landlords)
export const createTransferRecipient = async (recipientData) => {
  try {
    const { name, account_number, bank_code, currency = 'NGN' } = recipientData;
    
    const response = await paystackAPI.post('/transferrecipient', {
      type: 'nuban',
      name,
      account_number,
      bank_code,
      currency
    });

    return {
      success: true,
      data: response.data.data,
      recipient_code: response.data.data.recipient_code
    };
  } catch (error) {
    console.error('Create recipient error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create transfer recipient'
    };
  }
};

// Initiate transfer (pay landlords)
export const initiateTransfer = async (transferData) => {
  try {
    const { amount, recipient, reason, reference } = transferData;
    
    const response = await paystackAPI.post('/transfer', {
      source: 'balance',
      amount: Math.round(amount * 100), // Convert to kobo
      recipient,
      reason,
      reference
    });

    return {
      success: true,
      data: response.data.data,
      transfer_code: response.data.data.transfer_code,
      status: response.data.data.status
    };
  } catch (error) {
    console.error('Transfer error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Transfer failed'
    };
  }
};

// Get Nigerian banks list
export const getNigerianBanks = async () => {
  try {
    const response = await paystackAPI.get('/bank?country=nigeria');
    
    return {
      success: true,
      banks: response.data.data
    };
  } catch (error) {
    console.error('Get banks error:', error.response?.data || error.message);
    return {
      success: false,
      error: 'Failed to fetch banks list'
    };
  }
};

// Resolve bank account details
export const resolveAccountNumber = async (account_number, bank_code) => {
  try {
    const response = await paystackAPI.get(
      `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`
    );
    
    return {
      success: true,
      data: response.data.data,
      account_name: response.data.data.account_name,
      account_number: response.data.data.account_number
    };
  } catch (error) {
    console.error('Resolve account error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to resolve account details'
    };
  }
};

// Calculate platform fees
export const calculateFees = (annualRent, hasMarketer = false) => {
  const cautionFee = annualRent * 0.1; // 10% of annual rent as security deposit
  
  let platformFeeRate, marketerCommissionRate;
  
  if (hasMarketer) {
    platformFeeRate = 0.04; // 4% to platform
    marketerCommissionRate = 0.06; // 6% to marketer
  } else {
    platformFeeRate = 0.10; // 10% to platform (no marketer)
    marketerCommissionRate = 0;
  }
  
  const platformFee = annualRent * platformFeeRate;
  const marketerCommission = annualRent * marketerCommissionRate;
  const totalFees = platformFee + marketerCommission;
  
  return {
    annualRent,
    cautionFee,
    platformFee,
    marketerCommission,
    totalFees,
    totalPayment: annualRent + cautionFee + totalFees,
    breakdown: {
      rent: annualRent,
      security_deposit: cautionFee,
      platform_fee: platformFee,
      marketer_commission: marketerCommission,
      total: annualRent + cautionFee + totalFees
    }
  };
};

// Generate unique payment reference
export const generatePaymentReference = (prefix = 'RD') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

// Format amount for display (Nigerian Naira)
export const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Webhook signature verification
export const verifyWebhookSignature = (payload, signature) => {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
};

// Handle payment webhook events
export const handleWebhookEvent = async (event) => {
  const { event: eventType, data } = event;
  
  switch (eventType) {
    case 'charge.success':
      // Payment successful - update rental record
      console.log('Payment successful:', data.reference);
      return { success: true, action: 'payment_confirmed' };
      
    case 'transfer.success':
      // Transfer to landlord successful
      console.log('Transfer successful:', data.reference);
      return { success: true, action: 'transfer_confirmed' };
      
    case 'transfer.failed':
      // Transfer failed - need to retry or refund
      console.log('Transfer failed:', data.reference);
      return { success: true, action: 'transfer_failed' };
      
    default:
      console.log('Unhandled webhook event:', eventType);
      return { success: true, action: 'ignored' };
  }
};

// Escrow management functions
export const EscrowManager = {
  // Hold caution fee in escrow
  async holdCautionFee(rentalId, amount, reference) {
    // In production, this would integrate with a proper escrow service
    // For now, we'll track it in our database
    return {
      success: true,
      escrow_id: `ESC_${reference}`,
      amount,
      status: 'held'
    };
  },

  // Release caution fee to tenant (no damages)
  async releaseCautionFeeToTenant(escrowId, tenantBankDetails) {
    try {
      // Create transfer recipient for tenant
      const recipient = await createTransferRecipient({
        name: tenantBankDetails.account_name,
        account_number: tenantBankDetails.account_number,
        bank_code: tenantBankDetails.bank_code
      });

      if (!recipient.success) {
        return recipient;
      }

      // Initiate transfer
      const transfer = await initiateTransfer({
        amount: tenantBankDetails.amount,
        recipient: recipient.recipient_code,
        reason: `Caution fee refund - ${escrowId}`,
        reference: `REFUND_${escrowId}_${Date.now()}`
      });

      return transfer;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to release caution fee to tenant'
      };
    }
  },

  // Release caution fee to landlord (damages found)
  async releaseCautionFeeToLandlord(escrowId, landlordBankDetails) {
    try {
      // Similar to tenant release but to landlord
      const recipient = await createTransferRecipient({
        name: landlordBankDetails.account_name,
        account_number: landlordBankDetails.account_number,
        bank_code: landlordBankDetails.bank_code
      });

      if (!recipient.success) {
        return recipient;
      }

      const transfer = await initiateTransfer({
        amount: landlordBankDetails.amount,
        recipient: recipient.recipient_code,
        reason: `Caution fee for damages - ${escrowId}`,
        reference: `DAMAGES_${escrowId}_${Date.now()}`
      });

      return transfer;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to release caution fee to landlord'
      };
    }
  }
};

export default {
  initializePayment,
  verifyPayment,
  createTransferRecipient,
  initiateTransfer,
  getNigerianBanks,
  resolveAccountNumber,
  calculateFees,
  generatePaymentReference,
  formatNaira,
  verifyWebhookSignature,
  handleWebhookEvent,
  EscrowManager,
  PAYSTACK_PUBLIC_KEY
};

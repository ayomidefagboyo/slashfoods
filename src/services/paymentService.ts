// Flutterwave doesn't export closePaymentModal in react-flutterwave
// The modal is closed automatically after payment or user cancellation
// We'll create a placeholder function for compatibility
const closePaymentModal = () => {
  console.log('Flutterwave modal closed');
};

// Types for payment data
export interface PaymentData {
  amount: number;
  email: string;
  name: string;
  phone: string;
  orderId: string;
}

export interface PaymentResponse {
  success: boolean;
  reference: string;
  message: string;
  provider: 'flutterwave';
}

// Flutterwave configuration
const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-dummy-key';

/**
 * Get Flutterwave configuration for React hook
 */
export const getFlutterwaveConfig = (paymentData: PaymentData) => {
  return {
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: paymentData.orderId,
    amount: paymentData.amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd,banktransfer',
    customer: {
      email: paymentData.email,
      phonenumber: paymentData.phone,
      name: paymentData.name,
    },
    customizations: {
      title: 'SlashFood Payment',
      description: 'Payment for your food deals',
      logo: '/slashfood-logo.png',
    },
  };
};

/**
 * Handle Flutterwave payment response
 */
export const handleFlutterwaveResponse = (response: any): PaymentResponse => {
  closePaymentModal();

  if (response.status === 'successful') {
    return {
      success: true,
      reference: response.transaction_id,
      message: 'Payment successful',
      provider: 'flutterwave'
    };
  } else {
    return {
      success: false,
      reference: response.transaction_id || '',
      message: 'Payment failed or was cancelled',
      provider: 'flutterwave'
    };
  }
};

/**
 * Verify payment status (would typically call your backend)
 */
export const verifyPayment = async (
  reference: string,
  provider: 'flutterwave'
): Promise<boolean> => {
  // In a real app, this would call your backend API to verify the payment
  // For now, we'll simulate verification
  try {
    console.log(`Verifying ${provider} payment with reference: ${reference}`);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, always return true if reference exists
    return reference && reference !== '';
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};
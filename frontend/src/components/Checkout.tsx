import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Truck, Shield, CheckCircle, Banknote, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY);

export function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const {
    cart,
    getCartTotal,
    placeOrder,
    user,
    showNotification,
    clearCart,
    fetchOrders,
  } = useApp();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'success'>('shipping');
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'NG',
  });

  const [cardError, setCardError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = getCartTotal();
  // NGN pricing: free shipping over 99,000 NGN, else 9,990 NGN
  const shippingCost = total > 99000 ? 0 : 9990;
  const tax = total * 0.075; // 7.5% VAT
  const grandTotal = total + shippingCost + tax;

  const formatPrice = (amount: number) => `₦${amount.toFixed(2)}`;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  // ---- Card payment flow ----
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setCardError('Stripe not initialized');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError('Card element not found');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      const result = (await placeOrder(shipping, 'stripe')) as unknown as {
        clientSecret: string;
        orderId: string;
      };
      const { clientSecret, orderId: orderIdResult } = result;
      setOrderId(orderIdResult);

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shipping.fullName,
            address: {
              line1: shipping.address,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zip,
              country: shipping.country,
            },
          },
        },
      });

      if (confirmError) throw new Error(confirmError.message);

      if (paymentIntent?.status === 'succeeded') {
        setStep('success');
        showNotification('Payment successful! Your order has been placed.', 'success');
        setTimeout(() => {
          clearCart();
          fetchOrders();
          navigate('/orders');
        }, 2000);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (err: any) {
      setCardError(err.message || 'Payment failed');
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // ---- Bank Transfer flow ----
  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep('processing');

    try {
      // Create order without payment intent (backend handles 'bank_transfer')
      const result = (await placeOrder(shipping, 'bank_transfer')) as unknown as {
        orderId: string;
      };
      const { orderId: orderIdResult } = result;
      setOrderId(orderIdResult);

      setStep('success');
      showNotification('Order created! Please complete your transfer.', 'info');
    } catch (err: any) {
      showNotification(err.message || 'Order creation failed', 'error');
      setStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      handleCardPayment(e);
    } else {
      handleTransferSubmit(e);
    }
  };

  const copyAccount = () => {
    navigator.clipboard.writeText('7030644589');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ---- Confirm bank transfer manually ----
  const confirmTransfer = async () => {
    if (!orderId) return;
    try {
      await fetch(`http://localhost:3000/api/orders/${orderId}/confirm`, {
        method: 'POST',
        credentials: 'include',
      });
      showNotification('Order confirmed! Thank you.', 'success');
      clearCart();
      fetchOrders();
      navigate('/orders');
    } catch {
      showNotification('Could not confirm order. Please contact support.', 'error');
    }
  };

  // ---- Success screen ----
  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {paymentMethod === 'card' ? 'Order Confirmed! 🎉' : 'Order Placed'}
        </h2>
        {paymentMethod === 'card' ? (
          <p className="text-gray-500">Your payment was successful. You'll be redirected to your orders.</p>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-4 text-left">
            <h3 className="font-bold text-amber-800 mb-2">Bank Transfer Details</h3>
            <p className="text-sm text-amber-700">Please transfer the total amount to the account below:</p>
            <div className="mt-3 bg-white p-4 rounded-xl border border-amber-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Bank</p>
                  <p className="font-semibold">OPay</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="font-semibold text-lg">7030644589</p>
                </div>
                <button
                  onClick={copyAccount}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="font-semibold">David Osemudiamen Oyedoh</p>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="font-bold text-lg">{formatPrice(grandTotal)}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmTransfer}
                className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all"
              >
                I've Made the Transfer
              </button>
              <button
                onClick={() => {
                  clearCart();
                  navigate('/');
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
              >
                Continue Shopping
              </button>
            </div>
            <p className="text-xs text-amber-600 mt-3">
              💡 After transfer, click "I've Made the Transfer" to confirm your order.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-8 relative">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <CreditCard className="absolute inset-0 m-auto w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {paymentMethod === 'card' ? 'Processing Payment' : 'Creating Order...'}
        </h2>
        <p className="text-gray-500">
          {paymentMethod === 'card'
            ? 'Please wait while we securely process your payment...'
            : 'Please wait while we create your order...'}
        </p>
      </div>
    );
  }

  // ---- Shipping & Payment forms ----
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {['Shipping', 'Payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              (i === 0 && step === 'shipping') || (i === 1 && step === 'payment')
                ? 'bg-indigo-600 text-white'
                : i === 0 && step === 'payment'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i === 0 && step === 'payment' ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${
              (i === 0 && step === 'shipping') || (i === 1 && step === 'payment') ? 'text-gray-900' : 'text-gray-400'
            }`}>{s}</span>
            {i < 1 && <div className="w-16 h-0.5 bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={shipping.fullName}
                    onChange={e => setShipping({ ...shipping, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={shipping.address}
                    onChange={e => setShipping({ ...shipping, address: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={e => setShipping({ ...shipping, city: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={shipping.state}
                      onChange={e => setShipping({ ...shipping, state: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={shipping.zip}
                      onChange={e => setShipping({ ...shipping, zip: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={shipping.country}
                      onChange={e => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    >
                      <option value="NG">Nigeria</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg mt-4"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>

              {/* Payment method selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-1 ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-indigo-600' : 'text-gray-600'}`}>Card</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote className={`w-6 h-6 mx-auto mb-1 ${paymentMethod === 'transfer' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${paymentMethod === 'transfer' ? 'text-indigo-600' : 'text-gray-600'}`}>Bank Transfer</p>
                </button>
              </div>

              {/* Card details (only if card selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-8 h-5 bg-white/20 rounded" />
                        ))}
                      </div>
                      <CreditCard className="w-8 h-8 text-white/60" />
                    </div>
                    <p className="text-lg tracking-[0.2em] font-mono mb-4">•••• •••• •••• ••••</p>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-white/60 text-xs">Card Holder</p>
                        <p className="font-medium">{shipping.fullName || 'YOUR NAME'}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs">Expires</p>
                        <p className="font-medium">MM/YY</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                    <div className="p-3 border border-gray-300 rounded-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#1a202c',
                              '::placeholder': { color: '#a0aec0' },
                            },
                          },
                        }}
                        onChange={(e) => {
                          setCardError(e.error?.message || null);
                        }}
                      />
                    </div>
                    {cardError && <p className="text-red-600 text-sm mt-2">{cardError}</p>}
                  </div>
                </div>
              )}

              {/* Bank transfer info (only if transfer selected) */}
              {paymentMethod === 'transfer' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  <p className="font-semibold">Pay via Bank Transfer</p>
                  <p className="mt-1">After placing your order, you'll see the account details to complete your transfer.</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || (paymentMethod === 'card' && !stripe)}
                  className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {paymentMethod === 'card' ? `Pay ${formatPrice(grandTotal)}` : `Place Order (${formatPrice(grandTotal)})`}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-32">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (7.5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
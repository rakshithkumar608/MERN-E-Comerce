import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiShield, FiLock, FiAlertCircle } from "react-icons/fi";

const MockPaymentModal = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  totalAmount,
  paymentMethod,
  paymentDetails,
}) => {
  const [step, setStep] = useState(1); // 1: Connecting, 2: Verifying/OTP, 3: Success

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      return;
    }

    // Step 1: Connecting to Gateway (800ms)
    const t1 = setTimeout(() => {
      setStep(2);
    }, 800);

    // Step 2: Verifying 3D-Secure / OTP (1400ms)
    const t2 = setTimeout(() => {
      setStep(3);
    }, 2200);

    // Step 3: Trigger payment success callback (3000ms)
    const t3 = setTimeout(() => {
      if (onPaymentSuccess) {
        onPaymentSuccess({
          transactionId: `TXN_MOCK_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
          paymentMethod,
          paidAmount: totalAmount,
          status: "COMPLETED",
          provider: paymentMethod,
          paidAt: new Date().toISOString(),
          ...paymentDetails,
        });
      }
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onPaymentSuccess, totalAmount, paymentMethod, paymentDetails]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-6 relative overflow-hidden">
        {/* Top security header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <FiShield className="h-4 w-4" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span className="text-xs font-mono font-bold text-gray-500">
            MARTIFY PAY
          </span>
        </div>

        {/* Dynamic Step Content */}
        <div className="py-4 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-black/10 border-t-black rounded-full animate-spin mx-auto"></div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Connecting to Payment Gateway
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Routing transaction securely for ₹{Number(totalAmount).toLocaleString()}...
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <FiLock className="absolute inset-0 m-auto text-blue-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  Verifying 3D-Secure Authorization
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Authenticating with card issuer & validating mock OTP...
                </p>
              </div>
              <div className="w-48 bg-gray-100 rounded-full h-1.5 mx-auto overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-scale-up">
                <FiCheckCircle className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  Payment Approved!
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Transaction verified. Finalizing your order...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Meta Card */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-1.5 text-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-400">Payment Option:</span>
            <span className="font-bold text-gray-900">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Charged:</span>
            <span className="font-extrabold text-gray-900 text-sm">
              ₹{Number(totalAmount).toLocaleString()}
            </span>
          </div>
          {paymentDetails?.last4 && (
            <div className="flex justify-between">
              <span className="text-gray-400">Card ending:</span>
              <span className="font-mono font-bold text-gray-900">
                •••• {paymentDetails.last4}
              </span>
            </div>
          )}
          {paymentDetails?.upiId && (
            <div className="flex justify-between">
              <span className="text-gray-400">UPI ID:</span>
              <span className="font-mono font-bold text-gray-900">
                {paymentDetails.upiId}
              </span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
          <FiLock className="h-3 w-3" />
          <span>Do not refresh or close this window</span>
        </p>
      </div>
    </div>
  );
};

export default MockPaymentModal;

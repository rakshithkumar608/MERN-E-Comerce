import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  const clientId =
    import.meta.env.VITE_PAYPAL_CLIENT_ID ||
    "AfZH3KYLO96dqoQ--HyZQzZN0DFjn23K6fsfwAkHqvFWZr0mmcD9KiTqs2O3oql1tohT0HOXM2FL3jBt";

  const safeAmount = (Number(amount) || 1).toFixed(2);

  return (
    <div className="w-full">
      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: "USD",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", color: "gold" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: safeAmount,
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              if (onSuccess) onSuccess(details);
            });
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            if (onError) onError(err);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalButton;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton.jsx";

const cart = {
  products: [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      price: 300,
      image: "https://picsum.photos/500/500?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Blue",
      price: 599,
      image: "https://picsum.photos/500/500?random=2",
    },
  ],
  totalPrice: 899
};

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null);
  const [email, setEmail] = useState("rakshith@example.com");
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const handlePaymentSuccess = (details) => {
    console.log("Payment Success", details);
    // You might want to save the order details here before navigating
    navigate("/order-confirmation", { 
      state: { 
        orderDetails: details, 
        cart, 
        shippingAddress 
      } 
    });
  };

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    
    // Validate that all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    if (!email.trim()) {
      alert("Please provide a valid email address");
      return;
    }

    // Generate a proper checkout ID (in real app, this would come from your backend)
    const generatedCheckoutId = `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCheckoutId(generatedCheckoutId);
  };

  const handleInputChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address *</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">City *</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">State *</label>
              <input
                type="text"
                value={shippingAddress.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Zip Code *</label>
              <input
                type="text"
                value={shippingAddress.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Country *</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone *</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
              >
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with PayPal</h3>
                <PayPalButton
                  amount={cart.totalPrice} // Fixed: Use actual cart total instead of hardcoded 100
                  currency="USD"
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => {
                    console.error('Payment error:', error);
                    alert("Payment failed. Please try again.");
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={product.productId || index} // Better key using productId
              className="flex items-start justify-between py-2 border-b last:border-b-0"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4 rounded"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-md font-medium">{product.name}</h4>
                  <p className="text-gray-500 text-sm">Size: {product.size}</p>
                  <p className="text-gray-500 text-sm">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl font-semibold">${product.price.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-lg">
            <p>Subtotal</p>
            <p>${cart.totalPrice?.toLocaleString()}</p>
          </div>

          <div className="flex justify-between items-center text-lg">
            <p>Shipping</p>
            <p className="text-green-600">Free</p>
          </div>

          <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t">
            <p>Total</p>
            <p>${cart.totalPrice?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
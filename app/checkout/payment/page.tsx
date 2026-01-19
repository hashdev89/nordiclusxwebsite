'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, CreditCard, Lock, CheckCircle2, AlertCircle, Search, Menu, X, User, Heart, Package, ChevronDown, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import logo from '../../assets/4cb21529e27325b99c96e06426397bce92267e6c.png';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { CartDrawer } from '../../components/CartDrawer';

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod: string;
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart, cartCount, setIsOpen } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank_transfer'>('card');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Card payment form
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    // Load order data from sessionStorage
    const stored = sessionStorage.getItem('orderData');
    if (stored) {
      setOrderData(JSON.parse(stored));
    } else {
      // Redirect to checkout if no order data
      router.push('/checkout');
    }
  }, [router]);

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    // Format CVV
    else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      // Validate card details
      if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
        alert('Please fill in all card details');
        return;
      }
      if (cardData.cardNumber.replace(/\s/g, '').length < 16) {
        alert('Please enter a valid card number');
        return;
      }
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate payment success
    setPaymentSuccess(true);
    setLoading(false);

    // Clear cart after successful payment
    clearCart();

    // Redirect to success page after 3 seconds
    setTimeout(() => {
      router.push('/checkout/success');
    }, 3000);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">No order found</h1>
          <p className="text-muted-foreground mb-6">Redirecting to checkout...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-8 max-w-md">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Announcement Bar */}
      <div className="bg-foreground text-white py-2.5 text-center text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <span className="font-medium">New Year Sale: Up to 30% OFF</span>
          <span className="mx-2">•</span>
          <span>Free Shipping on Orders $50+</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header */}
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img src={logo.src} alt="Nordic Lux" className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 transition-all duration-300" />
              <div className="hidden sm:block">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Beauty . Taste . Health . Elegance</div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for products, brands, or skin concerns..."
                  className="w-full pl-12 pr-4 h-11 rounded-lg border-gray-200 focus:border-primary bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="hidden lg:flex rounded-lg hover:bg-gray-50">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden lg:flex rounded-lg hover:bg-gray-50">
                <Heart className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-lg hover:bg-gray-50"
                onClick={() => setIsOpen(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-between py-4 border-t border-gray-100">
            <div className="flex items-center gap-8">
              <Link href="/shop" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <span>Shop</span>
                <ChevronDown className="w-4 h-4" />
              </Link>
              <a href="/#concerns" className="text-sm hover:text-primary transition-colors">
                Skin Concerns
              </a>
              <a href="/#categories" className="text-sm hover:text-primary transition-colors">
                Categories
              </a>
              <a href="/#brands" className="text-sm hover:text-primary transition-colors">
                Brands
              </a>
              <a href="/#deals" className="text-sm text-red-600 hover:text-red-700 transition-colors">
                Sale
              </a>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>Track Your Order</span>
            </div>
          </nav>

          {/* Mobile Search */}
          <div className="lg:hidden py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 rounded-lg border-gray-200 bg-gray-50"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-muted-foreground">Visa, Mastercard, Amex</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">PayPal</div>
                    <div className="text-sm text-muted-foreground">Pay with your PayPal account</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm text-muted-foreground">Direct bank transfer</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-lg p-6 space-y-4">
                <h3 className="font-semibold">Card Details</h3>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="John Doe"
                    value={cardData.cardName}
                    onChange={handleCardInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={handleCardInputChange}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      maxLength={3}
                      type="password"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            )}

            {/* PayPal Payment */}
            {paymentMethod === 'paypal' && (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  You will be redirected to PayPal to complete your payment
                </p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay with PayPal'}
                </Button>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-white rounded-lg p-6 space-y-4">
                <h3 className="font-semibold">Bank Transfer Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p><span className="font-medium">Bank Name:</span> Nordic Lux Bank</p>
                  <p><span className="font-medium">Account Number:</span> 1234567890</p>
                  <p><span className="font-medium">Routing Number:</span> 987654321</p>
                  <p><span className="font-medium">SWIFT Code:</span> NORDLUX</p>
                  <p className="pt-2 text-muted-foreground">
                    Please include your order number in the transfer reference. 
                    Your order will be processed once payment is confirmed.
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Bank Transfer'}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {orderData.items.map((item: any) => (
                  <div key={item.productId} className="flex gap-3 text-sm">
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 border flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-2">{item.product.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${orderData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${orderData.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-foreground hover:bg-primary text-white"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? 'Processing Payment...' : `Pay $${orderData.total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <img src={logo.src} alt="Nordic Lux" className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 mb-4 transition-all duration-300" />
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Your trusted destination for authentic premium cosmetics from leading US and Canadian brands.
              </p>
              <div className="flex gap-3">
                {['f', '𝕏', 'in', 'ⓘ'].map((icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-all">
                    <span>{icon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="mb-4 text-sm uppercase tracking-wider">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                <li><a href="/#concerns" className="hover:text-primary transition-colors">Skin Concerns</a></li>
                <li><a href="/#categories" className="hover:text-primary transition-colors">Categories</a></li>
                <li><a href="/#brands" className="hover:text-primary transition-colors">Brands</a></li>
                <li><a href="/#deals" className="hover:text-primary transition-colors">Sale</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="mb-4 text-sm uppercase tracking-wider">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Affiliate</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Nordic Lux. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-full sm:w-80 p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={logo.src} alt="Nordic Lux" className="h-10 w-10" />
              <SheetTitle className="text-xl">Menu</SheetTitle>
            </div>
          </SheetHeader>
          <nav className="flex flex-col py-4">
            <Link 
              href="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Shop All</span>
            </Link>
            <a 
              href="/#concerns" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <span>Skin Concerns</span>
            </a>
            <a 
              href="/#categories" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <span>Categories</span>
            </a>
            <a 
              href="/#brands" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <span>Brands</span>
            </a>
            <a 
              href="/#deals" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <span>Sale</span>
            </a>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}


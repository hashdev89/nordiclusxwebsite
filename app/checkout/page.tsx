'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ShoppingCart, MapPin, CreditCard, CheckCircle2, Search, Menu, X, User, Heart, Package, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import logo from '../assets/4cb21529e27325b99c96e06426397bce92267e6c.png';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { CartDrawer } from '../components/CartDrawer';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotal, clearCart, cartCount, setIsOpen } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Shipping Method
    shippingMethod: 'standard', // standard, express
    
    // Payment Method
    paymentMethod: 'card', // card, paypal, bank_transfer
  });

  const subtotal = getTotal();
  const shippingCost = formData.shippingMethod === 'express' ? 15.00 : 5.00;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate customer info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert('Please fill in all customer information fields');
        return;
      }
    } else if (step === 2) {
      // Validate shipping address
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
        alert('Please fill in all shipping address fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to payment page
    const orderData = {
      ...formData,
      items: cartItems,
      subtotal,
      shipping: shippingCost,
      tax,
      total,
    };
    
    // Store order data in sessionStorage for payment page
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    
    router.push('/checkout/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add items to your cart to proceed with checkout</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center flex-1`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step >= s 
                          ? 'bg-primary border-primary text-white' 
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {step > s ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <span>{s}</span>
                        )}
                      </div>
                      <span className={`text-xs mt-2 ${step >= s ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                        {s === 1 ? 'Customer Info' : s === 2 ? 'Shipping' : 'Review'}
                      </span>
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Customer Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {step === 2 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Standard Shipping</div>
                        <div className="text-sm text-muted-foreground">5-7 business days</div>
                      </div>
                      <div className="font-semibold">$5.00</div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">Express Shipping</div>
                        <div className="text-sm text-muted-foreground">2-3 business days</div>
                      </div>
                      <div className="font-semibold">$15.00</div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold">Review Your Order</h2>
                
                {/* Customer Info Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                    <p><span className="font-medium">Email:</span> {formData.email}</p>
                    <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                  </div>
                </div>

                {/* Shipping Address Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <div className="text-sm">
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.country}</p>
                    <p className="mt-2">
                      <span className="font-medium">Method:</span> {
                        formData.shippingMethod === 'express' ? 'Express (2-3 days)' : 'Standard (5-7 days)'
                      }
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          {item.product.brand && (
                            <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                          )}
                          <p className="text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={handleNext} className="flex-1">
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handlePlaceOrder} 
                  className="flex-1 bg-foreground hover:bg-primary text-white"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
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


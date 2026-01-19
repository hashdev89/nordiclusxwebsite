'use client'

import { useParams, useRouter } from 'next/navigation';
import { useData, Product } from '../../contexts/DataContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ShoppingCart, Heart, ArrowLeft, Star, CheckCircle2, AlertCircle, Sparkles, Droplets, Shield, Search, Menu, X, User, Package, ChevronDown, MessageCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../assets/4cb21529e27325b99c96e06426397bce92267e6c.png';
import { ProductCard } from '../../components/ProductCard';
import { CartDrawer } from '../../components/CartDrawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products } = useData();
  const { cartCount, setIsOpen, addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const product = products.find(p => p.id === params?.id);

  // Get similar products (same category or brand, excluding current product)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => 
        p.id !== product.id && 
        (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, 8);
  }, [products, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const whatsappNumber = '94770130299';

  const openWhatsApp = () => {
    let message = `Hello! I'm interested in *${product.name}*`;
    if (product.brand) {
      message += ` by ${product.brand}`;
    }
    message += ` ($${product.price.toFixed(2)})`;
    message += '. Can you provide more information about this product?';
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const images = [product.image]; // Can be extended to support multiple images

  // Format description with proper line breaks
  const formatDescription = (text?: string) => {
    if (!text) return null;
    // Split by newlines and create paragraphs
    const paragraphs = text.split(/\n\n|\n/).filter(p => p.trim());
    return paragraphs.map((para, idx) => (
      <p key={idx} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
        {para.trim()}
      </p>
    ));
  };

  const handleProductSelect = (product: { name: string; brand?: string; price: number }) => {
    openWhatsApp();
  };

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
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Badge */}
            <div className="flex items-start justify-between">
              <div>
                {product.brand && (
                  <div className="text-sm uppercase tracking-widest text-primary mb-2">
                    {product.brand}
                  </div>
                )}
                <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < product.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                  {product.country && (
                    <span className="text-sm text-muted-foreground">• {product.country}</span>
                  )}
                </div>
              </div>
              {product.badge && (
                <Badge className="bg-primary text-white">{product.badge}</Badge>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-foreground">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <Badge className="bg-red-500 text-white">-{discount}%</Badge>
                  )}
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600">In Stock ({product.stock} available)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-600">Out of Stock</span>
                </>
              )}
            </div>

            {/* Overview */}
            {product.overview && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Product Overview
                </h3>
                <p className="text-muted-foreground leading-relaxed">{product.overview}</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Description
                </h3>
                <div className="space-y-2">
                  {formatDescription(product.description)}
                </div>
              </div>
            )}

            {/* Key Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  Key Ingredients
                </h3>
                <div className="space-y-3">
                  {product.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-foreground">
                          {ingredient.name}
                        </span>
                        {ingredient.percentage && (
                          <Badge variant="outline">{ingredient.percentage}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{ingredient.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Main Benefits
                </h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How to Use */}
            {product.howToUse && product.howToUse.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  How to Use
                </h3>
                <ol className="space-y-2 list-decimal list-inside">
                  {product.howToUse.map((step, idx) => (
                    <li key={idx} className="text-muted-foreground">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Tips & Precautions */}
            {product.tips && product.tips.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Tips & Precautions
                </h3>
                <ul className="space-y-2">
                  {product.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6 border-t">
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-foreground hover:bg-primary text-white h-12"
                  disabled={product.stock === 0}
                  onClick={() => {
                    if (product.stock > 0) {
                      addToCart(product, 1);
                    }
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200 h-12"
                disabled={product.stock === 0}
                onClick={openWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Check with WhatsApp
              </Button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div>
                <span className="text-sm text-muted-foreground">SKU</span>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Category</span>
                <p className="font-medium">{product.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Carousel */}
        {similarProducts.length > 0 && (
          <div className="mt-20 py-12 border-t">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Similar Products</h2>
              <p className="text-muted-foreground">You might also like these products</p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {similarProducts.map((similarProduct) => (
                  <CarouselItem key={similarProduct.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductCard
                      id={similarProduct.id}
                      name={similarProduct.name}
                      brand={similarProduct.brand}
                      category={similarProduct.category}
                      price={similarProduct.price}
                      originalPrice={similarProduct.originalPrice}
                      image={similarProduct.image}
                      badge={similarProduct.badge}
                      rating={similarProduct.rating}
                      country={similarProduct.country}
                      reviews={similarProduct.reviews}
                      onWhatsAppClick={handleProductSelect}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex -left-12" />
              <CarouselNext className="hidden lg:flex -right-12" />
            </Carousel>
          </div>
        )}
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


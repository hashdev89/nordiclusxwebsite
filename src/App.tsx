import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, User, Heart, Package, ChevronDown, Home, ShoppingBag, Grid3x3, Mail } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { ProductCard } from './components/ProductCard';
import { CategoryCard } from './components/CategoryCard';
import { FilterSidebar } from './components/FilterSidebar';
import { SkinConcernCard } from './components/SkinConcernCard';
import { PromoBanner } from './components/PromoBanner';
import { BrandLogo } from './components/BrandLogo';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './components/ui/sheet';
import logo from './assets/4cb21529e27325b99c96e06426397bce92267e6c.png';
// Import your local video file - update the filename to match your video
import heroVideo from './assets/hero-video.mp4';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cartCount, _setCartCount] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; brand?: string; price: number } | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const whatsappNumber = '94770130299'; // +94 770 130 299

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProductSelect = (product: { name: string; brand?: string; price: number }) => {
    setSelectedProduct(product);
    openWhatsApp(product);
  };

  const openWhatsApp = (product?: { name: string; brand?: string; price: number }) => {
    const productToUse = product || selectedProduct;
    let message = 'Hello! I\'m interested in ';
    
    if (productToUse) {
      message += `*${productToUse.name}*`;
      if (productToUse.brand) {
        message += ` by ${productToUse.brand}`;
      }
      message += ` ($${productToUse.price.toFixed(2)})`;
      message += '. Can you provide more information about this product?';
    } else {
      message += 'your products. Can you help me?';
    }
    
    const encodedMessage = encodeURIComponent(message);
    // Using the WhatsApp API format: https://api.whatsapp.com/send/?phone=...&text=...
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const categories = [
    {
      id: 1,
      name: 'Skincare',
      count: 245,
      image: 'https://images.unsplash.com/photo-1620917669809-1af0497965de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHJvdXRpbmUlMjBtaW5pbWFsfGVufDF8fHx8MTc2NjcyMzgxMXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      name: 'Makeup',
      count: 189,
      image: 'https://images.unsplash.com/photo-1765852549902-bd9c79d01afb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpY3MlMjBtYWtldXAlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2NjcyMzgxMXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      name: 'Haircare',
      count: 156,
      image: 'https://images.unsplash.com/photo-1631050165333-47295ef0744f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NjY3MjM4MTN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 4,
      name: 'Body Care',
      count: 134,
      image: 'https://images.unsplash.com/photo-1609468826499-0ec9af2fc7f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFwcGx5aW5nJTIwc2tpbmNhcmV8ZW58MXx8fHwxNzY2NjQ1NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const skinConcerns = [
    {
      title: 'Acne & Blemishes',
      description: 'Clear breakouts and prevent future blemishes with targeted treatments',
      icon: '🎯',
      productCount: 87
    },
    {
      title: 'Anti-Aging',
      description: 'Reduce wrinkles and boost collagen for youthful, radiant skin',
      icon: '✨',
      productCount: 124
    },
    {
      title: 'Dark Spots',
      description: 'Even out skin tone and fade discoloration with brightening solutions',
      icon: '☀️',
      productCount: 95
    },
    {
      title: 'Dry Skin',
      description: 'Restore moisture and strengthen your skin barrier',
      icon: '💧',
      productCount: 112
    },
    {
      title: 'Oily Skin',
      description: 'Balance oil production and minimize shine throughout the day',
      icon: '🌿',
      productCount: 78
    },
    {
      title: 'Sensitive Skin',
      description: 'Soothe irritation and calm reactive skin with gentle formulas',
      icon: '🌸',
      productCount: 89
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Niacinamide 10% + Zinc 1% Serum',
      brand: 'The Ordinary',
      category: 'Serum',
      price: 12.90,
      image: 'https://images.unsplash.com/photo-1723951174326-2a97221d3b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwYyUyMHNlcnVtfGVufDF8fHx8MTc2NjY2MjAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'Best Seller',
      rating: 5,
      country: 'Canada',
      reviews: 2847
    },
    {
      id: 2,
      name: 'Hydrating Facial Cleanser',
      brand: 'CeraVe',
      category: 'Cleanser',
      price: 15.49,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwY2xlYW5zZXJ8ZW58MXx8fHwxNzY2NzIyNjYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      country: 'USA',
      reviews: 1523
    },
    {
      id: 3,
      name: 'Toleriane Double Repair Face Moisturizer',
      brand: 'La Roche-Posay',
      category: 'Moisturizer',
      price: 19.99,
      originalPrice: 24.99,
      image: 'https://images.unsplash.com/photo-1762840192336-575fba31d28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2lzdHVyaXplciUyMGRyeSUyMHNraW58ZW58MXx8fHwxNzY2NzIyNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      country: 'USA',
      reviews: 982
    },
    {
      id: 4,
      name: 'Hydro Boost Water Gel',
      brand: 'Neutrogena',
      category: 'Moisturizer',
      price: 18.97,
      image: 'https://images.unsplash.com/photo-1724940349217-395457ca7302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwY29zbWV0aWNzJTIwc2tpbmNhcmV8ZW58MXx8fHwxNzY2NzIyMjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'Trending',
      rating: 4,
      country: 'USA',
      reviews: 1245
    },
    {
      id: 5,
      name: 'Daily Facial Moisturizer SPF 50',
      brand: 'Cetaphil',
      category: 'Sunscreen',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1689414480286-aae7c21fe1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zY3JlZW4lMjBib3R0bGV8ZW58MXx8fHwxNzY2NjYyMDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      country: 'Canada',
      reviews: 678
    },
    {
      id: 6,
      name: '2% BHA Liquid Exfoliant',
      brand: "Paula's Choice",
      category: 'Treatment',
      price: 32.00,
      originalPrice: 38.00,
      image: 'https://images.unsplash.com/photo-1743933282038-e9c576d97076?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY25lJTIwc2tpbmNhcmUlMjBwcm9kdWN0fGVufDF8fHx8MTc2NjcyMjY2MXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      country: 'USA',
      reviews: 3421
    },
    {
      id: 7,
      name: 'Ultra Repair Cream Intense Hydration',
      brand: 'First Aid Beauty',
      category: 'Moisturizer',
      price: 36.00,
      image: 'https://images.unsplash.com/photo-1762840192336-575fba31d28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2lzdHVyaXplciUyMGRyeSUyMHNraW58ZW58MXx8fHwxNzY2NzIyNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'New',
      rating: 5,
      country: 'USA',
      reviews: 892
    },
    {
      id: 8,
      name: 'Retinol 0.5% in Squalane',
      brand: 'The Ordinary',
      category: 'Serum',
      price: 14.80,
      image: 'https://images.unsplash.com/photo-1763503836825-97f5450d155a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpJTIwYWdpbmclMjBjcmVhbXxlbnwxfHx8fDE3NjY3MjI2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4,
      country: 'Canada',
      reviews: 1876
    }
  ];

  const brands = ['The Ordinary', 'CeraVe', 'La Roche-Posay', 'Neutrogena', 'Cetaphil', "Paula's Choice", 'First Aid Beauty', 'Drunk Elephant', 'Glossier', 'Tatcha', 'Fenty Beauty', 'Sunday Riley'];

  return (
    <>
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
            <div className="flex items-center gap-3">
              <img src={logo.src} alt="Nordic Lux" className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 transition-all duration-300" />
              <div className="hidden sm:block">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Beauty . Taste . Health . Elegance</div>
              </div>
            </div>

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
              <Button variant="ghost" size="icon" className="relative rounded-lg hover:bg-gray-50">
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
              <button className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <span>Shop</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <a href="#concerns" className="text-sm hover:text-primary transition-colors">
                Skin Concerns
              </a>
              <a href="#categories" className="text-sm hover:text-primary transition-colors">
                Categories
              </a>
              <a href="#brands" className="text-sm hover:text-primary transition-colors">
                Brands
              </a>
              <a href="#deals" className="text-sm text-red-600 hover:text-red-700 transition-colors">
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <span className="text-xs uppercase tracking-widest text-primary">Authentic US & Canada Brands</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl text-foreground tracking-tight">
                  Discover Your
                  <br />
                  <span className="text-primary">Best Skin</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Shop authentic skincare and beauty products from the world's most trusted brands. Expert-curated solutions for every concern.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-foreground hover:bg-primary text-white rounded-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all">
                  Shop All Products
                </Button>
                <Button variant="outline" className="rounded-lg px-8 h-12 border-gray-300 hover:border-primary hover:bg-gray-50">
                  Take Skin Quiz
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">✓</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-foreground">100% Authentic</div>
                    <div className="text-muted-foreground text-xs">Guaranteed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">🚚</span>
                  </div>
                  <div className="text-sm">
                    <div className="text-foreground">Free Shipping</div>
                    <div className="text-muted-foreground text-xs">Orders over $50</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Video */}
            <div className="relative">
              {/* Floating Stats Card - Top */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 z-10">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-3xl text-foreground">50K+</div>
                    <div className="text-sm text-muted-foreground">Happy Customers</div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-white" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gray-100 flex items-center justify-center">
                <video
                  className="w-full h-full object-cover object-center"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                >
                  <source src={heroVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <PromoBanner
              title="Winter Skincare Essentials"
              subtitle="Limited Time Offer"
              buttonText="Shop Now"
              image="https://images.unsplash.com/photo-1765882155864-c21b8587452c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWF1dHklMjBwcm9kdWN0cyUyMGZsYXQlMjBsYXl8ZW58MXx8fHwxNzY2NzIzODEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              theme="primary"
            />
            <PromoBanner
              title="New Arrivals"
              subtitle="Just Landed"
              buttonText="Explore Collection"
              image="https://images.unsplash.com/photo-1620917669809-1af0497965de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHJvdXRpbmUlMjBtaW5pbWFsfGVufDF8fHx8MTc2NjcyMzgxMXww&ixlib=rb-4.1.0&q=80&w=1080"
              theme="secondary"
            />
          </div>
        </div>
      </section>

      {/* Skin Concerns Section */}
      <section id="concerns" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">Targeted Solutions</p>
            <h2 className="text-4xl mb-4">Shop by Skin Concern</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect products for your unique skincare needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skinConcerns.map((concern, index) => (
              <SkinConcernCard key={index} title={concern.title} description={concern.description} icon={concern.icon} productCount={concern.productCount} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">Browse Collections</p>
            <h2 className="text-4xl mb-4">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} name={category.name} count={category.count} image={category.image} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section id="shop" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary mb-3">Top Rated</p>
              <h2 className="text-4xl mb-2">Best Sellers</h2>
              <p className="text-muted-foreground">
                Customer favorites from top brands
              </p>
            </div>
            <Button variant="outline" className="hidden sm:flex rounded-lg border-gray-300 hover:border-primary">
              View All Products
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                brand={product.brand}
                category={product.category}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                badge={product.badge}
                rating={product.rating}
                country={product.country}
                reviews={product.reviews}
                onWhatsAppClick={handleProductSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section id="brands" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">Trusted Partners</p>
            <h2 className="text-4xl mb-4">Shop by Brand</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Authentic products from the most trusted names in beauty
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <BrandLogo key={brand} name={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Why Shop With Us?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '✓', title: '100% Authentic', desc: 'Only genuine products from authorized distributors' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $50 within USA & Canada' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy' },
              { icon: '💬', title: '24/7 Support', desc: 'Expert beauty advisors ready to help' }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-3xl">💌</span>
            </div>
            <h2 className="text-4xl">Join Our Beauty Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get exclusive deals, skincare tips, and early access to new launches
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="rounded-lg bg-gray-50 border-gray-200 h-12 flex-1"
              />
              <Button className="bg-foreground hover:bg-primary text-white rounded-lg px-8 h-12 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
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
                <li><a href="#" className="hover:text-primary transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Skin Concerns</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Brands</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sale</a></li>
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
                <li><a href="/admin/login" className="hover:text-primary transition-colors">Admin</a></li>
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

      {/* Mobile Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left" className="w-full sm:w-96 p-0">
          <FilterSidebar onClose={() => setFilterOpen(false)} isMobile />
        </SheetContent>
      </Sheet>

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
            <a 
              href="#shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Shop All</span>
            </a>
            <a 
              href="#concerns" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <span>Skin Concerns</span>
            </a>
            <a 
              href="#categories" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <Grid3x3 className="w-5 h-5" />
              <span>Categories</span>
            </a>
            <a 
              href="#brands" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <span>Brands</span>
            </a>
            <a 
              href="#deals" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-base text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <span>Sale</span>
            </a>
            <div className="border-t border-gray-100 mt-4 pt-4">
              <a 
                href="#" 
                onClick={() => {
                  scrollToContact();
                  setMobileMenuOpen(false);
                }}
                className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </a>
              <a 
                href="#" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </a>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around min-h-[64px] h-auto py-2 px-1 sm:py-3 sm:px-2">
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors leading-tight whitespace-nowrap">Home</span>
          </button>

          <button
            onClick={() => scrollToSection('shop')}
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors leading-tight whitespace-nowrap">Shop</span>
          </button>

          <button
            onClick={() => scrollToSection('categories')}
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <Grid3x3 className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors leading-tight whitespace-nowrap text-center">Categories</span>
          </button>

          <button
            onClick={scrollToContact}
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors leading-tight whitespace-nowrap">Contact</span>
          </button>
        </div>
      </nav>

      {/* Spacer for bottom navigation on mobile */}
      <div className="h-20 sm:h-24 lg:hidden" />
    </div>

    {/* WhatsApp Chat Widget - Outside main container to ensure visibility */}
    <div 
      className="fixed"
      style={{ 
        position: 'fixed',
        bottom: '80px',
        right: '16px',
        zIndex: 999999,
        pointerEvents: 'none'
      }}
    >
      {/* Chat Card - Simple Design */}
      {chatOpen && (
        <div 
          className="w-72 sm:w-80 bg-white rounded-2xl shadow-2xl overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300"
          style={{
            animation: 'slideInFromBottom 0.3s ease-out',
            marginBottom: '16px',
            pointerEvents: 'auto'
          }}
        >
          {/* Header */}
          <div className="bg-[#25D366] p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
                <img 
                  src={logo.src} 
                  alt="Nordic Lux Logo" 
                  className="object-contain w-8 h-8"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Nordic Lux</h3>
                <p className="text-sm opacity-90">We're here to help!</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-4 text-sm">
              {selectedProduct 
                ? `Hi! 👋 I'm interested in ${selectedProduct.name}${selectedProduct.brand ? ` by ${selectedProduct.brand}` : ''} ($${selectedProduct.price.toFixed(2)}). Can you help me?`
                : "Hi! 👋 How can we help you find the perfect skincare products?"
              }
            </p>
            <button
              onClick={() => {
                openWhatsApp();
                setChatOpen(false);
              }}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Start Chat on WhatsApp</span>
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center">Click to open WhatsApp</p>
          </div>
        </div>
      )}

      {/* WhatsApp Button - Always Visible - Direct Link */}
      <button
        onClick={(e) => {
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            // Shift/Ctrl/Cmd click opens chat card
            setChatOpen(!chatOpen);
          } else {
            // Normal click opens WhatsApp directly
            openWhatsApp();
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setChatOpen(!chatOpen);
        }}
        className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center hover:scale-110 cursor-pointer border-0 outline-none relative"
        aria-label="Chat on WhatsApp"
        title="Click to open WhatsApp (Right-click or Shift+Click for chat card)"
        style={{ 
          backgroundColor: '#25D366',
          width: '64px',
          height: '64px',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.6)',
          zIndex: 1000000,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}
      >
        <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24" style={{ width: '32px', height: '32px', display: 'block' }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        
        {/* Badge if product is selected */}
        {selectedProduct && !chatOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">1</span>
          </div>
        )}
        
        {/* Pulse Animation */}
        {!chatOpen && (
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-30 pointer-events-none"></div>
        )}
      </button>
      
      {/* Small info button to open chat card */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-[#25D366] hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Open chat card"
          title="Open chat card"
          style={{ 
            zIndex: 1000001,
            pointerEvents: 'auto'
          }}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </button>
      )}
    </div>
    </>
  );
}

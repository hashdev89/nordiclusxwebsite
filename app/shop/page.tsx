'use client'

import { useState, useMemo, useEffect } from 'react';
import { useData, Product } from '../contexts/DataContext';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import { CartDrawer } from '../components/CartDrawer';
import { FilterSidebar, FilterState } from '../components/FilterSidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Filter, Grid, List, Search, X, ShoppingCart, Menu, User, Heart, Package, ChevronDown, Home, ShoppingBag, Grid3x3, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/4cb21529e27325b99c96e06426397bce92267e6c.png';

export default function ShopPage() {
  const { products } = useData();
  const { cartCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; brand?: string; price: number } | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Ensure sheets are closed on mount
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileFilterOpen(false);
  }, []);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 200;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 10) * 10;
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, maxPrice],
    selectedBrands: [],
    selectedCategories: [],
    selectedSkinConcerns: []
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product: Product) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      const matchesPrice = product.price >= filters.priceRange[0] && 
                          product.price <= filters.priceRange[1];

      // Brand filter
      const matchesBrand = filters.selectedBrands.length === 0 || 
                          (product.brand && filters.selectedBrands.includes(product.brand));

      // Category filter
      const matchesCategory = filters.selectedCategories.length === 0 || 
                             filters.selectedCategories.includes(product.category);

      return matchesSearch && matchesPrice && matchesBrand && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, filters, sortBy]);

  const whatsappNumber = '94770130299';

  const handleWhatsAppClick = (product: { name: string; brand?: string; price: number }) => {
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
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const activeFilterCount = filters.selectedBrands.length + 
                           filters.selectedCategories.length + 
                           filters.selectedSkinConcerns.length +
                           (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  const clearSearch = () => {
    setSearchQuery('');
  };

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 h-11 rounded-lg border-gray-200 focus:border-primary bg-gray-50 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <Link href="/admin/login">
                <Button variant="ghost" size="icon" className="hidden lg:flex rounded-lg hover:bg-gray-50">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
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
            <div className="flex items-center gap-6">
              <Link href="/shop" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <span>Shop</span>
                <ChevronDown className="w-4 h-4" />
              </Link>
              <a href="/#skincare-brands" className="text-sm hover:text-primary transition-colors">
                Skincare
              </a>
              <a href="/#makeup-perfumes" className="text-sm hover:text-primary transition-colors">
                Makeup & Perfumes
              </a>
              <a href="/#vitamins-minerals" className="text-sm hover:text-primary transition-colors">
                Vitamins
              </a>
              <a href="/#healthy-eating" className="text-sm hover:text-primary transition-colors">
                Healthy Eating
              </a>
              <a href="/#chocolate" className="text-sm hover:text-primary transition-colors">
                Chocolate
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 rounded-lg border-gray-200 bg-gray-50"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Shop Page Content */}
      <div className="bg-background">
        {/* Shop Header */}
        <div className="bg-white border-b sticky top-[88px] lg:top-[104px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Shop All Products</h1>
                <p className="text-muted-foreground">
                  {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              {/* Sort and View Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="name">Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Mobile Filter Button */}
                  <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="sm:hidden">
                        <Filter className="w-4 h-4" />
                        {activeFilterCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                      <SheetHeader className="p-6 border-b">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
                        <FilterSidebar
                          isMobile={true}
                          onClose={() => setMobileFilterOpen(false)}
                          filters={filters}
                          onFiltersChange={setFilters}
                          maxPrice={maxPrice}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-[200px]">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  maxPrice={maxPrice}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              {filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">No products found</p>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        priceRange: [0, maxPrice],
                        selectedBrands: [],
                        selectedCategories: [],
                        selectedSkinConcerns: []
                      });
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'flex flex-col gap-4'
                }>
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      category={product.category}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      badge={product.badge}
                      rating={product.rating}
                      brand={product.brand}
                      country={product.country}
                      reviews={product.reviews}
                      onWhatsAppClick={handleWhatsAppClick}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

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
              <ShoppingBag className="w-5 h-5" />
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
              <Grid3x3 className="w-5 h-5" />
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
            <div className="border-t border-gray-100 mt-4 pt-4">
              <a 
                href="/#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </a>
              <Link 
                href="/admin/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 text-base hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <User className="w-5 h-5" />
                <span>Account / Admin</span>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-center justify-around min-h-[64px] h-auto py-2 px-1 sm:py-3 sm:px-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors leading-tight whitespace-nowrap">Home</span>
          </Link>

          <Link
            href="/shop"
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-primary font-medium transition-colors leading-tight whitespace-nowrap">Shop</span>
          </Link>

          <a
            href="/#categories"
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <Grid3x3 className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors leading-tight whitespace-nowrap text-center">Categories</span>
          </a>

          <a
            href="/#contact"
            className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 flex-1 max-w-[25%] py-1.5 px-1 sm:px-2 transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 group rounded-lg"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition-transform group-active:scale-90">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors leading-tight whitespace-nowrap">Contact</span>
          </a>
        </div>
      </nav>

      {/* Spacer for bottom navigation on mobile */}
      <div className="h-20 sm:h-24 lg:hidden" />
    </div>

    {/* WhatsApp Chat Widget */}
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
      {chatOpen && (
        <div 
          className="w-72 sm:w-80 bg-white rounded-2xl shadow-2xl overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300"
          style={{
            animation: 'slideInFromBottom 0.3s ease-out',
            marginBottom: '16px',
            pointerEvents: 'auto'
          }}
        >
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

      <button
        onClick={(e) => {
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            setChatOpen(!chatOpen);
          } else {
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
        {selectedProduct && !chatOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">1</span>
          </div>
        )}
        {!chatOpen && (
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-30 pointer-events-none"></div>
        )}
      </button>
    </div>

    {/* Cart Drawer */}
    <CartDrawer />
    </>
  );
}


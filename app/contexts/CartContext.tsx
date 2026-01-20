'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './DataContext';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Validate that parsed data is an array
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          } else {
            console.error('Invalid cart data in localStorage, resetting to empty array');
            localStorage.removeItem('cart');
            setCartItems([]);
          }
        } catch (e) {
          console.error('Error loading cart from localStorage', e);
          localStorage.removeItem('cart');
          setCartItems([]);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      // Ensure prev is always an array
      const currentItems = Array.isArray(prev) ? prev : [];
      const existingItem = currentItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentItems, { productId: product.id, product, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => {
      const currentItems = Array.isArray(prev) ? prev : [];
      return currentItems.filter((item) => item.productId !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) => {
      const currentItems = Array.isArray(prev) ? prev : [];
      return currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const cartCount = Array.isArray(cartItems) 
    ? cartItems.reduce((count, item) => count + item.quantity, 0)
    : 0;

  // Ensure cartItems is always an array before providing to context
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  return (
    <CartContext.Provider
      value={{
        cartItems: safeCartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


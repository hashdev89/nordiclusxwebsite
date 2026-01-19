import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  country: string;
  reviews: number;
  description?: string;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
  description?: string;
  slug: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt?: string;
}

export interface SEO {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  updatedAt: string;
}

interface DataContextType {
  products: Product[];
  categories: Category[];
  invoices: Invoice[];
  customers: Customer[];
  seo: SEO[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'orders' | 'totalSpent'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  updateSEO: (page: string, seo: Partial<SEO>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Niacinamide 10% + Zinc 1% Serum',
    brand: 'The Ordinary',
    category: 'Serum',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1723951174326-2a97221d3b7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwYyUyMHNlcnVtfGVufDF8fHx8MTc2NjY2MjAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    badge: 'Best Seller',
    rating: 5,
    country: 'Canada',
    reviews: 2847,
    stock: 150,
    sku: 'ORD-NIA-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Hydrating Facial Cleanser',
    brand: 'CeraVe',
    category: 'Cleanser',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwY2xlYW5zZXJ8ZW58MXx8fHwxNzY2NzIyNjYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    country: 'USA',
    reviews: 1523,
    stock: 200,
    sku: 'CER-CLE-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Skincare',
    count: 245,
    image: 'https://images.unsplash.com/photo-1620917669809-1af0497965de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHJvdXRpbmUlMjBtaW5pbWFsfGVufDF8fHx8MTc2NjcyMzgxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'skincare',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Makeup',
    count: 189,
    image: 'https://images.unsplash.com/photo-1765852549902-bd9c79d01afb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpY3MlMjBtYWtldXAlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2NjcyMzgxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'makeup',
    createdAt: new Date().toISOString(),
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('admin_products');
    return stored ? JSON.parse(stored) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem('admin_categories');
    return stored ? JSON.parse(stored) : initialCategories;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = localStorage.getItem('admin_invoices');
    return stored ? JSON.parse(stored) : [];
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const stored = localStorage.getItem('admin_customers');
    return stored ? JSON.parse(stored) : [];
  });

  const [seo, setSeo] = useState<SEO[]>(() => {
    const stored = localStorage.getItem('admin_seo');
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        page: 'home',
        title: 'Nordic Lux - Premium Beauty Products',
        description: 'Shop authentic skincare and beauty products from trusted US and Canadian brands.',
        keywords: 'beauty, skincare, cosmetics, nordic lux',
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('admin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('admin_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('admin_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('admin_seo', JSON.stringify(seo));
  }, [seo]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'orders' | 'totalSpent'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      orders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateSEO = (page: string, updates: Partial<SEO>) => {
    const existing = seo.find(s => s.page === page);
    if (existing) {
      setSeo(seo.map(s => s.page === page ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
    } else {
      const newSEO: SEO = {
        id: Date.now().toString(),
        page,
        title: '',
        description: '',
        keywords: '',
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setSeo([...seo, newSEO]);
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        invoices,
        customers,
        seo,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addInvoice,
        updateInvoice,
        addCustomer,
        updateCustomer,
        updateSEO,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}


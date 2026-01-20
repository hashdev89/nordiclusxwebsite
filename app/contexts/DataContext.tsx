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
  type?: string; // Product type/variant (e.g., "20g", "50g", "100ml")
  createdAt: string;
  updatedAt: string;
  // Detailed product information
  overview?: string;
  ingredients?: Array<{ name: string; percentage?: string; description: string }>;
  benefits?: string[];
  howToUse?: string[];
  tips?: string[];
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  phone?: string;
  password?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  products: Product[];
  categories: Category[];
  invoices: Invoice[];
  customers: Customer[];
  seo: SEO[];
  users: User[];
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
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Niacinamide 10% + Zinc 1% Serum',
    brand: 'The Ordinary',
    category: 'Serum',
    price: 12.90,
    image: 'https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwce8a7cdf/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png?sh=900&sm=fit&sw=900',
    badge: 'Best Seller',
    rating: 5,
    country: 'Canada',
    reviews: 2847,
    stock: 150,
    sku: 'ORD-NIA-001',
    description: 'A water-based serum designed to help improve skin clarity, control excess oil, refine texture and brighten the complexion.',
    overview: 'The Ordinary Niacinamide 10% + Zinc 1% – 30ml is a water-based serum designed to help improve skin clarity, control excess oil, refine texture and brighten the complexion.',
    ingredients: [
      {
        name: 'Niacinamide (Vitamin B3)',
        percentage: '10%',
        description: 'Helps reduce the appearance of blemishes and congestion, supports barrier function, improves texture, and boosts radiance.'
      },
      {
        name: 'Zinc PCA',
        percentage: '1%',
        description: 'Works to balance sebum (oil) production and calm signs of congestion.'
      }
    ],
    benefits: [
      'Minimizes the appearance of enlarged pores and surface blemishes',
      'Helps control excess oil and shine',
      'Improves skin texture and tone with consistent use',
      'Boosts skin brightness and radiance',
      'Lightweight, non-greasy, and easy to layer under moisturizers or sunscreen'
    ],
    howToUse: [
      'Cleanse your face first',
      'Apply a few drops to clean, dry skin in the morning and/or evening',
      'Follow with moisturizer and sunscreen in the daytime',
      'Patch test before first use, especially if you have sensitive skin'
    ],
    tips: [
      'Suitable for all skin types, but high 10% niacinamide can be strong — start slowly if your skin is sensitive',
      'If irritation occurs, stop use and consult with a dermatologist',
      'Daily sunscreen is recommended when using potent active ingredients like niacinamide',
      'Avoid using it at the same time as pure Vitamin C (L-ascorbic acid) — apply those at different times of day if you\'re using both'
    ],
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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [seo, setSeo] = useState<SEO[]>([
    {
      id: '1',
      page: 'home',
      title: 'Nordic Lux - Premium Beauty Products',
      description: 'Shop authentic skincare and beauty products from trusted US and Canadian brands.',
      keywords: 'beauty, skincare, cosmetics, nordic lux',
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [users, setUsers] = useState<User[]>([]);

  // Load from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProducts = localStorage.getItem('admin_products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }

      const storedCategories = localStorage.getItem('admin_categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }

      const storedInvoices = localStorage.getItem('admin_invoices');
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices));
      }

      const storedCustomers = localStorage.getItem('admin_customers');
      if (storedCustomers) {
        setCustomers(JSON.parse(storedCustomers));
      }

      const storedSeo = localStorage.getItem('admin_seo');
      if (storedSeo) {
        setSeo(JSON.parse(storedSeo));
      }

      const storedUsers = localStorage.getItem('admin_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_invoices', JSON.stringify(invoices));
    }
  }, [invoices]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_customers', JSON.stringify(customers));
    }
  }, [customers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_seo', JSON.stringify(seo));
    }
  }, [seo]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_users', JSON.stringify(users));
    }
  }, [users]);

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

  const addUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        invoices,
        customers,
        seo,
        users,
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
        addUser,
        updateUser,
        deleteUser,
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


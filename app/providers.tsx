'use client'

import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { CartProvider } from './contexts/CartContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  )
}


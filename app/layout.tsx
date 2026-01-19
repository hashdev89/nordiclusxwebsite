import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { AdminMiddleware } from './admin/middleware'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nordic Lux - Premium Beauty Products',
  description: 'Shop authentic skincare and beauty products from trusted US and Canadian brands.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AdminMiddleware>{children}</AdminMiddleware>
        </Providers>
      </body>
    </html>
  )
}


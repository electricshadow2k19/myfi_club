import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MYFI - India\'s Personal Finance Super App',
  description: 'One App. Every Financial Need. UPI, Investments, Net Worth, Credit Score, Mutual Funds, Gold, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


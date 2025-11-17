import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MYFI - One App. Every Financial Need | India\'s Finance Super App',
  description: 'Track, pay, invest, insure, and grow your money — all in ONE dashboard. UPI, Mutual Funds, Net Worth, Credit Score, Gold, and more. Stop using 10 apps for your money.',
  keywords: 'personal finance, UPI payments, mutual funds, SIP, net worth, credit score, gold investment, fintech India',
  openGraph: {
    title: 'MYFI - One App. Every Financial Need',
    description: 'Track, pay, invest, insure, and grow your money — all in ONE dashboard.',
    type: 'website',
    url: 'https://www.myfi.club',
  },
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


import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/wallet/WalletProvider'
import { Navbar } from '@/components/navigation/Navbar'
import ChatBot from '@/components/chat/ChatBot'
import { Footer } from '@/components/navigation/Footer'
import { ServiceWorker } from '@/components/ServiceWorker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Polkadot DevKit - AI-Powered Substrate Development',
  description: 'Accelerate your Polkadot development with AI-generated ink! smart contracts, templates, and debugging tools.',
  keywords: 'Polkadot, Substrate, ink!, smart contracts, AI, blockchain development',
  authors: [{ name: 'Polkadot DevKit Team' }],
  openGraph: {
    title: 'Polkadot DevKit - AI-Powered Substrate Development',
    description: 'Cut Substrate development time by 70% with AI assistance',
    type: 'website',
    url: 'https://polkadot-devkit.vercel.app',
    siteName: 'Polkadot DevKit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Polkadot DevKit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polkadot DevKit - AI-Powered Substrate Development',
    description: 'Cut Substrate development time by 70% with AI assistance',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  themeColor: '#8b5cf6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Polkadot DevKit',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Polkadot DevKit" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </head>
      <body className={inter.className}>
        <WalletProvider>
          <Navbar />
        <main className="pt-16 min-h-screen overflow-x-hidden">
          {children}
        </main>
          <Footer />
          <ChatBot />
          <ServiceWorker />
        </WalletProvider>
      </body>
    </html>
  )
}

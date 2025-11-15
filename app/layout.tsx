import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/wallet/WalletProvider';
import { ServiceWorker } from '@/components/ServiceWorker';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Polkadot DevKit - Desarrollo en Polkadot',
  description: 'Kit de desarrollo completo para construir aplicaciones en Polkadot',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Polkadot DevKit',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <WalletProvider>
          <Navbar />
          {children}
          <Footer />
          <ServiceWorker />
        </WalletProvider>
      </body>
    </html>
  );
}
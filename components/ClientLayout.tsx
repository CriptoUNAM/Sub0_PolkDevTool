'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Importaciones dinámicas con SSR deshabilitado para componentes que usan window
const DynamicWalletProvider = dynamic(() => import('@/components/wallet/WalletProvider').then(mod => ({ default: mod.WalletProvider })), {
  ssr: false,
  loading: () => null,
});

const DynamicNavbar = dynamic(() => import('@/components/navigation/Navbar').then(mod => ({ default: mod.Navbar })), {
  ssr: false,
  loading: () => <div className="h-16 bg-slate-900" />,
});

const DynamicFooter = dynamic(() => import('@/components/navigation/Footer').then(mod => ({ default: mod.Footer })), {
  ssr: false,
  loading: () => <div className="h-32 bg-slate-900" />,
});

const DynamicServiceWorker = dynamic(() => import('@/components/ServiceWorker').then(mod => ({ default: mod.ServiceWorker })), {
  ssr: false,
  loading: () => null,
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <DynamicWalletProvider>
        <Suspense fallback={<div className="h-16 bg-slate-900" />}>
          <DynamicNavbar />
        </Suspense>
        {children}
        <Suspense fallback={<div className="h-32 bg-slate-900" />}>
          <DynamicFooter />
        </Suspense>
        <DynamicServiceWorker />
      </DynamicWalletProvider>
    </Suspense>
  );
}


'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Página no encontrada
          </h2>
          <p className="text-gray-400 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </Link>
          
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.back();
              }
            }}
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-all duration-300 border border-slate-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Página Anterior
          </button>
        </div>

        <div className="mt-12">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
            Proyecto sub0 Hack 2025
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Desarrollado para Polkadot y Paseo Testnet
          </p>
        </div>
      </div>
    </div>
  );
}

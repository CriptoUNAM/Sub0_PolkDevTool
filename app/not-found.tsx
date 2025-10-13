'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, Code, Zap } from 'lucide-react';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl sm:text-9xl font-bold text-purple-500/20 blur-sm">
            404
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Página no encontrada
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-lg mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida. 
          Pero no te preocupes, tenemos muchas otras cosas increíbles para ti.
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/"
            className="group flex items-center justify-center space-x-3 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <Home className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-medium">Ir al Inicio</span>
          </Link>
          
          <Link
            href="/generate"
            className="group flex items-center justify-center space-x-3 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            <Code className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-medium">Generar Contratos</span>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Enlaces populares:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/templates"
              className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">Templates</span>
            </Link>
            
            <Link
              href="/marketplace"
              className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4 text-green-400" />
              <span className="text-slate-300 text-sm">Marketplace</span>
            </Link>
            
            <Link
              href="/docs"
              className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 text-sm">Documentación</span>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Context7Test } from '@/components/context7/Context7Test';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function Context7TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Prueba de Context7
          </h1>
          <p className="text-gray-600 mt-2">
            Prueba la integración de Context7 con documentación en tiempo real
          </p>
        </div>
        
        <Context7Test />
      </div>
    </div>
  );
}

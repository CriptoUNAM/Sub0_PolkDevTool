'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Code, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Context7Test() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/context7/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">
          Context7 API Test
        </h1>
        <p className="text-gray-400">
          Prueba la integración con Context7 para búsqueda semántica
        </p>
      </motion.div>

      <Card className="p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar en documentación de Polkadot..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6"
          >
            <Search className="w-5 h-5 mr-2" />
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </Card>

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Resultados ({results.length})
          </h2>
          {results.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">
                    {result.title || 'Documento'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {result.content || result.description}
                  </p>
                  {result.url && (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Ver documento →
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {results.length === 0 && !loading && query && (
        <Card className="p-8 text-center">
          <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-400">
            Intenta con una búsqueda diferente o verifica la conexión con Context7
          </p>
        </Card>
      )}
    </div>
  );
}

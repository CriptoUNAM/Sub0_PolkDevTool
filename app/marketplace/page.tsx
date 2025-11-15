'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Store, 
  Search, 
  Download, 
  Star,
  ArrowLeft,
  Filter,
  Grid,
  List,
  Code,
  Zap,
  Shield
} from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  downloads: number;
  rating: number;
  tags: string[];
  price: 'Free' | 'Premium';
  author: string;
  lastUpdated: string;
}

export default function MarketplacePage() {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const templates: Template[] = [
    {
      id: '1',
      title: 'ERC-20 Token Template',
      description: 'Plantilla completa para crear tokens ERC-20 en Polkadot',
      category: 'Tokens',
      downloads: 1234,
      rating: 4.8,
      tags: ['token', 'erc20', 'defi'],
      price: 'Free',
      author: 'Polkadot Team',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'NFT Marketplace',
      description: 'Marketplace completo para NFTs con funcionalidades avanzadas',
      category: 'NFT',
      downloads: 856,
      rating: 4.6,
      tags: ['nft', 'marketplace', 'web3'],
      price: 'Premium',
      author: 'Web3 Dev',
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      title: 'DAO Governance',
      description: 'Sistema de gobernanza descentralizada para DAOs',
      category: 'Governance',
      downloads: 432,
      rating: 4.9,
      tags: ['dao', 'governance', 'voting'],
      price: 'Free',
      author: 'DAO Builder',
      lastUpdated: '2024-01-12'
    },
    {
      id: '4',
      title: 'DeFi Lending Protocol',
      description: 'Protocolo de préstamos descentralizados',
      category: 'DeFi',
      downloads: 678,
      rating: 4.7,
      tags: ['defi', 'lending', 'protocol'],
      price: 'Premium',
      author: 'DeFi Master',
      lastUpdated: '2024-01-08'
    },
    {
      id: '5',
      title: 'Cross-chain Bridge',
      description: 'Puente para transferir activos entre cadenas',
      category: 'Bridge',
      downloads: 234,
      rating: 4.5,
      tags: ['bridge', 'cross-chain', 'interoperability'],
      price: 'Free',
      author: 'Bridge Builder',
      lastUpdated: '2024-01-05'
    },
    {
      id: '6',
      title: 'Staking Pool',
      description: 'Pool de staking con recompensas automáticas',
      category: 'Staking',
      downloads: 567,
      rating: 4.8,
      tags: ['staking', 'rewards', 'pool'],
      price: 'Premium',
      author: 'Staking Pro',
      lastUpdated: '2024-01-03'
    }
  ];

  const categories = ['all', 'Tokens', 'NFT', 'Governance', 'DeFi', 'Bridge', 'Staking'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-16 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Store className="w-8 h-8 mr-3 text-purple-400" />
              Marketplace
            </h1>
            <p className="text-gray-400">Descubre y descarga plantillas para tu proyecto</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar plantillas..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Todas las categorías' : category}
                    </option>
                  ))}
                </select>
                <Button
                  variant="secondary"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="px-4"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "secondary"}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category === 'all' ? 'Todas' : category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Templates Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className={`p-6 bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : ''
                }`}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">{template.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          template.price === 'Free' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {template.price}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>Por {template.author}</span>
                          <span>{template.lastUpdated}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {template.downloads}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {template.rating}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button variant="primary" className="w-full flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white">{template.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            template.price === 'Free' 
                              ? 'bg-green-400/20 text-green-400' 
                              : 'bg-yellow-400/20 text-yellow-400'
                          }`}>
                            {template.price}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Por {template.author}</span>
                          <span>{template.downloads} descargas</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {template.rating}
                          </div>
                        </div>
                      </div>
                      <Button variant="primary" className="flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                    </>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No se encontraron plantillas</h3>
              <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

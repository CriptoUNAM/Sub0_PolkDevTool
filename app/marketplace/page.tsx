'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Star, 
  Download, 
  Eye, 
  Filter, 
  Search,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Zap,
  Code,
  Heart,
  Share2,
  Tag,
  Award,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { CONTRACT_TEMPLATES } from '@/lib/templates/contracts';

// Función para obtener el código del contrato
const getContractCode = (contractId: number): string => {
  const templateMap: { [key: number]: string } = {
    1: 'staking-pool', // Advanced Staking Pool
    2: 'nft-marketplace', // NFT Marketplace  
    3: 'dao-governance', // DAO Governance
    4: 'defi-lending', // DeFi Lending Pool
    5: 'cross-chain-bridge', // Cross-Chain Bridge
    6: 'token-vesting', // Token Vesting
  };
  
  const templateId = templateMap[contractId];
  const template = CONTRACT_TEMPLATES.find(t => t.id === templateId);
  return template?.code || `// Código del contrato ${contractId} no disponible`;
};

// Función para descargar archivo
const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const MARKETPLACE_CONTRACTS = [
  {
    id: 1,
    name: 'Advanced Staking Pool',
    description: 'Contrato de staking con múltiples pools, recompensas compuestas y governance integrado',
    author: 'PolkadotDev',
    price: 0,
    rating: 4.9,
    downloads: 1247,
    tags: ['staking', 'governance', 'defi'],
    complexity: 'advanced',
    features: ['Multi-pool', 'Compound rewards', 'Governance'],
    lastUpdated: '2 days ago',
    verified: true,
    trending: true,
    templateId: 'staking-pool',
  },
  {
    id: 2,
    name: 'NFT Marketplace',
    description: 'Marketplace completo para NFTs con royalties, subastas y trading automático',
    author: 'Web3Builder',
    price: 0,
    rating: 4.8,
    downloads: 892,
    tags: ['nft', 'marketplace', 'trading'],
    complexity: 'advanced',
    features: ['Royalties', 'Auctions', 'Auto-trading'],
    lastUpdated: '1 week ago',
    verified: true,
    trending: false,
    templateId: 'nft-marketplace',
  },
  {
    id: 3,
    name: 'DAO Governance',
    description: 'Sistema de gobernanza DAO con votación por delegación y propuestas automáticas',
    author: 'DAOExpert',
    price: 0,
    rating: 4.7,
    downloads: 654,
    tags: ['dao', 'governance', 'voting'],
    complexity: 'intermediate',
    features: ['Delegation', 'Auto-proposals', 'Quorum'],
    lastUpdated: '3 days ago',
    verified: true,
    trending: true,
    templateId: 'dao-governance',
  },
  {
    id: 4,
    name: 'DeFi Lending Pool',
    description: 'Pool de préstamos descentralizado con tasas dinámicas y liquidación automática',
    author: 'DeFiMaster',
    price: 0,
    rating: 4.6,
    downloads: 423,
    tags: ['defi', 'lending', 'liquidation'],
    complexity: 'advanced',
    features: ['Dynamic rates', 'Auto-liquidation', 'Collateral'],
    lastUpdated: '5 days ago',
    verified: false,
    trending: false,
    templateId: 'defi-lending',
  },
  {
    id: 5,
    name: 'Cross-Chain Bridge',
    description: 'Bridge para transferencias entre chains con validación por múltiples signers',
    author: 'BridgeBuilder',
    price: 0,
    rating: 4.5,
    downloads: 312,
    tags: ['bridge', 'cross-chain', 'security'],
    complexity: 'advanced',
    features: ['Multi-signer', 'Cross-chain', 'Security'],
    lastUpdated: '1 week ago',
    verified: true,
    trending: false,
    templateId: 'cross-chain-bridge',
  },
  {
    id: 6,
    name: 'Token Vesting',
    description: 'Sistema de vesting de tokens con múltiples schedules y cliff periods',
    author: 'TokenMaster',
    price: 0,
    rating: 4.4,
    downloads: 567,
    tags: ['vesting', 'tokens', 'schedule'],
    complexity: 'intermediate',
    features: ['Multi-schedule', 'Cliff periods', 'Linear release'],
    lastUpdated: '4 days ago',
    verified: true,
    trending: false,
    templateId: 'token-vesting',
  },
];

const CATEGORIES = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'staking', label: 'Staking' },
  { value: 'nft', label: 'NFTs' },
  { value: 'dao', label: 'DAO' },
  { value: 'defi', label: 'DeFi' },
  { value: 'bridge', label: 'Bridge' },
  { value: 'vesting', label: 'Vesting' },
];

const COMPLEXITY_LEVELS = [
  { value: 'all', label: 'Todos los niveles' },
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [downloading, setDownloading] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [showCodeModal, setShowCodeModal] = useState<number | null>(null);

  // Función para manejar la descarga
  const handleDownload = async (contract: any) => {
    setDownloading(contract.id);
    
    try {
      const code = getContractCode(contract.id);
      const filename = `${contract.name.toLowerCase().replace(/\s+/g, '-')}.rs`;
      
      // Simular delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      downloadFile(code, filename);
      
      // Actualizar contador de descargas (simulado)
      contract.downloads += 1;
      
    } catch (error) {
      console.error('Error downloading contract:', error);
    } finally {
      setDownloading(null);
    }
  };

  // Función para copiar código al portapapeles
  const handleCopyCode = async (contract: any) => {
    try {
      const code = getContractCode(contract.id);
      await navigator.clipboard.writeText(code);
      setCopied(contract.id);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Error copying code:', error);
    }
  };

  const filteredContracts = MARKETPLACE_CONTRACTS.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        contract.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || contract.tags.includes(selectedCategory);
    const matchesComplexity = selectedComplexity === 'all' || contract.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'staking': return '💰';
      case 'nft': return '🖼️';
      case 'dao': return '🏛️';
      case 'defi': return '💱';
      case 'bridge': return '🌉';
      case 'vesting': return '⏰';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-4 sm:pt-8 pb-8 sm:pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Store className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 mr-3 sm:mr-4" />
              <h1 className="text-3xl sm:text-5xl font-bold gradient-text">Contract Marketplace</h1>
            </div>
            <p className="text-lg sm:text-2xl text-gray-300 mb-6 sm:mb-8">
              Descubre, descarga y despliega contratos inteligentes pre-construidos
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar contratos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {CATEGORIES.map(category => (
                    <option key={category.value} value={category.value} className="bg-slate-900">
                      {category.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {COMPLEXITY_LEVELS.map(level => (
                    <option key={level.value} value={level.value} className="bg-slate-900">
                      {level.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="trending" className="bg-slate-900">Tendencia</option>
                  <option value="rating" className="bg-slate-900">Calificación</option>
                  <option value="downloads" className="bg-slate-900">Descargas</option>
                  <option value="newest" className="bg-slate-900">Más recientes</option>
                </select>
                
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedComplexity('all');
                    setSortBy('trending');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Contracts Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full cursor-pointer group">
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-xl sm:text-2xl mr-2 sm:mr-3">
                          {getCategoryIcon(contract.tags[0])}
                        </span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold mb-1 flex items-center">
                            {contract.name}
                            {contract.verified && (
                              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 ml-1 sm:ml-2" />
                            )}
                            {contract.trending && (
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 ml-1 sm:ml-2" />
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400">por {contract.author}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(contract.complexity)}`}>
                          {contract.complexity}
                        </span>
                        {contract.trending && (
                          <span className="px-2 py-1 bg-orange-400/20 text-orange-400 rounded-full text-xs font-medium">
                            Trending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                      {contract.description}
                    </p>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {contract.features.map((feature, idx) => (
                          <span key={idx} className="px-1 sm:px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {contract.tags.map((tag, idx) => (
                          <span key={idx} className="px-1 sm:px-2 py-1 bg-purple-400/20 text-purple-400 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4 text-xs sm:text-sm text-gray-400">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
                        {contract.rating}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-1" />
                        {contract.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1" />
                        {contract.lastUpdated}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      {/* Botones principales */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => handleDownload(contract)}
                          disabled={downloading === contract.id}
                        >
                          {downloading === contract.id ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Descargando...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Descargar .rs
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(contract)}
                        >
                          {copied === contract.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Botones secundarios */}
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowCodeModal(contract.id)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Código
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredContracts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400">
                <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">No se encontraron contratos</p>
                <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <Card>
              <h3 className="text-2xl font-semibold text-center mb-8 gradient-text">
                Estadísticas del Marketplace
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {MARKETPLACE_CONTRACTS.length}+
                  </div>
                  <div className="text-gray-400">Contratos Disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {MARKETPLACE_CONTRACTS.reduce((sum, contract) => sum + contract.downloads, 0).toLocaleString()}+
                  </div>
                  <div className="text-gray-400">Total Descargas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {MARKETPLACE_CONTRACTS.filter(c => c.verified).length}
                  </div>
                  <div className="text-gray-400">Contratos Verificados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {MARKETPLACE_CONTRACTS.filter(c => c.trending).length}
                  </div>
                  <div className="text-gray-400">En Tendencia</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modal para mostrar código */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {MARKETPLACE_CONTRACTS.find(c => c.id === showCodeModal)?.name}
                  </h3>
                  <p className="text-gray-400">
                    Código fuente del contrato
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const contract = MARKETPLACE_CONTRACTS.find(c => c.id === showCodeModal);
                      if (contract) handleCopyCode(contract);
                    }}
                  >
                    {copied === showCodeModal ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCodeModal(null)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-auto max-h-[60vh]">
              <pre className="text-sm text-gray-300 bg-slate-800 p-4 rounded-lg overflow-auto">
                <code>{getContractCode(showCodeModal)}</code>
              </pre>
            </div>
            
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const contract = MARKETPLACE_CONTRACTS.find(c => c.id === showCodeModal);
                    if (contract) handleDownload(contract);
                  }}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Archivo .rs
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCodeModal(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

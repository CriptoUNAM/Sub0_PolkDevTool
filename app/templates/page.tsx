'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Download, 
  Eye, 
  Filter, 
  Search,
  Tag,
  Star,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { CodeBlock } from '@/components/code/CodeBlock';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { CONTRACT_TEMPLATES } from '@/lib/templates/contracts';

const CATEGORIES = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'token', label: 'Tokens' },
  { value: 'nft', label: 'NFTs' },
  { value: 'governance', label: 'Governance' },
  { value: 'defi', label: 'DeFi' },
  { value: 'staking', label: 'Staking' },
  { value: 'dao', label: 'DAO' },
  { value: 'xcm', label: 'XCM' },
  { value: 'vesting', label: 'Vesting' }
];

const COMPLEXITY_LEVELS = [
  { value: 'all', label: 'Todos los niveles' },
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' }
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTemplates = CONTRACT_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || template.complexity === selectedComplexity;
    
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
      case 'token': return '🪙';
      case 'nft': return '🖼️';
      case 'governance': return '🗳️';
      case 'defi': return '💱';
      case 'staking': return '💰';
      case 'dao': return '🏛️';
      case 'xcm': return '🌐';
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
            className="text-center mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-4xl font-bold gradient-text">Template Library</h1>
            </div>
            <p className="text-base sm:text-xl text-gray-300">
              Plantillas pre-construidas para acelerar tu desarrollo
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar plantillas..."
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
                
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedComplexity('all');
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Templates Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full cursor-pointer group">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-xl sm:text-2xl mr-2 sm:mr-3">
                          {getCategoryIcon(template.category)}
                        </span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold mb-1">{template.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-400">{template.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                        {template.complexity}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="px-1 sm:px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span className="px-1 sm:px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                            +{template.features.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsModalOpen(true);
                        }}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver código
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([template.code], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${template.id}.rs`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
              <div className="text-gray-400">
                <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">No se encontraron plantillas</p>
                <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Template Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTemplate?.name}
        className="max-w-4xl"
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">{getCategoryIcon(selectedTemplate.category)}</span>
              <div>
                <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                <p className="text-gray-400">{selectedTemplate.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Características
                </h3>
                <ul className="space-y-2">
                  {selectedTemplate.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  Consideraciones de seguridad
                </h3>
                <ul className="space-y-2">
                  {selectedTemplate.securityConsiderations.map((consideration: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Pasos de deployment
              </h3>
              <ol className="space-y-2">
                {selectedTemplate.deploymentSteps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start text-sm text-gray-300">
                    <span className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Código del contrato</h3>
              <CodeBlock
                code={selectedTemplate.code}
                language="rust"
                showLineNumbers={true}
              />
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  const blob = new Blob([selectedTemplate.code], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedTemplate.id}.rs`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar código
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

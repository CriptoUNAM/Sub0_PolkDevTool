'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Code,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Zap,
  Globe,
  Shield,
  Brain,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  subsections: {
    title: string;
    content: string;
    code?: string;
    external?: string;
  }[];
}

export default function DocsPage() {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [intelligentSearchResult, setIntelligentSearchResult] = useState('');
  const [isIntelligentSearching, setIsIntelligentSearching] = useState(false);
  const [showIntelligentSearch, setShowIntelligentSearch] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Docs</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Comenzar',
      description: 'Guía de inicio rápido para Polkadot DevKit',
      icon: Zap,
      subsections: [
        {
          title: 'Instalación',
          content: 'Instala las dependencias necesarias para comenzar con Polkadot DevKit.',
          code: `npm install @polkadot/api @polkadot/api-contract
# o
yarn add @polkadot/api @polkadot/api-contract`,
          external: 'https://polkadot.js.org/docs/api/start/install'
        },
        {
          title: 'Configuración',
          content: 'Configura tu entorno de desarrollo para trabajar con Polkadot.',
          code: `// Configuración básica
const api = await ApiPromise.create({
  provider: new WsProvider('wss://paseo.rpc.amforc.com')
});`,
          external: 'https://polkadot.js.org/docs/api/start/create'
        },
        {
          title: 'Primer Contrato',
          content: 'Crea tu primer contrato inteligente con Ink!',
          code: `#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
pub mod my_contract {
    #[ink(storage)]
    pub struct MyContract {
        value: i32,
    }

    impl MyContract {
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            Self { value: init_value }
        }

        #[ink(message)]
        pub fn get(&self) -> i32 {
            self.value
        }
    }
}`,
          external: 'https://use.ink/getting-started/creating-an-ink-project'
        }
      ]
    },
    {
      id: 'contracts',
      title: 'Contratos',
      description: 'Desarrollo de contratos inteligentes',
      icon: Code,
      subsections: [
        {
          title: 'Estructura de Contratos',
          content: 'Aprende la estructura básica de un contrato Ink!',
          code: `#[ink::contract]
pub mod my_contract {
    use ink_storage::traits::SpreadAllocate;
    
    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct MyContract {
        // Storage variables
    }
    
    impl MyContract {
        // Constructor
        #[ink(constructor)]
        pub fn new() -> Self {
            // Implementation
        }
        
        // Messages
        #[ink(message)]
        pub fn my_message(&self) -> ReturnType {
            // Implementation
        }
    }
}`,
          external: 'https://use.ink/basics/contract'
        },
        {
          title: 'Storage y Variables',
          content: 'Gestiona el almacenamiento de tu contrato de forma eficiente.',
          code: `#[ink(storage)]
pub struct MyContract {
    // Simple types
    value: i32,
    owner: AccountId,
    
    // Collections
    balances: Mapping<AccountId, Balance>,
    users: Vec<AccountId>,
    
    // Custom types
    metadata: Option<String>,
}`,
          external: 'https://use.ink/basics/storage'
        },
        {
          title: 'Eventos',
          content: 'Define y emite eventos en tus contratos.',
          code: `#[ink(event)]
pub struct Transfer {
    #[ink(topic)]
    from: Option<AccountId>,
    #[ink(topic)]
    to: Option<AccountId>,
    value: Balance,
}

// Emitir evento
self.env().emit_event(Transfer {
    from: Some(from),
    to: Some(to),
    value,
});`,
          external: 'https://use.ink/basics/events'
        }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      description: 'Despliega tus contratos en Paseo',
      icon: Globe,
      subsections: [
        {
          title: 'Preparación',
          content: 'Prepara tu contrato para el deployment en Paseo testnet.',
          code: `# Compilar el contrato
cargo contract build

# Generar metadata
cargo contract generate-metadata`,
          external: 'https://use.ink/getting-started/deploy-your-contract'
        },
        {
          title: 'Deployment Manual',
          content: 'Despliega tu contrato manualmente usando Polkadot.js Apps.',
          external: 'https://polkadot.js.org/apps/?rpc=wss://paseo.rpc.amforc.com'
        },
        {
          title: 'Verificación',
          content: 'Verifica que tu contrato se desplegó correctamente.',
          code: `// Verificar deployment
const contract = new ContractPromise(api, abi, contractAddress);
const result = await contract.query.get(account.address, {});
console.log('Contract deployed:', result.output);`,
          external: 'https://polkadot.js.org/docs/api-contract/start/contract.read'
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing',
      description: 'Pruebas y debugging',
      icon: Shield,
      subsections: [
        {
          title: 'Unit Tests',
          content: 'Escribe pruebas unitarias para tus contratos.',
          code: `#[cfg(test)]
mod tests {
    use super::*;
    use ink_env::test;

    #[ink::test]
    fn constructor_works() {
        let contract = MyContract::new(42);
        assert_eq!(contract.get(), 42);
    }
}`,
          external: 'https://use.ink/basics/testing'
        },
        {
          title: 'Integration Tests',
          content: 'Pruebas de integración con el entorno de test.',
          code: `#[ink::test]
fn it_works() {
    let accounts = default_accounts();
    let mut contract = MyContract::new(42);
    
    // Test contract interaction
    let result = contract.set_value(100);
    assert!(result.is_ok());
}`,
          external: 'https://use.ink/basics/testing'
        },
        {
          title: 'Debugging',
          content: 'Herramientas y técnicas para debugging.',
          code: `// Usar ink_env::debug_print! para debugging
ink_env::debug_print!("Debug: value = {}", self.value);

// Usar panic! para errores críticos
if value < 0 {
    panic!("Value cannot be negative");
}`,
          external: 'https://use.ink/basics/debugging'
        }
      ]
    }
  ];

  const handleIntelligentSearch = async () => {
    if (!searchTerm.trim() || isIntelligentSearching) return;

    setIsIntelligentSearching(true);
    setIntelligentSearchResult('');
    setShowIntelligentSearch(true);

    try {
      console.log('[Docs] Iniciando búsqueda inteligente...');
      const { docsSearch } = await import('@/lib/api-client');
      
      const docSectionsData = docSections.map(s => ({
        title: s.title,
        description: s.description
      }));

      let fullResult = '';
      let chunkCount = 0;
      
      for await (const chunk of docsSearch({
        searchQuery: searchTerm,
        docSections: docSectionsData
      })) {
        chunkCount++;
        fullResult += chunk;
        setIntelligentSearchResult(fullResult);
        console.log(`[Docs] Chunk ${chunkCount} recibido, longitud total: ${fullResult.length}`);
      }
      
      console.log(`[Docs] Búsqueda inteligente completada. Total chunks: ${chunkCount}`);
    } catch (error) {
      console.error('[Docs] Error en búsqueda inteligente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setIntelligentSearchResult(`Error: ${errorMessage}`);
    } finally {
      setIsIntelligentSearching(false);
    }
  };

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.subsections.some(sub => 
      sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center flex-wrap gap-2">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
              Documentación
            </h1>
            <p className="text-gray-400">Guía completa para desarrollar en Polkadot</p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex gap-4 max-w-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowIntelligentSearch(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.shiftKey) {
                      e.preventDefault();
                      handleIntelligentSearch();
                    }
                  }}
                  placeholder="Buscar en la documentación... (Shift+Enter para búsqueda inteligente)"
                  className="pl-10"
                />
              </div>
              <Button
                variant="primary"
                onClick={handleIntelligentSearch}
                disabled={!searchTerm.trim() || isIntelligentSearching}
                className="flex items-center"
              >
                {isIntelligentSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    IA
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Intelligent Search Results */}
          {showIntelligentSearch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="p-6 bg-slate-800/50 border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    Búsqueda Inteligente con IA
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={() => setShowIntelligentSearch(false)}
                    className="text-sm"
                  >
                    Cerrar
                  </Button>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap">
                  {isIntelligentSearching && !intelligentSearchResult ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 text-purple-400 animate-spin mr-2" />
                      <span>Analizando con IA...</span>
                    </div>
                  ) : intelligentSearchResult ? (
                    <div className="prose prose-invert max-w-none">
                      <pre className="text-gray-300 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
                        {intelligentSearchResult}
                      </pre>
                      {isIntelligentSearching && (
                        <div className="mt-4 flex items-center text-purple-400 text-sm">
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          <span>Generando más contenido...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">No hay resultados aún</p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Documentation Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {filteredSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedSection(
                      expandedSection === section.id ? null : section.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <section.icon className="w-6 h-6 text-purple-400 mr-3" />
                        <div>
                          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                          <p className="text-gray-400 text-sm">{section.description}</p>
                        </div>
                      </div>
                      {expandedSection === section.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-700"
                    >
                      <div className="p-6 space-y-6">
                        {section.subsections.map((subsection, subIndex) => (
                          <div key={subIndex} className="space-y-3">
                            <h4 className="text-lg font-medium text-white">{subsection.title}</h4>
                            <p className="text-gray-300">{subsection.content}</p>
                            
                            {subsection.code && (
                              <div className="bg-slate-900 rounded-lg p-4">
                                <pre className="text-sm text-gray-300 overflow-x-auto">
                                  <code>{subsection.code}</code>
                                </pre>
                              </div>
                            )}
                            
                            {subsection.external && (
                              <div className="flex items-center space-x-2">
                                <a
                                  href={subsection.external}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-purple-400 hover:text-purple-300"
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Ver documentación oficial
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredSections.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No se encontraron resultados</h3>
              <p className="text-gray-400">Intenta con otros términos de búsqueda</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

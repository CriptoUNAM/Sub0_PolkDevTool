'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Code, 
  Zap, 
  Shield, 
  Rocket,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Check,
  Star,
  Users,
  Clock,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';

const DOCUMENTATION_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Comenzando',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
    articles: [
      {
        title: 'Introducción a Polkadot DevKit',
        description: 'Aprende los conceptos básicos y comienza a desarrollar',
        readTime: '5 min',
        difficulty: 'beginner',
        tags: ['introduction', 'basics'],
        content: `# Introducción a Polkadot DevKit

Polkadot DevKit es una plataforma integral para el desarrollo de contratos inteligentes en el ecosistema Polkadot. Nuestra misión es reducir el tiempo de desarrollo en un 70% mediante herramientas de IA avanzadas.

## Características principales

- **AI Contract Generator**: Genera contratos ink! usando lenguaje natural
- **Template Library**: Biblioteca de plantillas pre-construidas
- **Code Explainer**: Explicaciones detalladas de código
- **Error Debugger**: Debugging inteligente de errores
- **Deployment Assistant**: Asistente paso a paso para deployment

## Flujo de trabajo típico

1. **Describe tu contrato** en lenguaje natural
2. **Genera el código** con nuestro AI
3. **Revisa y personaliza** según tus necesidades
4. **Debug errores** si es necesario
5. **Despliega** a la testnet de Paseo`
      },
      {
        title: 'Configuración del entorno',
        description: 'Configura tu entorno de desarrollo para Polkadot',
        readTime: '10 min',
        difficulty: 'beginner',
        tags: ['setup', 'environment'],
        content: `# Configuración del entorno

## Requisitos previos

- Node.js 18+ 
- Rust 1.70+
- Cargo Contract
- Polkadot.js Extension

## Instalación

\`\`\`bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Instalar Cargo Contract
cargo install cargo-contract --force

# Instalar dependencias del proyecto
npm install
\`\`\`

## Configuración de variables de entorno

\`\`\`env
OPENAI_API_KEY=tu_clave_aqui
NEXT_PUBLIC_PASEO_RPC=wss://paseo.rpc.amforc.com
\`\`\``
      }
    ]
  },
  {
    id: 'ai-generator',
    title: 'AI Generator',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    articles: [
      {
        title: 'Cómo usar el AI Generator',
        description: 'Guía completa para generar contratos con IA',
        readTime: '8 min',
        difficulty: 'intermediate',
        tags: ['ai', 'generator', 'tutorial'],
        content: `# AI Generator

El AI Generator es la característica principal de Polkadot DevKit. Utiliza GPT-4 para generar contratos ink! completos basados en descripciones en lenguaje natural.

## Tipos de contratos soportados

- **PSP-22 Tokens**: Tokens fungibles estándar
- **PSP-34 NFTs**: Tokens no fungibles
- **Governance**: Contratos de gobernanza DAO
- **Staking**: Contratos de staking y recompensas
- **DeFi**: Protocolos DeFi complejos
- **Custom**: Contratos personalizados

## Mejores prácticas para prompts

### ✅ Buenos prompts
- "Crear un token ERC-20 con funcionalidad de staking y recompensas del 10% APY"
- "Implementar un contrato de NFT con royalties para artistas del 5%"
- "Desarrollar un sistema de gobernanza DAO con votación por delegación"

### ❌ Prompts vagos
- "Crear un token"
- "Hacer un contrato"
- "Algo de DeFi"

## Ejemplo de uso

1. Ve a la página **Generar**
2. Selecciona el tipo de contrato
3. Describe tu contrato en detalle
4. Haz clic en "Generar Contrato"
5. Revisa el código generado
6. Personaliza según necesites`
      }
    ]
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    articles: [
      {
        title: 'Biblioteca de plantillas',
        description: 'Explora y usa nuestras plantillas pre-construidas',
        readTime: '6 min',
        difficulty: 'beginner',
        tags: ['templates', 'library'],
        content: `# Biblioteca de plantillas

Nuestra biblioteca incluye más de 20 plantillas pre-construidas y auditadas para acelerar tu desarrollo.

## Categorías disponibles

### Tokens
- PSP-22 básico
- PSP-22 con minting
- PSP-22 con burning
- PSP-22 con pausas

### NFTs
- PSP-34 básico
- PSP-34 con royalties
- PSP-34 con metadata
- PSP-34 con marketplace

### Governance
- DAO básico
- DAO con delegación
- DAO con timelock
- DAO con multisig

### DeFi
- Staking pool
- Lending protocol
- DEX básico
- Yield farming

## Cómo usar plantillas

1. Navega a **Plantillas**
2. Filtra por categoría o complejidad
3. Haz clic en "Ver código"
4. Revisa la implementación
5. Descarga o personaliza`
      }
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: Rocket,
    color: 'from-yellow-500 to-orange-500',
    articles: [
      {
        title: 'Guía de deployment',
        description: 'Despliega tus contratos a Paseo testnet',
        readTime: '12 min',
        difficulty: 'intermediate',
        tags: ['deployment', 'paseo', 'testnet'],
        content: `# Guía de deployment

## Redes soportadas

- **Paseo Testnet**: Red oficial de pruebas de Polkadot
- **Rococo Testnet**: Red de pruebas para parachains
- **Westend Testnet**: Red de pruebas alternativa

## Proceso de deployment

### 1. Preparación
- Compila tu contrato con \`cargo contract build\`
- Verifica que no hay errores de compilación
- Obtén tokens de testnet

### 2. Subir código
- Usa el Deployment Assistant
- Sube el archivo .wasm
- Configura los parámetros del constructor

### 3. Instanciar contrato
- Proporciona los parámetros del constructor
- Confirma la transacción
- Obtén la dirección del contrato

### 4. Verificación
- Verifica en el explorador de bloques
- Prueba las funciones principales
- Documenta la dirección del contrato`
      }
    ]
  },
  {
    id: 'security',
    title: 'Seguridad',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    articles: [
      {
        title: 'Mejores prácticas de seguridad',
        description: 'Guía de seguridad para contratos ink!',
        readTime: '15 min',
        difficulty: 'advanced',
        tags: ['security', 'best-practices', 'audit'],
        content: `# Mejores prácticas de seguridad

## Principios fundamentales

### 1. Validación de entrada
- Siempre valida los parámetros de entrada
- Verifica límites y rangos
- Implementa checks de overflow/underflow

### 2. Control de acceso
- Implementa roles y permisos
- Usa modifiers para restricciones
- Considera pausas de emergencia

### 3. Manejo de errores
- Usa Result<T, Error> para manejo de errores
- Implementa mensajes de error claros
- Considera rollback en caso de fallo

## Patrones de seguridad comunes

### Reentrancy Protection
\`\`\`rust
#[ink(storage)]
pub struct Contract {
    locked: bool,
}

#[ink(message)]
pub fn withdraw(&mut self) -> Result<(), Error> {
    if self.locked {
        return Err(Error::Reentrancy);
    }
    self.locked = true;
    // ... lógica de withdrawal
    self.locked = false;
    Ok(())
}
\`\`\`

### Access Control
\`\`\`rust
#[ink(message)]
pub fn admin_function(&mut self) -> Result<(), Error> {
    if self.env().caller() != self.admin {
        return Err(Error::Unauthorized);
    }
    // ... lógica de admin
    Ok(())
}
\`\`\``
      }
    ]
  }
];

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const filteredSections = DOCUMENTATION_SECTIONS.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(section => section.articles.length > 0);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-purple-400 mr-4" />
              <h1 className="text-5xl font-bold gradient-text">Documentación</h1>
            </div>
            <p className="text-2xl text-gray-300 mb-8">
              Guías completas para dominar Polkadot DevKit
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                placeholder="Buscar en la documentación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-8">
                <h3 className="text-lg font-semibold mb-4">Contenido</h3>
                <div className="space-y-2">
                  {filteredSections.map((section) => (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color} mr-3`}>
                            <section.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{section.title}</span>
                        </div>
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {expandedSections.includes(section.id) && (
                        <div className="ml-8 space-y-1 mt-2">
                          {section.articles.map((article, index) => (
                            <button
                  key={index}
                              onClick={() => setSelectedArticle(article)}
                              className="w-full text-left p-2 text-sm hover:bg-white/5 rounded transition-colors"
                            >
                              {article.title}
                            </button>
                          ))}
                      </div>
                      )}
                    </div>
                      ))}
                    </div>
                  </Card>
          </motion.div>

            {/* Main Content */}
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-3"
            >
              {selectedArticle ? (
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                      <p className="text-gray-400">{selectedArticle.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedArticle.difficulty)}`}>
                        {selectedArticle.difficulty}
                          </span>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedArticle.readTime}
                      </div>
                    </div>
                      </div>
                      
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                      {selectedArticle.content}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(selectedArticle.content)}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Selecciona un artículo</h3>
                    <p className="text-gray-400">
                      Elige un artículo del menú lateral para comenzar a leer
                    </p>
                    </div>
                  </Card>
              )}
                </motion.div>
            </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <Card>
              <h3 className="text-2xl font-semibold text-center mb-8 gradient-text">
                Estadísticas de la documentación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {DOCUMENTATION_SECTIONS.length}
                  </div>
                  <div className="text-gray-400">Secciones</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {DOCUMENTATION_SECTIONS.reduce((sum, section) => sum + section.articles.length, 0)}
                  </div>
                  <div className="text-gray-400">Artículos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {DOCUMENTATION_SECTIONS.reduce((sum, section) => 
                      sum + section.articles.reduce((articleSum, article) => 
                        articleSum + parseInt(article.readTime), 0
                      ), 0
                    )} min
                  </div>
                  <div className="text-gray-400">Tiempo de lectura</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {DOCUMENTATION_SECTIONS.reduce((sum, section) => 
                      sum + section.articles.filter(article => article.difficulty === 'beginner').length, 0
                    )}
                  </div>
                  <div className="text-gray-400">Para principiantes</div>
                </div>
              </div>
              </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
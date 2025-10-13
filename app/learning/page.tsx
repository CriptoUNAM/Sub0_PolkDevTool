'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ExternalLink, 
  Play, 
  Code, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  ChevronRight,
  Star,
  Clock,
  Award,
  FileText,
  Video,
  Download,
  Search,
  Filter,
  ArrowRight,
  Brain,
  Rocket,
  Target,
  Lightbulb
} from 'lucide-react';
import { LearningBackground } from '@/components/backgrounds/LearningBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LearningCard } from '@/components/ui/LearningCard';
import { LearningStats } from '@/components/learning/LearningStats';
import { LearningPath } from '@/components/learning/LearningPath';

export default function LearningPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Todos', icon: BookOpen },
    { id: 'tutorials', name: 'Tutoriales', icon: Play },
    { id: 'docs', name: 'Documentación', icon: FileText },
    { id: 'videos', name: 'Videos', icon: Video },
    { id: 'tools', name: 'Herramientas', icon: Code }
  ];

  const learningResources = [
    {
      id: 1,
      title: 'Introducción a Polkadot 2.0',
      description: 'Aprende los fundamentos del ecosistema Polkadot y las nuevas características de la versión 2.0',
      category: 'tutorials',
      type: 'Tutorial',
      duration: '45 min',
      difficulty: 'Principiante',
      rating: 4.8,
      image: '/api/placeholder/400/200',
      url: 'https://docs.polkadot.network/docs/learn',
      featured: true,
      tags: ['Polkadot', 'Blockchain', 'Fundamentos']
    },
    {
      id: 2,
      title: 'Desarrollo de Parachains en Paseo',
      description: 'Guía completa para desarrollar y desplegar parachains en la testnet Paseo',
      category: 'tutorials',
      type: 'Guía Avanzada',
      duration: '2 horas',
      difficulty: 'Intermedio',
      rating: 4.9,
      image: '/api/placeholder/400/200',
      url: 'https://docs.polkadot.com/tutorials/polkadot-sdk/parachains/zero-to-hero/',
      featured: true,
      tags: ['Parachains', 'Paseo', 'Desarrollo']
    },
    {
      id: 3,
      title: 'Contratos Inteligentes con ink!',
      description: 'Tutorial paso a paso para crear contratos inteligentes usando el lenguaje ink!',
      category: 'tutorials',
      type: 'Tutorial Práctico',
      duration: '1.5 horas',
      difficulty: 'Intermedio',
      rating: 4.7,
      image: '/api/placeholder/400/200',
      url: 'https://use.ink/getting-started/creating-an-ink-project',
      featured: true,
      tags: ['ink!', 'Smart Contracts', 'Rust']
    },
    {
      id: 4,
      title: 'Documentación Oficial de Polkadot',
      description: 'Documentación completa y actualizada del ecosistema Polkadot',
      category: 'docs',
      type: 'Documentación',
      duration: 'Referencia',
      difficulty: 'Todos',
      rating: 4.9,
      image: '/api/placeholder/400/200',
      url: 'https://docs.polkadot.network/',
      featured: false,
      tags: ['Documentación', 'Oficial', 'Referencia']
    },
    {
      id: 5,
      title: 'Paseo Network - Testnet Oficial',
      description: 'Recursos y documentación de la testnet Paseo para desarrolladores',
      category: 'docs',
      type: 'Documentación',
      duration: 'Referencia',
      difficulty: 'Todos',
      rating: 4.8,
      image: '/api/placeholder/400/200',
      url: 'https://www.paseo.site/',
      featured: false,
      tags: ['Paseo', 'Testnet', 'Desarrollo']
    },
    {
      id: 6,
      title: 'Substrate Framework',
      description: 'Documentación completa del framework Substrate para construir blockchains',
      category: 'docs',
      type: 'Documentación',
      duration: 'Referencia',
      difficulty: 'Avanzado',
      rating: 4.8,
      image: '/api/placeholder/400/200',
      url: 'https://docs.substrate.io/',
      featured: false,
      tags: ['Substrate', 'Framework', 'Blockchain']
    },
    {
      id: 7,
      title: 'Curso Completo de Polkadot en Español',
      description: 'Serie de videos educativos sobre Polkadot en español',
      category: 'videos',
      type: 'Curso',
      duration: '3 horas',
      difficulty: 'Principiante',
      rating: 4.9,
      image: '/api/placeholder/400/200',
      url: 'https://www.youtube.com/results?search_query=polkadot+tutorial+español',
      featured: true,
      tags: ['Español', 'Curso', 'Educativo']
    },
    {
      id: 8,
      title: 'Herramientas de Desarrollo',
      description: 'Kit completo de herramientas para desarrollo en Polkadot',
      category: 'tools',
      type: 'Herramientas',
      duration: 'Setup',
      difficulty: 'Todos',
      rating: 4.7,
      image: '/api/placeholder/400/200',
      url: 'https://github.com/polkadot-js/apps',
      featured: false,
      tags: ['Herramientas', 'Desarrollo', 'Kit']
    }
  ];

  const featuredResources = learningResources.filter(resource => resource.featured);
  const filteredResources = learningResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'text-green-400 bg-green-400/20';
      case 'Intermedio': return 'text-yellow-400 bg-yellow-400/20';
      case 'Avanzado': return 'text-red-400 bg-red-400/20';
      default: return 'text-blue-400 bg-blue-400/20';
    }
  };

  const learningPaths = [
    {
      title: 'Ruta de Aprendizaje: Desarrollador Polkadot',
      description: 'Domina el desarrollo en el ecosistema Polkadot desde cero hasta nivel avanzado',
      totalDuration: '40 horas',
      difficulty: 'Intermedio',
      steps: [
        {
          id: 'fundamentals',
          title: 'Fundamentos de Polkadot',
          description: 'Aprende los conceptos básicos del ecosistema Polkadot, parachains y consensus',
          duration: '8 horas',
          difficulty: 'Principiante' as const,
          completed: true,
          locked: false,
          resources: 12,
          icon: BookOpen
        },
        {
          id: 'substrate',
          title: 'Framework Substrate',
          description: 'Domina el framework Substrate para construir blockchains personalizadas',
          duration: '12 horas',
          difficulty: 'Intermedio' as const,
          completed: true,
          locked: false,
          resources: 18,
          icon: Code
        },
        {
          id: 'ink-contracts',
          title: 'Contratos Inteligentes con ink!',
          description: 'Desarrolla contratos inteligentes usando el lenguaje ink! y Rust',
          duration: '10 horas',
          difficulty: 'Intermedio' as const,
          completed: false,
          locked: false,
          resources: 15,
          icon: Code
        },
        {
          id: 'parachain-development',
          title: 'Desarrollo de Parachains',
          description: 'Construye y despliega tu propia parachain en Paseo testnet',
          duration: '8 horas',
          difficulty: 'Avanzado' as const,
          completed: false,
          locked: false,
          resources: 20,
          icon: Rocket
        },
        {
          id: 'advanced-features',
          title: 'Características Avanzadas',
          description: 'Explora governance, staking, y características avanzadas del ecosistema',
          duration: '2 horas',
          difficulty: 'Avanzado' as const,
          completed: false,
          locked: true,
          resources: 8,
          icon: Award
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <LearningBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6"
            >
              <Brain className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-300">Centro de Aprendizaje</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 gradient-text">
              Learning Hub
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Domina Polkadot y Paseo con tutoriales, documentación oficial y recursos actualizados
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar tutoriales, documentación..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-gray-900">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Learning Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <LearningStats />
          </motion.div>

          {/* Learning Paths */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
                Rutas de Aprendizaje Estructuradas
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Sigue rutas de aprendizaje diseñadas por expertos para dominar Polkadot paso a paso
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <LearningPath
                    title={path.title}
                    description={path.description}
                    steps={path.steps}
                    totalDuration={path.totalDuration}
                    difficulty={path.difficulty}
                    onStepClick={(stepId) => {
                      console.log('Step clicked:', stepId);
                      // Implement navigation to specific step
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Resources */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Recursos Destacados</h2>
              <div className="flex items-center text-sm text-gray-400">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>Contenido Premium</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <LearningCard
                    title={resource.title}
                    description={resource.description}
                    type={resource.type}
                    duration={resource.duration}
                    difficulty={resource.difficulty}
                    rating={resource.rating}
                    featured={resource.featured}
                    tags={resource.tags}
                    url={resource.url}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Resources */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
                Todos los Recursos ({filteredResources.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.05 }}
                >
                  <LearningCard
                    title={resource.title}
                    description={resource.description}
                    type={resource.type}
                    duration={resource.duration}
                    difficulty={resource.difficulty}
                    rating={resource.rating}
                    featured={resource.featured}
                    tags={resource.tags}
                    url={resource.url}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Start Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16"
          >
            <Card className="p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 gradient-text">
                  ¿No sabes por dónde empezar?
                </h2>
                <p className="text-gray-400 mb-8">
                  Sigue nuestra ruta de aprendizaje recomendada para dominar Polkadot paso a paso
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Fundamentos</h3>
                    <p className="text-sm text-gray-400">Aprende los conceptos básicos de Polkadot</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">2. Desarrollo</h3>
                    <p className="text-sm text-gray-400">Construye tu primera parachain</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Avanzado</h3>
                    <p className="text-sm text-gray-400">Domina las características avanzadas</p>
                  </div>
                </div>
                <Button size="lg" className="group">
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Ruta de Aprendizaje
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

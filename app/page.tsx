'use client';

import { useState } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Brain, 
  Code, 
  FileText, 
  Bug, 
  BookOpen, 
  Rocket,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  CheckCircle2,
  TrendingUp,
  Users,
  Clock,
  Layers,
  Network,
  Database,
  Globe,
  Award,
  Target,
  BarChart3,
  Cpu,
  Lock,
  PlayCircle,
  Star,
  GitBranch,
  Code2,
  TestTube,
  MessageSquare,
  Search,
  FileCode,
  Wallet
} from 'lucide-react';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SubWalletInstructions } from '@/components/wallet/SubWalletInstructions';
import { useSubWallet } from '@/lib/hooks/useSubWallet';

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredContract, setHoveredContract] = useState<number | null>(null);
  const subWalletInfo = useSubWallet();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const features = [
    {
      icon: Brain,
      title: 'AI Contract Generator',
      description: 'Genera contratos ink!, Solidity y Rust/Substrate con lenguaje natural usando Gemini AI',
      color: 'from-purple-500 to-pink-500',
      href: '/generate',
      stats: '3 lenguajes, 3 niveles'
    },
    {
      icon: Code,
      title: 'Template Library',
      description: 'Biblioteca de 20+ plantillas auditadas: PSP-22, PSP-34, DAO, DeFi, Staking y más',
      color: 'from-cyan-500 to-blue-500',
      href: '/templates',
      stats: '20+ templates'
    },
    {
      icon: FileText,
      title: 'Code Explainer',
      description: 'Explicaciones detalladas de código con enfoques: general, seguridad, optimización',
      color: 'from-green-500 to-emerald-500',
      href: '/explain',
      stats: 'IA-powered'
    },
    {
      icon: Bug,
      title: 'Error Debugger',
      description: 'Debugging inteligente de errores de compilación, runtime y lógica con soluciones paso a paso',
      color: 'from-red-500 to-orange-500',
      href: '/debug',
      stats: 'Solución automática'
    },
    {
      icon: BookOpen,
      title: 'Documentation Search',
      description: 'Búsqueda semántica inteligente en documentación completa de Polkadot/Substrate',
      color: 'from-indigo-500 to-purple-500',
      href: '/docs',
      stats: 'Búsqueda IA'
    },
    {
      icon: Rocket,
      title: 'Deployment Assistant',
      description: 'Asistente paso a paso para deployment en Paseo, Westend y Polkadot Mainnet',
      color: 'from-pink-500 to-rose-500',
      href: '/deploy',
      stats: 'Multi-red'
    },
    {
      icon: TestTube,
      title: 'Test Generator',
      description: 'Genera tests completos automáticamente para tus contratos ink!, Solidity y Rust',
      color: 'from-yellow-500 to-orange-500',
      href: '/generate',
      stats: 'Tests automáticos'
    },
    {
      icon: MessageSquare,
      title: 'AI Chatbot',
      description: 'Asistente conversacional experto en Polkadot, Substrate e ink! disponible 24/7',
      color: 'from-blue-500 to-cyan-500',
      href: '/chatbot',
      stats: 'Asistente IA'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Métricas en tiempo real, insights de IA y análisis profundo del uso de la plataforma',
      color: 'from-purple-500 to-indigo-500',
      href: '/analytics',
      stats: 'Insights IA'
    }
  ];

  const smartContracts = [
    {
      name: 'DevKit Showcase Contract',
      description: 'DAO Governance completo con sistema de staking y recompensas automáticas',
      features: ['Propuestas y votación', 'Staking de tokens', 'Recompensas automáticas', 'Gobernanza descentralizada'],
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/50',
      icon: Layers,
      track: 'Polkadot Main Track',
      trackColor: 'text-purple-400'
    },
    {
      name: 'Arkiv Data Storage',
      description: 'Registro de contratos con metadata off-chain usando Arkiv SDK (CRUD, TTL, Subscriptions)',
      features: ['Integración Arkiv SDK', 'TTL para datos temporales', 'Subscriptions en tiempo real', 'Queries avanzadas'],
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/50',
      icon: Database,
      track: 'Arkiv Main Track',
      trackColor: 'text-cyan-400'
    },
    {
      name: 'Hyperbridge Cross-Chain Oracle',
      description: 'Oracle de precios cross-chain con verificación de datos desde múltiples blockchains',
      features: ['Storage queries cross-chain', 'Verificación de datos', 'Múltiples validadores', 'Interoperabilidad'],
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/50',
      icon: Network,
      track: 'Hyperbridge Bounty',
      trackColor: 'text-green-400'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: '70% Más Rápido',
      description: 'Reduce tiempo de desarrollo de semanas a minutos',
      metric: '2.3 segundos promedio'
    },
    {
      icon: Users,
      title: '50,000+ Desarrolladores',
      description: 'Potencial de impacto en el ecosistema Polkadot',
      metric: 'Democratización total'
    },
    {
      icon: Shield,
      title: 'Código Seguro',
      description: 'Sigue mejores prácticas y estándares de seguridad',
      metric: '98.7% tasa de éxito'
    },
    {
      icon: TrendingUp,
      title: 'Listo para Producción',
      description: 'Código optimizado y compilable desde el primer intento',
      metric: 'Enterprise-ready'
    }
  ];

  const tracks = [
    {
      name: 'Polkadot Main Track',
      prize: '$16k',
      status: '✅ Listo',
      contracts: ['DevKit Showcase'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Arkiv Main Track',
      prize: '$10k',
      status: '✅ Listo',
      contracts: ['Arkiv Data Storage'],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Hyperbridge Bounty',
      prize: '$5k',
      status: '✅ Listo',
      contracts: ['Hyperbridge Oracle'],
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe tu contrato',
      description: 'Usa lenguaje natural para describir lo que quieres construir',
      icon: MessageSquare
    },
    {
      number: '02',
      title: 'AI genera el código',
      description: 'Gemini AI genera código ink!/Solidity/Rust optimizado y seguro',
      icon: Sparkles
    },
    {
      number: '03',
      title: 'Revisa y personaliza',
      description: 'Explica el código, debug errores, genera tests y personaliza',
      icon: Code2
    },
    {
      number: '04',
      title: 'Deploy a Paseo',
      description: 'Despliega directamente a Paseo Testnet con un click',
      icon: Rocket
    }
  ];

  const stats = [
    { label: 'Contratos Generados', value: '1,247+', icon: FileCode },
    { label: 'Usuarios Activos', value: '3,421+', icon: Users },
    { label: 'Tasa de Éxito', value: '98.7%', icon: CheckCircle2 },
    { label: 'Tiempo Promedio', value: '2.3s', icon: Zap }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-16 sm:pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            style={{ opacity, scale }}
            className="text-center mb-8 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6"
            >
              <Award className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-300">sub0 Hackathon 2025 - Buenos Aires</span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 xs:mb-4 sm:mb-5 md:mb-6 gradient-text leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Polkadot DevKit
            </motion.h1>
            <motion.p 
              className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-2 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              La primera plataforma{' '}
              <span className="gradient-text font-bold">AI-powered</span>
              {' '}para desarrollo de contratos inteligentes en Polkadot
            </motion.p>
            <motion.p 
              className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 mb-4 xs:mb-6 sm:mb-8 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Reduce el tiempo de desarrollo de{' '}
              <span className="gradient-text font-bold">semanas a minutos</span>
              {' '}con Inteligencia Artificial
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/generate">
                <Button size="lg" className="group backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Comenzar a Generar
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/test">
                <Button variant="secondary" size="lg" className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Ver Demo Completa
                </Button>
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 xs:mb-10 sm:mb-12 px-2"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl xs:rounded-2xl p-2 xs:p-3 sm:p-4 text-center hover:bg-white/10 transition-all"
                >
                  <stat.icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mx-auto mb-1 xs:mb-2 text-purple-400" />
                  <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-0.5 xs:mb-1">{stat.value}</div>
                  <div className="text-[10px] xs:text-xs sm:text-sm text-gray-400 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Smart Contracts Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-12 sm:mb-20"
          >
            <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-2">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 gradient-text">
                Smart Contracts Desplegables
              </h2>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
                3 contratos inteligentes estratégicos listos para deployment en Paseo Testnet
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm border border-purple-500/30">
                  $31k en Premios Potenciales
                </span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-sm border border-cyan-500/30">
                  Paseo Testnet Ready
                </span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-sm border border-green-500/30">
                  Multi-Track Integration
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 mb-6 xs:mb-8 px-2">
              {smartContracts.map((contract, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                  onHoverStart={() => setHoveredContract(index)}
                  onHoverEnd={() => setHoveredContract(null)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative"
                >
                  <Card className={`h-full p-6 backdrop-blur-xl bg-gradient-to-br ${contract.color} border-2 ${contract.borderColor} hover:border-opacity-100 transition-all duration-300`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${contract.color} border ${contract.borderColor}`}>
                        <contract.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${contract.trackColor} bg-black/20 border ${contract.borderColor}`}>
                        {contract.track}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{contract.name}</h3>
                    <p className="text-gray-300 mb-4 text-sm">{contract.description}</p>
                    <div className="space-y-2">
                      {contract.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-300">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    {hoveredContract === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tracks Info */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {tracks.map((track, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  className={`backdrop-blur-xl bg-gradient-to-br ${track.color} border-2 border-white/20 rounded-2xl p-6 text-center`}
                >
                  <div className="text-3xl font-bold text-white mb-2">{track.prize}</div>
                  <div className="text-lg font-semibold text-white/90 mb-2">{track.name}</div>
                  <div className="text-sm text-white/70 mb-3">{track.status}</div>
                  <div className="text-xs text-white/60">
                    {track.contracts.join(', ')}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mb-12 sm:mb-20"
          >
            <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-2">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 gradient-text">
                Beneficios Clave
              </h2>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
                Por qué Polkadot DevKit es la herramienta definitiva para desarrollo en Polkadot
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 px-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <Card className="h-full p-6 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{benefit.title}</h3>
                    <p className="text-gray-400 mb-3 text-sm">{benefit.description}</p>
                    <div className="text-xs text-purple-400 font-medium">{benefit.metric}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mb-12 sm:mb-20"
          >
            <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-2">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 gradient-text">
                Características Principales
              </h2>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
                Todo lo que necesitas para desarrollar en Polkadot, en un solo lugar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 px-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 + index * 0.05 }}
                >
                  <Link href={feature.href}>
                    <Card className="h-full p-4 sm:p-6 cursor-pointer group backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all relative overflow-hidden">
                      <div className="flex items-center mb-4">
                        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${feature.color} mr-3 sm:mr-4 shadow-lg`}>
                          <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-white">{feature.title}</h3>
                          <div className="text-xs text-purple-400 mt-1">{feature.stats}</div>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                        {feature.description}
                      </p>
                      {hoveredFeature === index && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10 rounded-2xl`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="mb-12 sm:mb-20"
          >
            <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-2">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 xs:mb-4 gradient-text">
                ¿Cómo funciona?
              </h2>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
                De idea a contrato desplegado en 4 pasos simples
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-8 px-2">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.2 + index * 0.2 }}
                  className="relative"
                >
                  <Card className="p-4 sm:p-6 text-center backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all h-full">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold text-white shadow-lg">
                      {step.number}
                    </div>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400">{step.description}</p>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2 z-0" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Integration Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="mb-12 sm:mb-20"
          >
            <Card className="p-6 sm:p-8 max-w-6xl mx-auto backdrop-blur-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border-2 border-purple-500/30">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
                  <Rocket className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-purple-300">sub0 Hackathon 2025</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
                  Integración Completa con el Ecosistema Polkadot
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  Desarrollado específicamente para maximizar oportunidades en el hackathon
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 xs:gap-4 mb-4 xs:mb-6">
                {[
                  { name: 'Polkadot 2.0', icon: Network, color: 'from-purple-500 to-pink-500' },
                  { name: 'Paseo Testnet', icon: Globe, color: 'from-cyan-500 to-blue-500' },
                  { name: 'SubWallet', icon: Wallet, color: 'from-green-500 to-emerald-500' },
                  { name: 'ink! Contracts', icon: Code, color: 'from-yellow-500 to-orange-500' },
                  { name: 'Arkiv SDK', icon: Database, color: 'from-blue-500 to-cyan-500' },
                  { name: 'Hyperbridge', icon: GitBranch, color: 'from-green-500 to-teal-500' }
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.5 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="text-center p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${tech.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <tech.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{tech.name}</h3>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                    Gemini AI
                  </span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm border border-pink-500/30">
                    Next.js 15
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30">
                    Tailwind CSS
                  </span>
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm border border-yellow-500/30">
                    Framer Motion
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Stack tecnológico moderno y optimizado para desarrollo blockchain
                </p>
              </div>
            </Card>
          </motion.div>

          {/* SubWallet Setup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.6 }}
            className="mb-8 sm:mb-16"
          >
            <SubWalletInstructions 
              isAvailable={subWalletInfo.isAvailable}
              isConnected={subWalletInfo.isConnected}
            />
          </motion.div>

          {/* Demo Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            className="text-center"
          >
            <Card className="p-4 xs:p-6 sm:p-8 max-w-4xl mx-auto backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
              <div className="flex items-center justify-center mb-3 xs:mb-4 sm:mb-6 flex-wrap gap-2">
                <Zap className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-yellow-500" />
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-white">Demo en Vivo</h3>
                <Shield className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
              <p className="text-xs xs:text-sm sm:text-base text-gray-300 mb-3 xs:mb-4 sm:mb-6 px-2">
                Ve cómo generar un contrato completo de DAO con staking y gobernanza en tiempo real
              </p>
              <p className="text-[10px] xs:text-xs sm:text-sm text-gray-400 mb-4 xs:mb-6 px-2">
                Incluye: Generación con IA, Deployment simulado, Funciones Write/Read, Integración con Polkadot.js
              </p>
              <Link href="/test">
                <Button size="lg" className="animate-pulse-glow backdrop-blur-xl bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600">
                  <Rocket className="w-5 h-5 mr-2" />
                  Ver Demo Completa
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
            className="text-center mt-12 sm:mt-16"
          >
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-3 xs:mb-4 gradient-text px-2">
              ¿Listo para comenzar?
            </h2>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 mb-6 xs:mb-8 max-w-2xl mx-auto px-2">
              Únete a miles de desarrolladores que ya están construyendo el futuro de Polkadot
            </p>
            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center px-2">
              <Link href="/generate">
                <Button size="lg" className="backdrop-blur-xl bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generar tu Primer Contrato
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="secondary" size="lg" className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20">
                  <Code className="w-5 h-5 mr-2" />
                  Explorar Plantillas
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

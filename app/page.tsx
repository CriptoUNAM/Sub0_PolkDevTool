'use client';

import { useState } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Shield
} from 'lucide-react';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SubWalletInstructions } from '@/components/wallet/SubWalletInstructions';
import { useSubWallet } from '@/lib/hooks/useSubWallet';

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const subWalletInfo = useSubWallet();

  const features = [
    {
      icon: Brain,
      title: 'AI Contract Generator',
      description: 'Genera contratos ink! con lenguaje natural usando GPT-4',
      color: 'from-purple-500 to-pink-500',
      href: '/generate'
    },
    {
      icon: Code,
      title: 'Template Library',
      description: 'Biblioteca de plantillas PSP-22, PSP-34, Governance y más',
      color: 'from-cyan-500 to-blue-500',
      href: '/templates'
    },
    {
      icon: FileText,
      title: 'Code Explainer',
      description: 'Explicaciones detalladas de código Substrate/ink!',
      color: 'from-green-500 to-emerald-500',
      href: '/explain'
    },
    {
      icon: Bug,
      title: 'Error Debugger',
      description: 'Debugging inteligente de errores de compilación',
      color: 'from-red-500 to-orange-500',
      href: '/debug'
    },
    {
      icon: BookOpen,
      title: 'Documentation Search',
      description: 'Búsqueda semántica en documentación Polkadot',
      color: 'from-indigo-500 to-purple-500',
      href: '/docs'
    },
    {
      icon: Rocket,
      title: 'Deployment Assistant',
      description: 'Asistente paso a paso para deployment',
      color: 'from-pink-500 to-rose-500',
      href: '/deploy'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe tu contrato',
      description: 'Usa lenguaje natural para describir lo que quieres construir'
    },
    {
      number: '02',
      title: 'AI genera el código',
      description: 'Nuestro AI genera código ink! optimizado y seguro'
    },
    {
      number: '03',
      title: 'Revisa y personaliza',
      description: 'Explica el código, debug errores, y personaliza según necesites'
    },
    {
      number: '04',
      title: 'Deploy a Paseo',
      description: 'Despliega directamente a la testnet de Paseo'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-16 sm:pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-16"
          >
            <motion.h1 
              className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 gradient-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Polkadot DevKit
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-2xl md:text-3xl text-gray-300 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Reduce el tiempo de desarrollo de Substrate en un{' '}
              <span className="gradient-text font-bold">70%</span>
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/generate">
                <Button size="lg" className="group">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Comenzar a Generar
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="secondary" size="lg">
                  <Code className="w-5 h-5 mr-2" />
                  Ver Plantillas
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* sub0 Hack 2025 Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-12 sm:mb-20"
          >
            <Card className="p-6 sm:p-8 max-w-6xl mx-auto border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
              <div className="text-center mb-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
                  <Rocket className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-purple-300">Proyecto sub0 Hack 2025</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
                  Desarrollado para Polkadot y Paseo Testnet
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  Proyecto especializado para desarrolladores en EE. UU., Argentina, Brasil, México y Colombia
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🇺🇸</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">EE. UU.</h3>
                  <p className="text-sm text-gray-400">Estados Unidos</p>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🇦🇷</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">Argentina</h3>
                  <p className="text-sm text-gray-400">América Latina</p>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🇧🇷</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">Brasil</h3>
                  <p className="text-sm text-gray-400">América Latina</p>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🇲🇽</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">México</h3>
                  <p className="text-sm text-gray-400">América Latina</p>
                </div>
                
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🇨🇴</span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">Colombia</h3>
                  <p className="text-sm text-gray-400">América Latina</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  Herramienta especializada para el ecosistema Polkadot con integración completa a Paseo Testnet
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30">
                    Polkadot 2.0
                  </span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm border border-pink-500/30">
                    Paseo Testnet
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                    SubWallet
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30">
                    ink! Smart Contracts
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={feature.href}>
                  <Card className="h-full p-4 sm:p-6 cursor-pointer group">
                    <div className="flex items-center mb-4">
                      <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${feature.color} mr-3 sm:mr-4`}>
                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                    {hoveredFeature === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 gradient-text">
              ¿Cómo funciona?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                  className="relative"
                >
                  <Card className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold text-white">
                      {step.number}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400">{step.description}</p>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SubWallet Setup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
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
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center"
          >
            <Card className="p-4 sm:p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mr-2 sm:mr-3" />
                <h3 className="text-xl sm:text-2xl font-bold">Demo en Vivo</h3>
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 ml-2 sm:ml-3" />
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
                Ve cómo generar un contrato de staking con 10% APY en tiempo real
              </p>
              <Link href="/test">
                <Button size="lg" className="animate-pulse-glow">
                  <Rocket className="w-5 h-5 mr-2" />
                  Ver Demo Completa
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

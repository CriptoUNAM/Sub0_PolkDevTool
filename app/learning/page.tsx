'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Star,
  Award,
  Target
} from 'lucide-react';
import Link from 'next/link';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  lessons: number;
  completed: boolean;
}

export default function LearningPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Learning</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const learningPaths: LearningPath[] = [
    {
      id: '1',
      title: 'Introducción a Polkadot',
      description: 'Aprende los conceptos básicos de Polkadot y su ecosistema',
      duration: '2 horas',
      difficulty: 'Beginner',
      progress: 75,
      lessons: 8,
      completed: false
    },
    {
      id: '2',
      title: 'Desarrollo con Substrate',
      description: 'Crea tu primera blockchain con Substrate',
      duration: '4 horas',
      difficulty: 'Intermediate',
      progress: 30,
      lessons: 12,
      completed: false
    },
    {
      id: '3',
      title: 'Contratos Inteligentes',
      description: 'Desarrolla contratos inteligentes para Polkadot',
      duration: '3 horas',
      difficulty: 'Advanced',
      progress: 0,
      lessons: 10,
      completed: false
    },
    {
      id: '4',
      title: 'Deploy en Paseo',
      description: 'Despliega tu aplicación en la testnet de Paseo',
      duration: '1 hora',
      difficulty: 'Intermediate',
      progress: 100,
      lessons: 5,
      completed: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

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
              <BookOpen className="w-8 h-8 mr-3 text-purple-400" />
              Centro de Aprendizaje
            </h1>
            <p className="text-gray-400">Domina el desarrollo en Polkadot paso a paso</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-blue-400 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-white">4</h3>
                  <p className="text-gray-400 text-sm">Rutas de Aprendizaje</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-white">1</h3>
                  <p className="text-gray-400 text-sm">Completadas</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-400 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-white">10h</h3>
                  <p className="text-gray-400 text-sm">Tiempo Total</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-purple-400 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-white">25%</h3>
                  <p className="text-gray-400 text-sm">Progreso General</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Learning Paths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Rutas de Aprendizaje</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {learningPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{path.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{path.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {path.duration}
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {path.lessons} lecciones
                          </div>
                        </div>
                      </div>
                      {path.completed && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progreso</span>
                        <span className="text-sm text-white">{path.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </span>
                      <Button 
                        variant={path.completed ? "secondary" : "primary"}
                        className="flex items-center"
                      >
                        {path.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completado
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {path.progress > 0 ? 'Continuar' : 'Comenzar'}
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Logros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Primer Deploy', description: 'Despliega tu primera aplicación', icon: Award, unlocked: true },
                { title: 'Contrato Maestro', description: 'Crea 10 contratos inteligentes', icon: Star, unlocked: false },
                { title: 'Polkadot Pro', description: 'Completa todas las rutas', icon: Target, unlocked: false }
              ].map((achievement, index) => (
                <Card key={index} className={`p-6 border-slate-700 ${
                  achievement.unlocked ? 'bg-slate-800/50' : 'bg-slate-900/50 opacity-50'
                }`}>
                  <div className="flex items-center mb-3">
                    <achievement.icon className={`w-6 h-6 mr-3 ${
                      achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                    }`} />
                    <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

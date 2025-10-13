'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Users, 
  Star,
  Target,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function LearningStats() {
  const stats = [
    {
      icon: BookOpen,
      label: 'Recursos Disponibles',
      value: '50+',
      description: 'Tutoriales y documentación',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      label: 'Horas de Contenido',
      value: '120+',
      description: 'Contenido educativo',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      label: 'Estudiantes Activos',
      value: '2.5K+',
      description: 'Desarrolladores aprendiendo',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Star,
      label: 'Calificación Promedio',
      value: '4.8/5',
      description: 'Satisfacción del usuario',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const achievements = [
    {
      icon: Target,
      title: 'Fundamentos Completados',
      description: 'Has dominado los conceptos básicos',
      progress: 100,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Desarrollo en Progreso',
      description: 'Construyendo tu primera parachain',
      progress: 65,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Nivel Avanzado',
      description: 'Próximo objetivo: Características avanzadas',
      progress: 0,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 text-center group cursor-pointer">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-300 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-400">{stat.description}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Learning Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold gradient-text">Tu Progreso de Aprendizaje</h3>
            <div className="flex items-center text-sm text-gray-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>En progreso</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <achievement.icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{achievement.title}</h4>
                    <span className="text-sm text-gray-400">{achievement.progress}%</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${achievement.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

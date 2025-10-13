'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  ArrowRight,
  BookOpen,
  Code,
  Rocket,
  Award,
  Clock,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  completed: boolean;
  locked: boolean;
  resources: number;
  icon: React.ComponentType<any>;
}

interface LearningPathProps {
  title: string;
  description: string;
  steps: LearningStep[];
  totalDuration: string;
  difficulty: string;
  onStepClick?: (stepId: string) => void;
}

export function LearningPath({ 
  title, 
  description, 
  steps, 
  totalDuration, 
  difficulty,
  onStepClick 
}: LearningPathProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Intermedio': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Avanzado': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    }
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-400 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              {totalDuration}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Progreso</span>
            <span className="text-sm text-gray-400">{completedSteps}/{steps.length} completados</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            className={`relative p-4 rounded-xl border transition-all duration-300 ${
              step.completed 
                ? 'bg-green-500/10 border-green-500/30' 
                : step.locked 
                ? 'bg-gray-700/30 border-gray-600/30 cursor-not-allowed' 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer'
            }`}
            onClick={() => !step.locked && onStepClick?.(step.id)}
          >
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-purple-500/50 to-pink-500/50" />
            )}

            <div className="flex items-start space-x-4">
              {/* Step Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                step.completed 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : step.locked 
                  ? 'bg-gray-600/20 border border-gray-600/30' 
                  : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : step.locked ? (
                  <Lock className="w-6 h-6 text-gray-500" />
                ) : (
                  <step.icon className="w-6 h-6 text-purple-400" />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${
                    step.completed ? 'text-green-300' : step.locked ? 'text-gray-500' : 'text-white'
                  }`}>
                    {step.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.duration}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getDifficultyColor(step.difficulty)}`}>
                      {step.difficulty}
                    </div>
                  </div>
                </div>
                
                <p className={`text-sm mb-3 ${
                  step.completed ? 'text-green-400/80' : step.locked ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-400">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {step.resources} recursos
                  </div>
                  
                  {!step.locked && (
                    <Button
                      size="sm"
                      variant={step.completed ? 'secondary' : 'primary'}
                      className="text-xs"
                    >
                      {step.completed ? 'Revisar' : 'Comenzar'}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center text-sm text-gray-400">
          <Star className="w-4 h-4 mr-1" />
          <span>Ruta recomendada por la comunidad</span>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Ver Todos los Recursos
          </Button>
          <Button size="sm">
            <Rocket className="w-4 h-4 mr-2" />
            Comenzar Ruta
          </Button>
        </div>
      </div>
    </Card>
  );
}

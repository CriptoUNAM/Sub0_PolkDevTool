import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Clock, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface LearningCardProps {
  title: string;
  description: string;
  type: string;
  duration: string;
  difficulty: string;
  rating: number;
  featured?: boolean;
  tags: string[];
  url: string;
  className?: string;
  onClick?: () => void;
}

export function LearningCard({
  title,
  description,
  type,
  duration,
  difficulty,
  rating,
  featured = false,
  tags,
  url,
  className,
  onClick
}: LearningCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Intermedio': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Avanzado': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Glassmorphism Card */}
      <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-purple-500/10">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              <Star className="w-3 h-3 mr-1" />
              Destacado
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                {type}
              </span>
              <div className="flex items-center text-yellow-400">
                <Star className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium">{rating}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 mb-2">
              {title}
            </h3>
            
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">
              {description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {duration}
              </div>
              <div className={cn(
                'px-2 py-1 rounded-full border text-xs font-medium',
                getDifficultyColor(difficulty)
              )}>
                {difficulty}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof window !== 'undefined') {
                window.open(url, '_blank');
              }
            }}
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Acceder al Recurso
          </Button>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      </div>
    </motion.div>
  );
}

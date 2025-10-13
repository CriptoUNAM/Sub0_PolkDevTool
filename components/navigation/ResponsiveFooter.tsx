'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { ClientOnly } from '@/components/ClientOnly';

export function ResponsiveFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();

    // Neural network particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      connections: number[];
    }> = [];
    
    const particleCount = typeof window !== 'undefined' && window.innerWidth < 640 ? 30 : 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.2,
        connections: [],
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(2, 6, 23, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${particle.opacity})`);
        gradient.addColorStop(1, `rgba(139, 92, 246, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core particle
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity + 0.3})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw neural connections
        particles.slice(i + 1).forEach((other, j) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.2;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <footer className="relative mt-12 sm:mt-20 overflow-hidden">
      {/* Neural Background */}
      <div className="absolute inset-0">
        <ClientOnly>
          <canvas
            ref={canvasRef}
            className="w-full h-full opacity-40"
          />
        </ClientOnly>
      </div>

      {/* Glassmorphism Container */}
      <div className="relative z-10 backdrop-blur-xl bg-gradient-to-b from-slate-900/80 via-slate-800/60 to-slate-900/80 border-t border-white/10">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-cyan-500/10" />
        
        <ResponsiveContainer padding="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <ResponsiveText size="xl" weight="bold" color="accent">
                  Polkadot DevKit
                </ResponsiveText>
                <ResponsiveText size="sm" color="secondary">
                  Acelera tu desarrollo en Polkadot con IA. Genera contratos inteligentes, 
                  templates y herramientas de debugging con la potencia de la inteligencia artificial.
                </ResponsiveText>
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com" 
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="GitHub"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://twitter.com" 
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://discord.gg" 
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Discord"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <ResponsiveText size="lg" weight="semibold" className="mb-3 sm:mb-4">
                Enlaces Rápidos
              </ResponsiveText>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/generate" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Generar Contratos
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/templates" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/marketplace" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/docs" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Documentación
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <ResponsiveText size="lg" weight="semibold" className="mb-3 sm:mb-4">
                Recursos
              </ResponsiveText>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://polkadot.network" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Polkadot Network
                  </a>
                </li>
                <li>
                  <a 
                    href="https://substrate.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Substrate
                  </a>
                </li>
                <li>
                  <a 
                    href="https://use.ink" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    ink! Smart Contracts
                  </a>
                </li>
                <li>
                  <a 
                    href="https://docs.polkadot.network" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Documentación Oficial
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <ResponsiveText size="lg" weight="semibold" className="mb-3 sm:mb-4">
                Soporte
              </ResponsiveText>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/debug" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Debug Tool
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/explain" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Explicar Código
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:support@polkadotdevkit.com" 
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Contacto
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-purple-400 transition-colors duration-300 text-xs sm:text-sm"
                  >
                    Reportar Bug
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
               <ResponsiveText size="sm" color="muted" align="center" className="sm:text-left">
                 © 2025 Polkadot DevKit. Made by PolkaDevKit Team. Todos los derechos reservados.
               </ResponsiveText>
              <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm">
                <a 
                  href="/privacy" 
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Privacidad
                </a>
                <a 
                  href="/terms" 
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Términos
                </a>
                <a 
                  href="/cookies" 
                  className="text-slate-400 hover:text-purple-400 transition-colors duration-300"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </footer>
  );
}

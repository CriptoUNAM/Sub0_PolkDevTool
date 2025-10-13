'use client';

import { useEffect, useRef } from 'react';
import { ClientOnly } from '@/components/ClientOnly';

export function LearningBackground() {
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Enhanced particle system for learning theme
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }> = [];
    
    const particleCount = 120;

    const colors = [
      'rgba(139, 92, 246, ', // Purple
      'rgba(236, 72, 153, ', // Pink
      'rgba(59, 130, 246, ',  // Blue
      'rgba(16, 185, 129, ',  // Green
      'rgba(245, 158, 11, ',  // Yellow
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      
      // Clear with subtle trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.pulseSpeed;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Pulsing effect
        const pulseMultiplier = 1 + Math.sin(particle.pulse) * 0.3;
        const currentRadius = particle.radius * pulseMultiplier;
        const currentOpacity = particle.opacity * (0.7 + Math.sin(particle.pulse) * 0.3);

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentRadius * 2
        );
        gradient.addColorStop(0, particle.color + currentOpacity + ')');
        gradient.addColorStop(0.5, particle.color + (currentOpacity * 0.5) + ')');
        gradient.addColorStop(1, particle.color + '0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections with enhanced effects
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const connectionOpacity = (1 - distance / 200) * 0.4;
            const connectionWidth = (1 - distance / 200) * 1.5;
            
            // Create gradient for connection
            const connectionGradient = ctx.createLinearGradient(
              particle.x, particle.y,
              other.x, other.y
            );
            connectionGradient.addColorStop(0, particle.color + connectionOpacity + ')');
            connectionGradient.addColorStop(1, other.color + connectionOpacity + ')');

            ctx.strokeStyle = connectionGradient;
            ctx.lineWidth = connectionWidth;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Add subtle glow effect for connections
            if (distance < 100) {
              ctx.strokeStyle = particle.color + (connectionOpacity * 0.3) + ')';
              ctx.lineWidth = connectionWidth * 3;
              ctx.globalCompositeOperation = 'screen';
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
              ctx.globalCompositeOperation = 'source-over';
            }
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
    <div className="fixed inset-0 -z-10">
      <ClientOnly>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-40"
        />
      </ClientOnly>
      {/* Additional glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/5 via-transparent to-green-900/5" />
    </div>
  );
}

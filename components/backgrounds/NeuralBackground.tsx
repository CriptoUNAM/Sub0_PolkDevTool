'use client';

import { useEffect, useRef } from 'react';
import { ClientOnly } from '@/components/ClientOnly';

export function NeuralBackground() {
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
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();

    // Enhanced particle system with multiple types
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    
    // Reduce particle count on mobile for better performance
    const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 120;

    const colors = [
      'rgba(139, 92, 246,', // purple
      'rgba(236, 72, 153,', // pink
      'rgba(6, 182, 212,',  // cyan
      'rgba(59, 130, 246,', // blue
      'rgba(16, 185, 129,', // emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.6 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let time = 0;

    function animate() {
      if (!ctx || !canvas) return;
      
      // Enhanced trail effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary collision with bounce
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Pulse animation
        particle.pulse += particle.pulseSpeed;
        const pulseRadius = particle.radius + Math.sin(particle.pulse) * 0.5;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, pulseRadius * 2
        );
        gradient.addColorStop(0, `${particle.color}${particle.opacity})`);
        gradient.addColorStop(0.5, `${particle.color}${particle.opacity * 0.5})`);
        gradient.addColorStop(1, `${particle.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Enhanced connections with gradient
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            const opacity = (1 - distance / 180) * 0.4;
            const lineGradient = ctx.createLinearGradient(
              particle.x, particle.y,
              other.x, other.y
            );
            
            // Match colors for gradient
            lineGradient.addColorStop(0, `${particle.color}${opacity})`);
            lineGradient.addColorStop(1, `${other.color}${opacity})`);

            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Add subtle glow at connection points
            if (distance < 100) {
              ctx.fillStyle = `${particle.color}${opacity * 0.3})`;
              ctx.beginPath();
              ctx.arc(
                (particle.x + other.x) / 2,
                (particle.y + other.y) / 2,
                2,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      resizeCanvas();
      // Reposition particles on resize
      particles.forEach(particle => {
        if (particle.x > canvas.width) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = canvas.height;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <ClientOnly>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 opacity-40"
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(2, 6, 23, 0.95) 100%)'
        }}
      />
    </ClientOnly>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Brain, 
  Code, 
  FileText, 
  Bug, 
  BookOpen, 
  Rocket,
  Home,
  BarChart3,
  Store,
  TestTube,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { MobileNav } from './MobileNav';

const NAVIGATION_ITEMS = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Learning', href: '/learning', icon: GraduationCap },
  { name: 'Generar', href: '/generate', icon: Brain },
  { name: 'Plantillas', href: '/templates', icon: Code },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Explicar', href: '/explain', icon: FileText },
  { name: 'Debug', href: '/debug', icon: Bug },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Docs', href: '/docs', icon: BookOpen },
  { name: 'Deploy', href: '/deploy', icon: Rocket },
  { name: 'Test', href: '/test', icon: TestTube },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text">Polkadot DevKit</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'primary' : 'ghost'}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:block">
              <WalletConnect />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </nav>
  );
}

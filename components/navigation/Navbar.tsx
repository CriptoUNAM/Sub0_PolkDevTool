'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  GraduationCap,
  ChevronDown,
  Wrench,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { MobileNav } from './MobileNav';

const NAVIGATION_ITEMS = [
  { name: 'Inicio', href: '/', icon: Home },
  { 
    name: 'Desarrollo', 
    href: '/generate', 
    icon: Brain,
    submenu: [
  { name: 'Generar', href: '/generate', icon: Brain },
  { name: 'Plantillas', href: '/templates', icon: Code },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
    ]
  },
  { 
    name: 'Herramientas', 
    href: '/explain', 
    icon: Wrench,
    submenu: [
  { name: 'Explicar', href: '/explain', icon: FileText },
  { name: 'Debug', href: '/debug', icon: Bug },
      { name: 'Test', href: '/test', icon: TestTube },
    ]
  },
  { 
    name: 'Recursos', 
    href: '/docs', 
    icon: Layers,
    submenu: [
      { name: 'Learning', href: '/learning', icon: GraduationCap },
      { name: 'Docs', href: '/docs', icon: BookOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ]
  },
  { name: 'Deploy', href: '/deploy', icon: Rocket },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Cerrar submenú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(submenuRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenSubmenu(null);
        }
      });
    };

    if (openSubmenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openSubmenu]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4">
        <div className="flex items-center justify-between h-12 xs:h-14 sm:h-16 gap-1.5 xs:gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold gradient-text whitespace-nowrap">
              <span className="hidden xs:inline sm:hidden">PDK</span>
              <span className="hidden sm:inline">Polkadot </span>
              <span className="hidden xs:inline">DevKit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-1 justify-center max-w-full">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.name;
              
              return (
                <div 
                  key={item.name} 
                  className="relative flex-shrink-0"
                  ref={(el) => {
                    if (hasSubmenu) {
                      submenuRefs.current[item.name] = el;
                    }
                  }}
                >
                  {hasSubmenu ? (
                    <div
                      onMouseEnter={() => setOpenSubmenu(item.name)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                    >
                      <Button
                        variant={isActive ? 'primary' : 'ghost'}
                        size="sm"
                        className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 ${
                          isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                        <span className="text-xs lg:text-sm whitespace-nowrap">{item.name}</span>
                        <ChevronDown className={`w-3 h-3 lg:w-3.5 lg:h-3.5 flex-shrink-0 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} />
                      </Button>
                      
                      <AnimatePresence>
                        {isSubmenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 min-w-[200px] overflow-hidden"
                          >
                            {item.submenu?.map((subItem) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <Link key={subItem.name} href={subItem.href}>
                                  <div className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                                    isSubActive 
                                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-l-2 border-purple-500' 
                                      : 'hover:bg-white/10 text-gray-300'
                                  }`}>
                                    <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{subItem.name}</span>
                                  </div>
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link href={item.href}>
                  <Button
                    variant={isActive ? 'primary' : 'ghost'}
                    size="sm"
                        className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 ${
                      isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''
                    }`}
                  >
                        <item.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                        <span className="text-xs lg:text-sm whitespace-nowrap">{item.name}</span>
                  </Button>
                </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Wallet Connection & Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
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

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
  ChevronDown
} from 'lucide-react';
import { ResponsiveButton } from '@/components/ui/ResponsiveButton';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import { MobileNav } from './MobileNav';

const NAVIGATION_ITEMS = [
  { name: 'Inicio', href: '/', icon: Home },
  { 
    name: 'Generar', 
    href: '/generate', 
    icon: Brain,
    submenu: [
      { name: 'Plantillas', href: '/templates', icon: Code }
    ]
  },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Explicar', href: '/explain', icon: FileText },
  { name: 'Debug', href: '/debug', icon: Bug },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Docs', href: '/docs', icon: BookOpen },
  { name: 'Deploy', href: '/deploy', icon: Rocket },
  { name: 'Test', href: '/test', icon: TestTube },
];

export function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 xs:space-x-3">
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold gradient-text">
              <span className="hidden xs:inline">Polkadot DevKit</span>
              <span className="xs:hidden">PDK</span>
            </span>
          </Link>

          {/* Tablet Navigation (md to lg) */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {NAVIGATION_ITEMS.filter(item => !item.submenu).slice(0, 6).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <ResponsiveButton
                    variant={isActive ? 'primary' : 'ghost'}
                    size="sm"
                    className={`px-2 py-1 ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                  >
                    <item.icon className="w-4 h-4" />
                  </ResponsiveButton>
                </Link>
              );
            })}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              
              return (
                <div key={item.name} className="relative">
                  {hasSubmenu ? (
                    <div
                      onMouseEnter={() => setOpenSubmenu(item.name)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                    >
                      <ResponsiveButton
                        variant={isActive ? 'primary' : 'ghost'}
                        size="sm"
                        className={`px-1 xl:px-2 py-1 ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                      >
                        <item.icon className="w-3 h-3 xl:w-4 xl:h-4 mr-1" />
                        <span className="hidden xl:inline text-xs 2xl:text-sm">{item.name}</span>
                        <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 ml-1" />
                      </ResponsiveButton>
                      
                      {openSubmenu === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-1 bg-gray-900 border border-white/20 rounded-lg shadow-xl z-50 min-w-[200px]"
                        >
                          {item.submenu?.map((subItem) => (
                            <Link key={subItem.name} href={subItem.href}>
                              <div className="flex items-center px-3 py-2 hover:bg-white/10 text-sm">
                                <subItem.icon className="w-4 h-4 mr-2" />
                                {subItem.name}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href}>
                      <ResponsiveButton
                        variant={isActive ? 'primary' : 'ghost'}
                        size="sm"
                        className={`px-1 xl:px-2 py-1 ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
                      >
                        <item.icon className="w-3 h-3 xl:w-4 xl:h-4 mr-1" />
                        <span className="hidden xl:inline text-xs 2xl:text-sm">{item.name}</span>
                      </ResponsiveButton>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Wallet Connection & Mobile Menu */}
          <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4">
            <div className="hidden xs:block">
              <WalletConnect />
            </div>
            
            <ResponsiveButton
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-8 h-8 xs:w-10 xs:h-10 p-0"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 xs:w-6 xs:h-6" /> : <Menu className="w-5 h-5 xs:w-6 xs:h-6" />}
            </ResponsiveButton>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </nav>
  );
}

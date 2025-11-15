'use client';

import { useState } from 'react';
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
  ChevronDown,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WalletConnect } from '@/components/wallet/WalletConnect';

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
    icon: FileText,
    submenu: [
      { name: 'Explicar', href: '/explain', icon: FileText },
      { name: 'Debug', href: '/debug', icon: Bug },
      { name: 'Test', href: '/test', icon: TestTube },
    ]
  },
  { 
    name: 'Recursos', 
    href: '/docs', 
    icon: BookOpen,
    submenu: [
      { name: 'Learning', href: '/learning', icon: GraduationCap },
      { name: 'Docs', href: '/docs', icon: BookOpen },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ]
  },
  { name: 'Deploy', href: '/deploy', icon: Rocket },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          
          {/* Mobile Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-72 sm:w-80 max-w-[85vw] bg-gray-900 border-l border-white/20 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold gradient-text">Polkadot DevKit</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-9 h-9 sm:w-10 sm:h-10 p-0 hover:bg-white/10"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 p-4 sm:p-6 space-y-2 sm:space-y-3 overflow-y-auto">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isSubmenuOpen = openSubmenu === item.name;
                
                return (
                  <div key={item.name}>
                    {hasSubmenu ? (
                      <div>
                        <Button
                          variant={isActive ? 'primary' : 'ghost'}
                          onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.name)}
                          className={`w-full justify-start h-10 sm:h-12 text-left px-3 sm:px-4 ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                              : 'hover:bg-white/10 text-white/90'
                          }`}
                        >
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4" />
                          <span className="text-sm sm:text-base font-medium">{item.name}</span>
                          {isSubmenuOpen ? (
                            <ChevronDown className="w-4 h-4 ml-auto" />
                          ) : (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          )}
                        </Button>
                        
                        {isSubmenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 mt-2 space-y-1"
                          >
                            {item.submenu?.map((subItem) => (
                              <Link key={subItem.name} href={subItem.href} onClick={onClose}>
                                <Button
                                  variant={pathname === subItem.href ? 'primary' : 'ghost'}
                                  className={`w-full justify-start h-8 sm:h-10 text-left px-3 sm:px-4 ${
                                    pathname === subItem.href
                                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                                      : 'hover:bg-white/10 text-white/90'
                                  }`}
                                >
                                  <subItem.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-3 sm:mr-4" />
                                  <span className="text-xs sm:text-sm font-medium">{subItem.name}</span>
                                </Button>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <Link href={item.href} onClick={onClose}>
                        <Button
                          variant={isActive ? 'primary' : 'ghost'}
                          className={`w-full justify-start h-10 sm:h-12 text-left px-3 sm:px-4 ${
                            isActive 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                              : 'hover:bg-white/10 text-white/90'
                          }`}
                        >
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4" />
                          <span className="text-sm sm:text-base font-medium">{item.name}</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Wallet Connection */}
            <div className="p-4 sm:p-6 border-t border-white/20 bg-gray-800 mt-auto">
              <div className="mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-semibold text-white/70 mb-2">Conexión de Wallet</h3>
                <WalletConnect />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

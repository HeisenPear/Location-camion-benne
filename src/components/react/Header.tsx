import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, TruckIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Notre Flotte', href: '/notre-flotte' },
  { name: 'Tarifs', href: '/tarifs' },
  { name: 'Zone d\'intervention', href: '/zone-intervention' },
  { name: 'Contact', href: '/contact' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">Disponible 7j/7</span>
                <span className="sm:hidden">7j/7</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-gray-300">
                <span>•</span>
                <span>Intervention rapide sous 24-48h</span>
              </div>
            </div>
            <a
              href="tel:+33247000000"
              className="flex items-center space-x-2 hover:text-orange-400 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              <span>02 47 XX XX XX</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-xl'
            : 'bg-white/98 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3 group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute inset-0 bg-orange-500 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 rounded-xl shadow-lg">
                  <TruckIcon className={`text-white transition-all duration-300 ${
                    isScrolled ? 'w-6 h-6' : 'w-7 h-7'
                  }`} />
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <div className={`font-bold text-gray-900 leading-tight transition-all duration-300 ${
                  isScrolled ? 'text-base' : 'text-lg'
                }`}>
                  Location Camion Benne
                </div>
                <div className="text-xs text-orange-500 font-semibold flex items-center space-x-1">
                  <span>Tours - Indre-et-Loire (37)</span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 rounded-xl text-gray-700 hover:text-orange-500 transition-all duration-200 font-medium group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <motion.a
                href="/contact"
                className="relative px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Devis gratuit</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Quick Actions */}
                <div className="mb-6 grid grid-cols-1 gap-3">
                  <a
                    href="tel:+33247000000"
                    className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    <span>02 47 XX XX XX</span>
                  </a>
                  <a
                    href="/contact"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Devis gratuit</span>
                  </a>
                </div>

                {/* Info Badge */}
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl">
                  <div className="flex items-center space-x-2 text-sm text-orange-800">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">Disponible 7j/7 - Intervention sous 24-48h</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col space-y-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
                    Navigation
                  </div>
                  {navigation.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative px-4 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 active:scale-95"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="relative z-10">{item.name}</span>
                      <div className="absolute inset-0 bg-orange-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-orange-500 rounded-full group-hover:h-8 transition-all duration-200"></div>
                    </motion.a>
                  ))}
                </nav>

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-gray-900">Location Camion Benne</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Service professionnel depuis 2010
                    </p>
                    <p className="text-xs text-orange-500 font-semibold mt-1">
                      Tours - Indre-et-Loire (37)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

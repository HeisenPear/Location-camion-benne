import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, TruckIcon } from 'lucide-react';
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <div className="bg-orange-500 p-2 rounded-lg group-hover:bg-orange-600 transition-colors">
              <TruckIcon className="w-8 h-8 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-gray-900 leading-tight">
                Location Camion Benne
              </div>
              <div className="text-xs text-orange-500 font-semibold">Tours - 37</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="tel:+33247000000"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-semibold">02 47 XX XX XX</span>
            </a>
            <a
              href="/contact"
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Devis gratuit
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-4 py-3 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col space-y-3">
                <a
                  href="tel:+33247000000"
                  className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>02 47 XX XX XX</span>
                </a>
                <a
                  href="/contact"
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-lg text-center"
                >
                  Devis gratuit
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

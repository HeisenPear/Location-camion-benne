import React from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Clock, CheckCircle, TruckIcon } from 'lucide-react';
import { Button } from './Button';

export const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const wordVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  const titleWords = ['Location', 'de', 'Camions', 'Benne', 'à', 'Tours'];

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <motion.div
              className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <TruckIcon className="w-5 h-5" />
              <span>Service professionnel depuis 2010</span>
            </motion.div>
          </motion.div>

          {/* Animated Title */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Évacuation de gravats, transport de matériaux et déchets de chantier.
            <br />
            Intervention rapide dans tout le 37.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button variant="primary" size="lg" href="/contact">
              <Phone className="w-5 h-5 mr-2" />
              Obtenir un devis gratuit
            </Button>
            <Button variant="secondary" size="lg" href="/notre-flotte">
              <ArrowRight className="w-5 h-5 mr-2" />
              Découvrir notre flotte
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-3xl font-bold text-orange-500">15+</div>
              <div className="text-sm text-gray-600 mt-1">Ans d'expérience</div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-3xl font-bold text-orange-500">500+</div>
              <div className="text-sm text-gray-600 mt-1">Clients satisfaits</div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-3xl font-bold text-orange-500">24h</div>
              <div className="text-sm text-gray-600 mt-1">Délai de réponse</div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="text-3xl font-bold text-orange-500">7j/7</div>
              <div className="text-sm text-gray-600 mt-1">Disponibilité</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-sm mb-2">Défiler</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};

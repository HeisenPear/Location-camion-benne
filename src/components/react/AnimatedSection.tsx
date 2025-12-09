import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'staggerFadeIn';
  className?: string;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeIn',
  className = '',
  delay = 0
}) => {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.6, delay }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay }
    },
    slideLeft: {
      initial: { opacity: 0, x: 50 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay }
    },
    slideRight: {
      initial: { opacity: 0, x: -50 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, delay }
    },
    staggerFadeIn: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: delay }
    }
  };

  const config = animations[animation];

  return (
    <motion.div
      className={className}
      initial={config.initial}
      whileInView={config.whileInView}
      transition={config.transition}
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

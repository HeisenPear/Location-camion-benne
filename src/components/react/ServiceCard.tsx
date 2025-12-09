import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon: Icon,
  title,
  description,
  link,
}) => {
  if (link) {
    return (
      <motion.a
        href={link}
        className="group block bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-orange-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        <div className="mt-4 text-orange-500 font-semibold flex items-center space-x-2 group-hover:space-x-3 transition-all">
          <span>En savoir plus</span>
          <span>→</span>
        </div>
      </motion.a>
    );
  }

  return (
    <motion.div
      className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-orange-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

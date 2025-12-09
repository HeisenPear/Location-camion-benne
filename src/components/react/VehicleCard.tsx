import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Weight, Ruler, CheckCircle } from 'lucide-react';

interface VehicleCardProps {
  name: string;
  description: string;
  capacity: string;
  payload: string;
  dimensions: string;
  features: string[];
  available?: boolean;
  image?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  name,
  description,
  capacity,
  payload,
  dimensions,
  features,
  available = true,
  image,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="w-32 h-32 text-white/30" />
          </div>
        )}
        {available && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Disponible
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Specifications */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Truck className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Capacité</div>
              <div className="font-semibold">{capacity}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Weight className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Charge utile</div>
              <div className="font-semibold">{payload}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Ruler className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Dimensions</div>
              <div className="font-semibold">{dimensions}</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Utilisations recommandées</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="/contact"
          className="mt-6 block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Réserver ce véhicule
        </a>
      </div>
    </motion.div>
  );
};

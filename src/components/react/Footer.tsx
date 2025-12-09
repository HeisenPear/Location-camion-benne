import React from 'react';
import { TruckIcon, Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-orange-500 p-2 rounded-lg">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg">Location Camion Benne</div>
                <div className="text-xs text-orange-500">Tours - 37</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Votre partenaire de confiance pour la location de camions benne dans l'Indre-et-Loire.
              Service professionnel, flotte moderne et tarifs compétitifs.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-orange-500 transition-colors">Accueil</a>
              </li>
              <li>
                <a href="/services" className="hover:text-orange-500 transition-colors">Nos Services</a>
              </li>
              <li>
                <a href="/notre-flotte" className="hover:text-orange-500 transition-colors">Notre Flotte</a>
              </li>
              <li>
                <a href="/tarifs" className="hover:text-orange-500 transition-colors">Tarifs</a>
              </li>
              <li>
                <a href="/zone-intervention" className="hover:text-orange-500 transition-colors">Zone d'intervention</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-500 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/services#evacuation" className="hover:text-orange-500 transition-colors">
                  Évacuation gravats
                </a>
              </li>
              <li>
                <a href="/services#transport" className="hover:text-orange-500 transition-colors">
                  Transport de matériaux
                </a>
              </li>
              <li>
                <a href="/services#demolition" className="hover:text-orange-500 transition-colors">
                  Démolition et débarras
                </a>
              </li>
              <li>
                <a href="/services#terrassement" className="hover:text-orange-500 transition-colors">
                  Terrassement
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-sm">Tours et environs<br />Indre-et-Loire (37)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="tel:+33247000000" className="text-sm hover:text-orange-500 transition-colors">
                  02 47 XX XX XX
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="mailto:contact@example.com" className="text-sm hover:text-orange-500 transition-colors">
                  contact@lcb-tours.fr
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-sm">
                  Lun-Sam: 7h-19h<br />
                  Urgences: 7j/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-400">
            © {currentYear} Location Camion Benne Tours. Tous droits réservés.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/mentions-legales" className="hover:text-orange-500 transition-colors">
              Mentions légales
            </a>
            <a href="/mentions-legales#confidentialite" className="hover:text-orange-500 transition-colors">
              Confidentialité
            </a>
            <a href="/mentions-legales#cookies" className="hover:text-orange-500 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

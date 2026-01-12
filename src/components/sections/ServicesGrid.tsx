import { motion } from 'framer-motion';
import type { Service } from '@/types';

interface Props {
  services: Service[];
}

export default function ServicesGrid({ services }: Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section className="section-spacing bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-display-sm md:text-display-md font-display font-bold text-neutral-900 mb-4">
            Nos Services
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Des solutions adaptées à chaque projet. Découvrez comment nos bennes peuvent vous aider dans vos travaux.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {services.map((service) => (
            <motion.a
              key={service.id}
              href={`/services/${service.slug}`}
              className="group card-service block flex flex-col h-full"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">{service.icon}</div>
              </div>

              <h3 className="text-2xl font-bold text-neutral-900 mb-3 text-center">{service.name}</h3>

              <p className="text-neutral-600 mb-4 line-clamp-3 text-center">
                {service.description}
              </p>

              <div className="mt-auto space-y-3">
                <div className="flex items-center text-sm text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="line-clamp-1">{service.idealFor}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center text-primary-600 font-semibold text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Devis gratuit
                  </div>
                  <span className="text-primary-600 group-hover:translate-x-2 transition-transform duration-200 inline-flex items-center text-sm font-semibold">
                    En savoir plus
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <a
            href="/services"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-700 bg-white border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
          >
            Voir tous nos services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

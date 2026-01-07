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
            Nos Bennes
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Du 10m³ au 30m³, trouvez la benne parfaitement adaptée à votre chantier.
            Livraison rapide sur Tours et toute l'Indre-et-Loire.
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
              className="group card-service block"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-neutral-900">{service.name}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-700">
                  {service.volume}
                </span>
              </div>

              <p className="text-neutral-600 mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-baseline justify-between pt-4 border-t border-neutral-200">
                <div>
                  <span className="text-3xl font-bold text-primary-600">{service.price}€</span>
                  <span className="text-sm text-neutral-500 ml-2">{service.priceUnit}</span>
                </div>
                <span className="text-primary-600 group-hover:translate-x-2 transition-transform duration-200 inline-flex items-center">
                  Voir détails
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
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

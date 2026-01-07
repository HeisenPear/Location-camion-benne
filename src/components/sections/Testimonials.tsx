import { motion } from 'framer-motion';
import type { Testimonial } from '@/types';

interface Props {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-secondary-500' : 'text-neutral-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="section-spacing bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-display-sm md:text-display-md font-display font-bold text-neutral-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Découvrez les avis de nos clients satisfaits, professionnels et particuliers.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-neutral-50 rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              {renderStars(testimonial.rating)}

              <p className="text-neutral-700 mt-4 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="border-t border-neutral-200 pt-4">
                <p className="font-bold text-neutral-900">{testimonial.name}</p>
                {testimonial.company && (
                  <p className="text-sm text-neutral-600">
                    {testimonial.role} - {testimonial.company}
                  </p>
                )}
                {!testimonial.company && testimonial.role && (
                  <p className="text-sm text-neutral-600">{testimonial.role}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

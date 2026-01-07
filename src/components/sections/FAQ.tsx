import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FAQItem } from '@/types';

interface Props {
  faqItems: FAQItem[];
}

export default function FAQ({ faqItems }: Props) {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id || null);

  return (
    <section className="section-spacing bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-display-sm md:text-display-md font-display font-bold text-neutral-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur la location de bennes.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-soft overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <span className="font-bold text-lg text-neutral-900 pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-neutral-600 leading-relaxed">
                        {item.answer}
                      </p>
                      {item.category && (
                        <span className="inline-block mt-3 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-4">
            Vous avez d'autres questions ?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </section>
  );
}

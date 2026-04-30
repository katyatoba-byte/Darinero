import React from 'react';
import { motion } from 'motion/react';
import { CONCEPTS } from '../constants';
import { Link } from 'react-router-dom';

const Concepts = () => {
  return (
    <main className="pt-32">
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-24"
          >
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Showroom</span>
            <h1 className="text-5xl md:text-7xl mb-8">Concept Gallery</h1>
            <p className="text-xl text-charcoal font-light leading-relaxed">
              Разгледайте нашите кураторски концепции. Те са само отправна точка за вашето уникално решение. Без каталози, само вдъхновение.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {CONCEPTS.map((concept, idx) => (
              <motion.div 
                key={concept.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <Link to={`/case-study/${concept.id}`} className="block aspect-[4/5] overflow-hidden mb-8 relative">
                  <img 
                    src={concept.image} 
                    alt={concept.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-500"></div>
                </Link>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-copper text-[10px] font-bold uppercase tracking-[0.3em] mb-2">{concept.category}</p>
                    <Link to={`/case-study/${concept.id}`}>
                      <h2 className="text-3xl font-serif mb-4 hover:text-copper transition-colors">{concept.title}</h2>
                    </Link>
                    <p className="text-charcoal font-light leading-relaxed max-w-md">
                      {concept.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy text-offwhite">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl mb-8">Искате нещо напълно уникално?</h2>
            <p className="text-offwhite/60 text-lg font-light leading-relaxed">
              Нашият екип специализира в създаването на custom концепции, които не съществуват никъде другаде. Нека превърнем вашата идея в реалност.
            </p>
          </div>
          <Link to="/contact" className="btn-premium bg-copper text-white hover:bg-offwhite hover:text-navy whitespace-nowrap">
            Заяви custom концепция
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Concepts;

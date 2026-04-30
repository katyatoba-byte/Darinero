import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Categories = () => {
  return (
    <main className="pt-32">
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-24"
          >
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Каталог</span>
            <h1 className="text-5xl md:text-7xl mb-8">Категории кутии</h1>
            <p className="text-xl text-charcoal font-light leading-relaxed">
              Разгледайте нашите кураторски селекции, създадени да впечатляват. Всяка категория е само отправна точка за вашето уникално корпоративно решение.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((category, idx) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white border border-navy/5 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <Link to={`/category/${category.id}`} className="block aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors"></div>
                </Link>
                <div className="p-8">
                  <Link to={`/category/${category.id}`}>
                    <h2 className="text-2xl font-serif mb-4 text-navy hover:text-copper transition-colors">{category.title}</h2>
                  </Link>
                  <p className="text-charcoal font-light mb-8 line-clamp-2">
                    {category.description}
                  </p>
                  <Link 
                    to={`/category/${category.id}`} 
                    className="inline-flex items-center gap-2 text-copper font-bold uppercase text-xs tracking-widest hover:gap-4 transition-all"
                  >
                    Разгледай <span className="text-lg">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy text-offwhite">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl text-center lg:text-left">
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

export default Categories;

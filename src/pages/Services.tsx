import React from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <main className="pt-32">
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-24"
          >
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Нашите Услуги</span>
            <h1 className="text-5xl md:text-7xl mb-8">Стратегически решения за всяка нужда</h1>
            <p className="text-xl text-charcoal font-light leading-relaxed">
              Ние не продаваме продукти. Ние доставяме цялостни преживявания, които укрепват връзките с вашите служители и партньори.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -10 }}
                className="bg-white p-12 shadow-sm border border-navy/5 flex flex-col h-full"
              >
                <h2 className="text-3xl font-serif mb-6">{service.title}</h2>
                <p className="text-charcoal font-light mb-8 flex-grow">
                  {service.description}
                </p>
                
                <div className="space-y-6 pt-8 border-t border-navy/5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-2">Приложение</p>
                    <p className="text-lg font-medium">{service.useCase}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-2">Стойност</p>
                    <p className="text-charcoal">{service.value}</p>
                  </div>
                  <div className="bg-offwhite p-4 inline-block">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Ориентировъчен бюджет</p>
                    <p className="text-copper font-serif italic text-xl">{service.budget}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy text-offwhite text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl mb-8">Нуждаете се от специфично решение?</h2>
          <p className="text-offwhite/60 font-light mb-12">
            Всеки проект е уникален. Свържете се с нас за индивидуална оферта, съобразена с вашите специфични изисквания.
          </p>
          <Link to="/contact" className="btn-premium bg-copper text-white hover:bg-offwhite hover:text-navy">
            Обсъдете проект
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Services;

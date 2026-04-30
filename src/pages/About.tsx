import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <main className="pt-32">
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Нашата История</span>
              <h1 className="text-5xl md:text-7xl mb-4">DARINERO</h1>
              <p className="text-xl md:text-2xl text-navy/70 font-sans leading-relaxed mb-12">
                Вашият стратегически партньор за незабравими корпоративни подаръци
              </p>
              <p className="text-xl text-navy/80 font-light leading-relaxed mb-8">
                Ние вярваме, че корпоративният подарък не е просто предмет, а мощно послание. То е отражение на културата, ценностите и вниманието към детайла на една компания.
              </p>
              <p className="text-lg text-charcoal font-light leading-relaxed mb-12">
                Създадохме DARINERO, за да запълним празнината между баналните корпоративни сувенири и истинското премиум преживяване. Нашата мисия е да премахнем стреса от процеса и да доставим радост, която се помни.
              </p>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-serif text-navy mb-1">5+</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Години опит</p>
                </div>
                <div>
                  <p className="text-4xl font-serif text-navy mb-1">10k+</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Доставени кутии</p>
                </div>
              </div>
            </motion.div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=1000" 
                  alt="Studio Workspace" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-12 -right-12 bg-copper p-12 text-white max-w-sm hidden md:block">
                <p className="font-serif text-2xl italic leading-relaxed">
                  „Ние не продаваме продукти. Ние доставяме доверие.“
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl mb-8">Нашите Ценности</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: "Кураторство", desc: "Всеки предмет в нашите кутии е внимателно подбран заради своето качество, произход и история." },
              { title: "Прецизност", desc: "Логистиката е нашата втора природа. Гарантираме 100% точност и спазване на сроковете." },
              { title: "Партньорство", desc: "Ние сме продължение на вашия екип. Вашите цели са наши цели." }
            ].map((value, idx) => (
              <div key={idx} className="text-center">
                <h3 className="text-2xl font-serif mb-6 text-copper italic">{value.title}</h3>
                <p className="text-charcoal font-light leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 bg-navy text-offwhite text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl mb-12">Готови ли сте да промените начина, по който подарявате?</h2>
          <Link to="/contact" className="btn-premium bg-copper text-white hover:bg-offwhite hover:text-navy">Свържете се с нас</Link>
        </div>
      </section>
    </main>
  );
};

export default About;

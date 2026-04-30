import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-32">
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Контакт</span>
              <h1 className="text-5xl md:text-7xl mb-8">Нека създадем нещо значимо</h1>
              <p className="text-xl text-charcoal font-light leading-relaxed mb-12">
                Попълнете формата и нашият екип ще се свърже с вас до 24 часа, за да обсъдим вашите нужди и да изготвим първоначална концепция.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-offwhite flex items-center justify-center rounded-full text-copper">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Имейл</p>
                    <p className="text-lg">hello@darinero.studio</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-offwhite flex items-center justify-center rounded-full text-copper">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Телефон</p>
                    <p className="text-lg">+359 888 000 000</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-offwhite flex items-center justify-center rounded-full text-copper">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Адрес</p>
                    <p className="text-lg">София, ул. Примерна 123</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-offwhite p-8 md:p-12 rounded-sm shadow-sm">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-20 h-20 bg-copper text-white rounded-full flex items-center justify-center mb-8">
                    <Send size={32} />
                  </div>
                  <h2 className="text-3xl font-serif mb-4">Благодарим ви!</h2>
                  <p className="text-charcoal font-light">Вашето запитване е прието. Ще получите концепция до 48 часа.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-copper uppercase text-xs font-bold tracking-widest hover:underline"
                  >
                    Изпрати ново запитване
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Име</label>
                      <input required type="text" className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Компания</label>
                      <input required type="text" className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Брой служители</label>
                      <select className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors">
                        <option>10 - 50</option>
                        <option>50 - 200</option>
                        <option>200 - 1000</option>
                        <option>1000+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Повод</label>
                      <input type="text" placeholder="напр. Коледа, Годишнина" className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Бюджет (ориентировъчен)</label>
                    <input type="text" className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Съобщение</label>
                    <textarea rows={4} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors resize-none"></textarea>
                  </div>
                  <button type="submit" className="btn-premium w-full bg-navy text-white hover:bg-copper">
                    Заяви концепция
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;

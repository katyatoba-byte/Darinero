import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useContent } from '../content';
import { submitInquiry } from '../inquiry';

const Contact = () => {
  const { settings } = useContent();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const empty = { name: '', company: '', email: '', phone: '', employees: '10 - 50', occasion: '', budget: '', message: '', website: '' };
  const [form, setForm] = useState(empty);
  const update = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const res = await submitInquiry({ source: 'Страница Контакт', ...form });
    setSending(false);
    if (res.ok) { setSubmitted(true); setForm(empty); }
    else setError(res.error || '');
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
                    <a href={`mailto:${settings.email}`} className="text-lg hover:text-copper">{settings.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-offwhite flex items-center justify-center rounded-full text-copper">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Телефон</p>
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-lg hover:text-copper">{settings.phone}</a>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-offwhite flex items-center justify-center rounded-full text-copper">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Адрес</p>
                    <p className="text-lg">{settings.address}</p>
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
                  <p className="text-charcoal font-light">Вашето запитване е прието. Ще се свържем с вас до 24 часа.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-copper uppercase text-xs font-bold tracking-widest hover:underline"
                  >
                    Изпрати ново запитване
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <input type="text" name="website" value={form.website} onChange={update('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Име *</label>
                      <input required type="text" value={form.name} onChange={update('name')} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Компания</label>
                      <input type="text" value={form.company} onChange={update('company')} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Имейл *</label>
                      <input required type="email" value={form.email} onChange={update('email')} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Телефон</label>
                      <input type="tel" value={form.phone} onChange={update('phone')} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Брой служители</label>
                      <select value={form.employees} onChange={update('employees')} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors">
                        <option>10 - 50</option>
                        <option>50 - 200</option>
                        <option>200 - 1000</option>
                        <option>1000+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Повод</label>
                      <input type="text" value={form.occasion} onChange={update('occasion')} placeholder="напр. Коледа, Годишнина" className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Бюджет (ориентировъчен)</label>
                    <input type="text" value={form.budget} onChange={update('budget')} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-navy/40">Съобщение</label>
                    <textarea rows={4} value={form.message} onChange={update('message')} className="w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors resize-none"></textarea>
                  </div>
                  {error && <p className="text-sm text-red-700">{error}</p>}
                  <button type="submit" disabled={sending} className="btn-premium w-full bg-navy text-white hover:bg-copper disabled:opacity-60">
                    {sending ? 'Изпращане…' : 'Заяви концепция'}
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook } from 'lucide-react';
import { useContent } from '../content';
import { submitInquiry } from '../inquiry';

const Footer = () => {
  const { settings } = useContent();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    const res = await submitInquiry({ source: 'Абонамент за бюлетин', name: '', email });
    setState(res.ok ? 'done' : 'error');
    if (res.ok) setEmail('');
  };

  const socials = [
    { url: settings.instagram, Icon: Instagram, label: 'Instagram' },
    { url: settings.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { url: settings.facebook, Icon: Facebook, label: 'Facebook' },
  ].filter(s => s.url);

  return (
    <footer className="bg-navy text-white pt-24 pb-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tighter">
              DARINERO<span className="text-copper">.</span>
            </Link>
            <p className="text-white/60 font-light leading-relaxed max-w-xs">
              Премиум партньор в изготвянето на корпоративни подаръци. Превръщаме жестовете в стратегически активи.
            </p>
            {socials.length > 0 && (
              <div className="flex space-x-4">
                {socials.map(({ url, Icon, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-copper transition-colors">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-serif text-xl mb-8">Навигация</h4>
            <ul className="space-y-4 text-white/60 font-light">
              <li><Link to="/categories" className="hover:text-copper transition-colors">Каталог</Link></li>
              <li><Link to="/services" className="hover:text-copper transition-colors">Услуги</Link></li>
              <li><Link to="/case-studies" className="hover:text-copper transition-colors">Case Studies</Link></li>
              <li><Link to="/concepts" className="hover:text-copper transition-colors">Концепции</Link></li>
              <li><Link to="/about" className="hover:text-copper transition-colors">За нас</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-8">Контакт</h4>
            <ul className="space-y-4 text-white/60 font-light">
              <li>{settings.footerLocation}</li>
              <li><a href={`mailto:${settings.email}`} className="hover:text-copper transition-colors">{settings.email}</a></li>
              <li><a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-copper transition-colors">{settings.phone}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-8">Бюлетин</h4>
            <p className="text-white/60 font-light mb-6">Получавайте вдъхновение за вашите кампании.</p>
            {state === 'done' ? (
              <p className="text-copper text-sm">Благодарим! Записахме ви.</p>
            ) : (
              <form onSubmit={subscribe} className="flex border-b border-white/20 pb-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Вашият имейл"
                  className="bg-transparent border-none outline-none flex-grow text-sm placeholder:text-white/30"
                />
                <button type="submit" disabled={state === 'sending'} className="text-copper uppercase text-xs font-bold tracking-widest">OK</button>
              </form>
            )}
            {state === 'error' && <p className="text-red-300 text-xs mt-2">Възникна грешка, опитайте отново.</p>}
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Даринеро ООД. Всички права запазени.</p>
          <Link to="/politika-za-poveritelnost" className="mt-4 md:mt-0 hover:text-copper transition-colors">Политика за поверителност</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

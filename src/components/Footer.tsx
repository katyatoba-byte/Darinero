import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
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
            <div className="flex space-x-4">
              <a href="#" className="hover:text-copper transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-copper transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-copper transition-colors"><Facebook size={20} /></a>
            </div>
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
              <li>София, България</li>
              <li>hello@darinero.studio</li>
              <li>+359 888 000 000</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-8">Бюлетин</h4>
            <p className="text-white/60 font-light mb-6">Получавайте вдъхновение за вашите кампании.</p>
            <form className="flex border-b border-white/20 pb-2">
              <input 
                type="email" 
                placeholder="Вашият имейл" 
                className="bg-transparent border-none outline-none flex-grow text-sm placeholder:text-white/30"
              />
              <button type="submit" className="text-copper uppercase text-xs font-bold tracking-widest">OK</button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40 tracking-widest uppercase">
          <p>© 2026 DARINERO. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

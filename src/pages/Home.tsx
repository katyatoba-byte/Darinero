import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Zap, Target } from 'lucide-react';
import { CONCEPTS, PROCESS_STEPS } from '../constants';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <main className="overflow-hidden">
      <Hero />

      {/* Problem Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Предизвикателството</span>
              <h2 className="text-4xl md:text-5xl mb-12 leading-tight text-navy">
                Подаряването не трябва да бъде <span className="italic">логистичен кошмар</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: <Clock className="text-copper" />, text: "Губите дни в координация на десетки доставчици" },
                  { icon: <Zap className="text-copper" />, text: "Получавате банални идеи, които не отразяват бранда ви" },
                  { icon: <Target className="text-copper" />, text: "Всичко се случва в последния момент под огромен стрес" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-6">
                    <div className="mt-1">{item.icon}</div>
                    <p className="text-lg text-charcoal font-light">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl border border-softgray">
                <img 
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Corporate Chaos vs Order" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 bg-navy p-12 text-white max-w-sm hidden md:block shadow-xl">
                <p className="font-serif text-2xl italic leading-relaxed">
                  „Това не е просто подарък. Това е отражение на вашата компания.“
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Importance of Gifting Section */}
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "Увеличена лоялност", desc: "Служителите се чувстват оценени и значими.", icon: <CheckCircle2 className="text-copper" /> },
                  { title: "Корпоративна култура", desc: "Укрепва връзката между екипа и компанията.", icon: <CheckCircle2 className="text-copper" /> },
                  { title: "Бранд идентичност", desc: "Подаръкът е физическо отражение на вашите ценности.", icon: <CheckCircle2 className="text-copper" /> },
                  { title: "Намалено текучество", desc: "Ангажираните служители остават по-дълго.", icon: <CheckCircle2 className="text-copper" /> },
                  { title: "WOM ефект", desc: "Положително споделяне в социални медии.", icon: <CheckCircle2 className="text-copper" /> }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-white border border-navy/5 shadow-sm hover:shadow-md transition-all">
                    <div className="mb-4">{item.icon}</div>
                    <h4 className="text-lg font-bold text-navy mb-2">{item.title}</h4>
                    <p className="text-sm text-charcoal font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Защо е важно да подарите?</span>
              <h2 className="text-4xl md:text-5xl text-navy font-serif">
                Инвестиция в <span className="italic text-copper">хората</span>, не просто разход
              </h2>
              <div className="p-8 bg-navy text-white border-l-4 border-copper shadow-xl">
                <p className="text-xl font-serif italic leading-relaxed mb-4">
                  „Служителите, които получават премиум корпоративни подаръци, показват 35% по-висока ангажираност и 20% по-нисък процент на напускане на работата.“
                </p>
                <p className="text-sm text-white/40 uppercase tracking-widest">— Статистика от индустрията</p>
              </div>
              <p className="text-lg text-charcoal font-light leading-relaxed">
                Правилният подарък в правилния момент може да промени начина, по който вашите служители възприемат компанията. Това е жест, който се помни дълго след като празникът е отминал.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding bg-navy text-white">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Решението</span>
          <h2 className="text-4xl md:text-6xl mb-8 text-white">Корпоративни подаръци, които работят за имиджа ви</h2>
          <p className="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
            Вие задавате бюджета, ние градим репутацията ви.<br />
            Създаваме концепция, подбираме продуктите, изграждаме визията и доставяме без риск за вас.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {['Концепция', 'Подбор', 'Дизайн', 'Персонализация', 'Логистика'].map((step, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-10 border border-white/10 bg-white/5 backdrop-blur-sm text-center group transition-colors hover:border-copper/50"
            >
              <div className="text-copper text-4xl font-serif mb-6 opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</div>
              <h3 className="text-xl font-medium tracking-wide">{step}</h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/60 mb-8 mx-auto font-light md:whitespace-nowrap">
              Гарантирано качество и спазване на срокове, дори при кампании за 500+ служители.
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-copper text-white px-12 py-5 text-lg font-bold tracking-widest uppercase hover:bg-copper/90 transition-all shadow-xl hover:shadow-copper/20 active:scale-95"
            >
              НАПРАВЕТЕ ЗАПИТВАНЕ
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Пътят до резултата</span>
              <h2 className="text-4xl md:text-5xl text-navy">Премахваме хаоса от процеса</h2>
            </div>
            <div className="bg-white px-8 py-4 border-l-4 border-copper shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-navy/40 mb-1">Стандартен срок</p>
              <p className="text-xl font-serif italic text-navy">2–6 седмици според проекта</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="text-8xl font-serif font-bold text-navy/5 absolute -top-10 -left-4 group-hover:text-copper/10 transition-colors">
                  {step.number}
                </div>
                <div className="relative z-10 pt-8">
                  <h3 className="text-2xl mb-4 font-serif text-navy">{step.title}</h3>
                  <p className="text-charcoal font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concept Showroom */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Портфолио</span>
            <h2 className="text-4xl md:text-5xl text-navy">Concept Showroom</h2>
          </div>
          <Link to="/concepts" className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-navy hover:text-copper transition-colors">
            Виж всички концепции <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {CONCEPTS.slice(0, 4).map((concept) => (
            <motion.div 
              key={concept.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link to={`/case-study/${concept.id}`} className="block aspect-[16/10] overflow-hidden mb-8 relative border border-softgray">
                <img 
                  src={concept.image} 
                  alt={concept.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                  {concept.category}
                </div>
              </Link>
              <Link to={`/case-study/${concept.id}`}>
                <h3 className="text-3xl mb-4 text-navy group-hover:text-copper transition-colors">{concept.title}</h3>
              </Link>
              <p className="text-charcoal font-light leading-relaxed max-w-xl">
                {concept.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Differentiation */}
      <section className="py-32 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-copper rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-copper rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {[
              { label: "Не каталог.", value: "Кураторство." },
              { label: "Не доставчик.", value: "Партньор." },
              { label: "Не продукти.", value: "Преживяване." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4">
                <p className="text-white/40 uppercase tracking-[0.3em] text-xs">{item.label}</p>
                <p className="text-4xl md:text-5xl font-serif italic text-copper">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Metrics */}
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Доверие</span>
              <h2 className="text-4xl md:text-5xl mb-8 text-navy">Доказани резултати в мащаб</h2>
              <p className="text-lg text-charcoal font-light mb-12 leading-relaxed">
                Работим с лидери в IT сектора, банковото дело и фармацията, за които качеството и точността не подлежат на компромис.
              </p>
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-5xl font-serif text-navy mb-2">300+</p>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-bold">Служители в проект</p>
                </div>
                <div>
                  <p className="text-5xl font-serif text-navy mb-2">3</p>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-bold">Седмици реализация</p>
                </div>
                <div>
                  <p className="text-5xl font-serif text-navy mb-2">100%</p>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-bold">Успешна доставка</p>
                </div>
                <div>
                  <p className="text-5xl font-serif text-navy mb-2">24/7</p>
                  <p className="text-xs uppercase tracking-widest text-navy/40 font-bold">Логистичен контрол</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-white border border-softgray flex items-center justify-center p-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all shadow-sm">
                  <span className="text-2xl font-bold italic opacity-20 text-navy">IT CORP</span>
                </div>
                <div className="aspect-[3/4] overflow-hidden border border-softgray shadow-sm">
                  <img src="https://picsum.photos/seed/box1/600/800" alt="Box detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-[3/4] overflow-hidden border border-softgray shadow-sm">
                  <img src="https://picsum.photos/seed/box2/600/800" alt="Box detail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-square bg-white border border-softgray flex items-center justify-center p-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all shadow-sm">
                  <span className="text-2xl font-bold italic opacity-20 text-navy">GLOBAL BANK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-white text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-7xl mb-12 leading-tight text-navy">Нека създадем нещо, което <span className="italic">ще се запомни</span></h2>
          <Link to="/contact" className="btn-premium text-xl px-12 py-6 bg-navy text-white hover:bg-copper">
            Заяви концепция
          </Link>
          <p className="mt-8 text-navy/40 text-sm uppercase tracking-widest">Първоначална консултация до 24 часа</p>
        </motion.div>
      </section>
    </main>
  );
};

export default Home;

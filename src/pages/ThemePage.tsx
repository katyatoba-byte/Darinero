import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Gift, Palette, Truck, ChevronDown, Clock } from 'lucide-react';
import { useContent } from '../content';
import { CatalogCard, CatalogDownloadModal, OfferForm, OfferModal, useCatalogDownload, useOfferModal } from '../components/LeadForms';

const STEPS = [
  { icon: Gift, title: 'Изберете', text: 'Готов комплект от каталога или ни кажете бюджета и повода.' },
  { icon: Palette, title: 'Персонализираме', text: 'Лого върху картичка, играчка, таг, бандерол или цялата кутия.' },
  { icon: Truck, title: 'Доставяме', text: 'До вашия офис или до всеки получател в страната.' },
];

const ThemePage = ({ slug }: { slug: string }) => {
  const { themePages, catalogs } = useContent();
  const page = themePages.find(p => p.id === slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const download = useCatalogDownload();
  const offer = useOfferModal();
  if (!page) return null;

  const pageCatalogs = catalogs.filter(c => c.status === 'active' && c.occasion === slug);
  const sets = (page.giftSets || []).filter(s => !s.hidden && s.name);
  const faqs = (page.faqs || []).filter(f => f.question && f.answer);
  const others = themePages.filter(p => p.id !== slug && !p.hidden);
  const ctx = { occasion: page.name, occasionSlug: slug };
  const firstCatalog = pageCatalogs.find(c => c.pdf);

  return (
    <main className="pt-32">
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">{page.name}</span>
            <h1 className="text-4xl md:text-6xl mb-8">{page.h1 || page.name}</h1>
            {page.intro && <p className="text-xl text-charcoal font-light leading-relaxed mb-10">{page.intro}</p>}
            <div className="flex flex-wrap gap-4">
              {firstCatalog && <button type="button" onClick={() => download.open(firstCatalog)} className="btn-premium bg-navy text-white hover:bg-copper">Изтеглете каталога</button>}
              <button type="button" onClick={() => offer.open(ctx)} className="btn-premium border border-navy text-navy hover:bg-navy hover:text-white">Поискайте оферта</button>
            </div>
          </motion.div>
        </div>
      </section>

      {page.deadlineEnabled && page.deadline && (
        <div className="bg-copper/15 border-y border-copper/30">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex gap-4 items-center text-navy">
            <Clock size={22} className="text-copper shrink-0" />
            <p className="font-medium">{page.deadline}</p>
          </div>
        </div>
      )}

      {sets.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto">
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Акцентни комплекти</span>
            <h2 className="text-4xl md:text-5xl mb-12">Популярни предложения</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sets.map(s => (
                <div key={s.name} className="bg-offwhite flex flex-col">
                  <div className="aspect-[4/3] overflow-hidden bg-softgray/40">
                    {s.image && <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {s.type && <span className="text-[10px] uppercase tracking-widest font-bold bg-white text-navy/70 px-3 py-1">{s.type}</span>}
                      {s.withLogo && <span className="text-[10px] uppercase tracking-widest font-bold bg-copper/15 text-navy px-3 py-1">С вашето лого</span>}
                    </div>
                    <h3 className="text-2xl font-serif text-navy mb-3">{s.name}</h3>
                    {s.description && <p className="text-charcoal font-light mb-6">{s.description}</p>}
                    <div className="mt-auto flex items-center justify-between gap-4">
                      {s.price && <p className="text-2xl font-serif text-navy">{s.price} <span className="text-xs font-sans text-charcoal">без ДДС</span></p>}
                      <button type="button" onClick={() => offer.open({ ...ctx, product: s.name })} className="text-copper font-bold uppercase text-xs tracking-widest hover:underline text-right">Запитване за този комплект →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-charcoal font-light mt-10">Всички предложения могат да се комбинират в собствен комплект. Вижте всички варианти в каталозите.</p>
          </div>
        </section>
      )}

      {pageCatalogs.length > 0 && (
        <section className="section-padding bg-offwhite">
          <div className="max-w-7xl mx-auto">
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Каталози</span>
            <h2 className="text-4xl md:text-5xl mb-12">Изтеглете каталога</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageCatalogs.map(c => <CatalogCard key={c.id} catalog={c} onDownload={download.open} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-navy text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-12">Как работим</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((st, i) => (
              <div key={st.title}>
                <div className="w-14 h-14 rounded-full bg-copper/20 text-copper flex items-center justify-center mb-6"><st.icon size={26} /></div>
                <h3 className="text-2xl font-serif mb-3">{i + 1}. {st.title}</h3>
                <p className="text-white/70 font-light">{st.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section-padding bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-10">Често задавани въпроси</h2>
            <div className="divide-y divide-navy/10 border-y border-navy/10">
              {faqs.map((f, i) => (
                <div key={f.question}>
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center gap-6 py-6 text-left" aria-expanded={openFaq === i}>
                    <span className="text-lg font-serif text-navy">{f.question}</span>
                    <ChevronDown size={20} className={`shrink-0 text-copper transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <p className="pb-6 text-charcoal font-light leading-relaxed">{f.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-offwhite">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-navy mb-10 text-center">Разкажете ни какво търсите — ще ви изпратим оферта до 1 работен ден.</h2>
          <OfferForm context={ctx} />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-wrap gap-x-8 gap-y-3 items-center">
          <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold">Вижте още</span>
          <Link to="/katalozi" className="text-navy hover:text-copper">Всички каталози</Link>
          {others.map(p => <Link key={p.id} to={'/' + p.id} className="text-navy hover:text-copper">{p.name}</Link>)}
          <Link to="/case-studies" className="text-navy hover:text-copper">Case Studies</Link>
        </div>
      </section>

      <CatalogDownloadModal ctl={download} onOffer={() => offer.open(ctx)} />
      <OfferModal ctl={offer} />
    </main>
  );
};

export default ThemePage;

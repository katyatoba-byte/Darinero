import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useContent } from '../content';
import { CatalogCard, CatalogDownloadModal, OfferForm, OfferModal, useCatalogDownload, useOfferModal } from '../components/LeadForms';

const Catalogs = () => {
  const { catalogs, themePages } = useContent();
  const active = catalogs.filter(c => c.status === 'active');
  const pageOf = (slug: string) => themePages.find(p => p.id === slug && !p.hidden);
  const occasions = useMemo(() => {
    const seen = new Set<string>();
    return active.map(c => c.occasion).filter(o => o && !seen.has(o) && seen.add(o));
  }, [active]);
  const [filter, setFilter] = useState('');
  const shown = filter ? active.filter(c => c.occasion === filter) : active;
  const download = useCatalogDownload();
  const offer = useOfferModal();
  const nameOf = (slug: string) => themePages.find(p => p.id === slug)?.name || slug;

  return (
    <main className="pt-32">
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mb-16">
            <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Каталог</span>
            <h1 className="text-5xl md:text-7xl mb-8">Каталози с корпоративни подаръци</h1>
            <p className="text-xl text-charcoal font-light leading-relaxed">
              Разгледайте готовите ни предложения или ни разкажете какъв подарък търсите. Ще подготвим решение според вашия бюджет, повод и количество — с вашето лого или без него.
            </p>
          </motion.div>

          {occasions.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-12">
              {[['', 'Всички'], ...occasions.map(o => [o, nameOf(o)])].map(([value, label]) => (
                <button key={value || 'all'} type="button" onClick={() => setFilter(value)}
                  className={`px-5 py-2 text-xs uppercase tracking-widest font-bold border transition-colors ${filter === value ? 'bg-navy text-white border-navy' : 'border-navy/20 text-navy hover:border-copper'}`}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {shown.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shown.map(c => (
                <CatalogCard key={c.id} catalog={c} onDownload={download.open} themeLink={pageOf(c.occasion) ? '/' + c.occasion : undefined} />
              ))}
            </div>
          ) : (
            <p className="text-charcoal font-light">В момента подготвяме новите каталози. Пишете ни и ще ви изпратим актуални предложения.</p>
          )}
        </div>
      </section>

      <section className="section-padding bg-navy text-offwhite">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl mb-6">Не откривате това, което търсите?</h2>
            <p className="text-offwhite/60 text-lg font-light leading-relaxed">Ще създадем подаръчен комплект специално за вашата фирма.</p>
          </div>
          <button type="button" onClick={() => offer.open({})} className="btn-premium bg-copper text-white hover:bg-offwhite hover:text-navy whitespace-nowrap">
            Поискайте оферта
          </button>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-navy mb-10 text-center">Разкажете ни какво търсите — ще ви изпратим оферта до 1 работен ден.</h2>
          <OfferForm />
        </div>
      </section>

      <CatalogDownloadModal ctl={download} onOffer={() => offer.open({})} />
      <OfferModal ctl={offer} />
    </main>
  );
};

export default Catalogs;

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const CASE_STUDIES = [
  {
    id: 'econt-logistics',
    title: 'Еконт – Мащабна логистика с личен почерк',
    summary: 'Спешна нужда от 30 висококачествени, персонализирани коледни подаръка за служители на Еконт в пиковия декемврийски период.',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'vivacom-magic',
    title: 'Vivacom – Магията на детайлите в голям мащаб',
    summary: 'Нужда от 40 специални пратки за ключови екипи, като всяка година концепцията е напълно нова и изненадваща.',
    image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'german-concern-subsidiary',
    title: 'Дъщерна фирма на германски концерн – Празнично преживяване за ценители',
    summary: 'Премиум селекция по специфично изискване за 22 специални подаръка за ключови фигури.',
    image: 'https://images.unsplash.com/photo-1511177545613-b150046cb47a?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'pharma-wellness',
    title: 'Фармацевтична компания – Уют и здраве в една кутия',
    summary: 'Постигане на максимален ефект с ограничен бюджет чрез креативен подбор на дълготраен подарък и консумативи.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'pharma-segmentation',
    title: 'Международна фармацевтична компания – Разнообразие и сегментация',
    summary: 'Разработка на сложна структура от 17 подаръка, разделени в 3 тематични линии за различни групи партньори.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'business-center-minimalism',
    title: 'Бизнес център – Луксът на минимализма',
    summary: 'Дизайнерски подход и брандинг за престижна имотна компания чрез минималистични подаръчни кутии.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
  }
];

export default function CaseStudies() {
  return (
    <div className="pt-32 pb-24 bg-offwhite min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <span className="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Портфолио</span>
          <h1 className="text-5xl md:text-7xl mb-8">Case Studies</h1>
          <p className="text-xl text-charcoal font-light leading-relaxed">
            Реални истории за мащабни проекти, кратки срокове и безкомпромисно качество.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {CASE_STUDIES.map((cs, idx) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <Link to={`/case-study/${cs.id}`} className="block aspect-video overflow-hidden">
                <img
                  src={cs.image}
                  alt={cs.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="p-8">
                <Link to={`/case-study/${cs.id}`}>
                  <h3 className="text-2xl font-serif mb-4 text-navy hover:text-copper transition-colors">{cs.title}</h3>
                </Link>
                <p className="text-charcoal font-light mb-8 line-clamp-3">{cs.summary}</p>
                <Link
                  to={`/case-study/${cs.id}`}
                  className="inline-flex items-center gap-2 text-copper font-bold uppercase text-xs tracking-widest hover:gap-4 transition-all"
                >
                  Виж детайли <span className="text-lg">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

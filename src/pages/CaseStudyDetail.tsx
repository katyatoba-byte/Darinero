import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';

import { useContent } from '../content';
import CoverImage from '../components/CoverImage';

const FormattedText = ({ text }: { text: string }) => {
  return (
    <div className="space-y-4">
      {text.split('\n').map((line, i) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('•')) {
          const content = trimmedLine.substring(1).trim();
          const [label, ...rest] = content.split(':');
          return (
            <div key={i} className="flex gap-4 pl-4">
              <span className="text-copper mt-1.5 text-sm">●</span>
              <p className="text-charcoal font-light leading-relaxed text-lg flex-1">
                {rest.length > 0 ? (
                  <>
                    <strong className="font-bold text-navy">{label}:</strong>
                    {rest.join(':')}
                  </>
                ) : (
                  content
                )}
              </p>
            </div>
          );
        }
        if (trimmedLine === '') return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-charcoal font-light leading-relaxed text-lg">
            {line}
          </p>
        );
      })}
    </div>
  );
};

export default function CaseStudyDetail() {
  const { id } = useParams();
  const { caseStudies } = useContent();
  const CASE_STUDIES: Record<string, any> = Object.fromEntries(caseStudies.map(cs => [cs.id, cs]));
  const cs = id ? CASE_STUDIES[id] : null;

  const facts: [string, string][] = cs ? ([
    ['Клиент', cs.client], ['Индустрия', cs.industry], ['Повод', cs.occasion], ['Обем', cs.quantity],
  ].filter(([, v]) => v) as [string, string][]) : [];

  if (!cs) {
    return (
      <div className="pt-32 pb-24 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-8">Case Study не е намерен</h1>
          <Link to="/case-studies" className="text-copper font-bold uppercase tracking-widest">
            Обратно към всички Case Studies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Link
            to="/case-studies"
            className="text-xs uppercase tracking-widest font-bold text-copper hover:text-navy transition-colors"
          >
            ← Обратно към всички Case Studies
          </Link>
          <h1 className="text-5xl md:text-7xl mt-8 mb-4">{cs.title}</h1>
          {cs.subtitle && <p className="text-xl text-copper font-serif italic mb-12">{cs.subtitle}</p>}
          {facts.length > 0 && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-6 border-y border-gray-100 py-8">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">{label}</dt>
                  <dd className="text-navy">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </motion.div>

        {cs.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[16/7] overflow-hidden mb-24 border border-gray-100"
          >
            <img src={cs.image} alt={cs.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 mb-24">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl mb-8 border-b border-gray-100 pb-4">1. Резюме (Executive Summary)</h2>
              <FormattedText text={cs.summary || ''} />
            </section>
            <section>
              <h2 className="text-3xl mb-8 border-b border-gray-100 pb-4">2. Предизвикателството (The Challenge)</h2>
              <FormattedText text={cs.challenge || ''} />
            </section>
            <section>
              <h2 className="text-3xl mb-8 border-b border-gray-100 pb-4">3. Нашето решение (The End-to-End Solution)</h2>
              <FormattedText text={cs.solution || ''} />
            </section>
          </div>

          <aside className="bg-navy p-12 text-white h-fit sticky top-32">
            <h2 className="text-2xl text-copper mb-8 font-serif italic">4. Резултати и Въздействие (Results & Impact)</h2>
            <div className="space-y-8">
              {(cs.results || []).map((result: string, idx: number) => (
                <div key={idx} className="border-l-2 border-copper pl-6">
                  <p className="text-white/80 font-light leading-relaxed">{result}</p>
                </div>
              ))}
            </div>
            {cs.services?.length > 0 && (
              <div className="mt-12 pt-12 border-t border-white/10">
                <h3 className="text-xs uppercase tracking-widest text-white/40 mb-4">Какво направихме</h3>
                <ul className="space-y-2 text-white/80 font-light">
                  {cs.services.map((s: string) => <li key={s}>— {s}</li>)}
                </ul>
              </div>
            )}
            <div className="mt-12 pt-12 border-t border-white/10">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-6">Искате подобен резултат?</p>
              <Link to="/contact" className="btn-premium w-full text-center block">Запитване</Link>
            </div>
          </aside>
        </div>

        {cs.testimonial?.text && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 border-y border-gray-100 py-16"
          >
            <div className="max-w-3xl mx-auto px-6 text-center">
              <div className="flex justify-center mb-8">
                <div className="w-12 h-px bg-copper/30" />
              </div>
              <p className="text-xl md:text-2xl font-light italic text-navy leading-relaxed mb-8">
                "{cs.testimonial.text}"
              </p>
              <div className="inline-flex flex-col items-center">
                <p className="font-bold text-navy uppercase tracking-[0.2em] text-xs mb-1">
                  {cs.testimonial.author}
                </p>
                <p className="text-copper text-[10px] uppercase tracking-[0.3em]">
                  {cs.testimonial.company}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {cs.gallery?.length > 0 && (
          <section className="mb-24">
            <h2 className="text-3xl mb-12 border-b border-gray-100 pb-4">Продукти и Детайли</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cs.gallery.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="aspect-square overflow-hidden border border-gray-100"
                >
                  <img
                    src={img}
                    alt={`Product detail ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="pt-24 border-t border-gray-100">
          <h2 className="text-3xl mb-12">Още Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {Object.entries(CASE_STUDIES)
              .filter(([key]) => key !== id)
              .slice(0, 3)
              .map(([key, study]: [string, any]) => (
                <Link key={key} to={`/case-study/${key}`} className="group block">
                  <div className="aspect-video overflow-hidden mb-6">
                    <CoverImage src={study.cardImage || study.image} alt={study.title} label={study.client} className="group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="text-xl font-serif text-navy group-hover:text-copper transition-colors line-clamp-2">
                    {study.title}
                  </h3>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

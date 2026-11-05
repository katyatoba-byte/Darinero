import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { useContent } from '../content';
import CoverImage from '../components/CoverImage';

export default function CaseStudies() {
  const { caseStudies } = useContent();
  const CASE_STUDIES = caseStudies.map(cs => ({ id: cs.id, title: cs.title, summary: cs.shortSummary || '', image: cs.cardImage || cs.image || '', client: cs.client || '' }));
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
                <CoverImage src={cs.image} alt={cs.title} label={cs.client} className="transition-transform duration-1000 group-hover:scale-110" />
              </Link>
              <div className="p-8">
                <Link to={`/case-study/${cs.id}`}>
                  <h2 className="text-2xl font-serif mb-4 text-navy hover:text-copper transition-colors">{cs.title}</h2>
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

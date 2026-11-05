import React, { createContext, useContext, useEffect, useState } from 'react';
import defaults from './data/default-content.json';
import { Category, Concept, Product, Service, ProcessStep } from './types';

export interface CaseStudy {
  id: string;
  title: string;
  subtitle?: string;
  shortSummary?: string;
  cardImage?: string;
  image?: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  testimonial?: { text: string; author: string; company: string };
  gallery?: string[];
  client?: string;
  industry?: string;
  occasion?: string;
  quantity?: string;
  services?: string[];
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  email: string;
  phone: string;
  address: string;
  footerLocation: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  inquiryEmail?: string;
  generalFaqs: { question: string; answer: string }[];
}

export interface SiteContent {
  settings: SiteSettings;
  concepts: (Concept & { link?: string })[];
  categories: Category[];
  products: Product[];
  services: Service[];
  processSteps: ProcessStep[];
  caseStudies: CaseStudy[];
}

const DEFAULTS = defaults as unknown as SiteContent;

// Merge loaded content over defaults so a missing section never breaks a page.
function normalize(data: any): SiteContent {
  if (!data || typeof data !== 'object') return DEFAULTS;
  const out: any = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS) as (keyof SiteContent)[]) {
    if (key === 'settings') {
      out.settings = { ...DEFAULTS.settings, ...(data.settings || {}) };
    } else if (Array.isArray(data[key])) {
      out[key] = data[key];
    }
  }
  return out as SiteContent;
}

const ContentContext = createContext<SiteContent>(DEFAULTS);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const embedded = typeof window !== 'undefined' ? (window as any).__DARINERO_CONTENT__ : null;
  const [content, setContent] = useState<SiteContent | null>(embedded ? normalize(embedded) : null);

  useEffect(() => {
    if (embedded) return;
    let done = false;
    const fallback = setTimeout(() => {
      if (!done) { done = true; setContent(DEFAULTS); }
    }, 4000);
    fetch('/api/content.php', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (!done) { done = true; setContent(normalize(data)); } })
      .catch(() => { if (!done) { done = true; setContent(DEFAULTS); } })
      .finally(() => clearTimeout(fallback));
    return () => clearTimeout(fallback);
  }, []);

  if (!content) {
    return <div className="min-h-screen bg-white" aria-busy="true" />;
  }
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

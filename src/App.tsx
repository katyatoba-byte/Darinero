import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Concepts from './pages/Concepts';
import About from './pages/About';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import ProductDetail from './pages/ProductDetail';
import Catalogs from './pages/Catalogs';
import ThemePage from './pages/ThemePage';
import Privacy from './pages/Privacy';
import { captureUtm } from './leads';
import { useContent } from './content';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Sets a meaningful <title> and meta description for every page.
const PageMeta = () => {
  const { pathname } = useLocation();
  const { settings, categories, products, caseStudies, themePages } = useContent();
  useEffect(() => {
    const [, section, id] = pathname.split('/');
    const fixed: Record<string, string> = {
      services: 'Услуги', 'case-studies': 'Case Studies', concepts: 'Концепции',
      about: 'За нас', contact: 'Контакт', categories: 'Каталог',
      katalozi: 'Каталози с корпоративни подаръци', 'politika-za-poveritelnost': 'Политика за поверителност',
    };
    let page = fixed[section] || '';
    let description = settings.siteDescription;
    if (section === 'category') {
      const c = categories.find(x => x.id === id);
      if (c) { page = c.title; description = c.description || description; }
    } else if (section === 'product') {
      const p = products.find(x => x.id === id);
      if (p) { page = p.title; description = p.positioning || description; }
    } else if (!id && themePages.some(t => t.id === section)) {
      const t = themePages.find(x => x.id === section)!;
      page = t.seoTitle || t.name; description = t.metaDescription || description;
    } else if (section === 'case-study') {
      const cs = caseStudies.find(x => x.id === id);
      if (cs) { page = cs.title; description = cs.shortSummary || description; }
    }
    document.title = page ? `${page} | DARINERO` : settings.siteTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', description);
  }, [pathname, settings, categories, products, caseStudies, themePages]);
  return null;
};

export default function App() {
  const { themePages } = useContent();
  useEffect(() => { captureUtm(); }, []);
  return (
    <Router>
      <ScrollToTop />
      <PageMeta />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-study/:id" element={<CaseStudyDetail />} />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/katalozi" element={<Catalogs />} />
            <Route path="/politika-za-poveritelnost" element={<Privacy />} />
            {themePages.filter(t => t.id && !t.hidden).map(t => (
              <Route key={t.id} path={'/' + t.id} element={<ThemePage slug={t.id} />} />
            ))}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

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
  const { settings, categories, products, caseStudies } = useContent();
  useEffect(() => {
    const [, section, id] = pathname.split('/');
    const fixed: Record<string, string> = {
      services: 'Услуги', 'case-studies': 'Case Studies', concepts: 'Концепции',
      about: 'За нас', contact: 'Контакт', categories: 'Каталог',
    };
    let page = fixed[section] || '';
    let description = settings.siteDescription;
    if (section === 'category') {
      const c = categories.find(x => x.id === id);
      if (c) { page = c.title; description = c.description || description; }
    } else if (section === 'product') {
      const p = products.find(x => x.id === id);
      if (p) { page = p.title; description = p.positioning || description; }
    } else if (section === 'case-study') {
      const cs = caseStudies.find(x => x.id === id);
      if (cs) { page = cs.title; description = cs.shortSummary || description; }
    }
    document.title = page ? `${page} | DARINERO` : settings.siteTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', description);
  }, [pathname, settings, categories, products, caseStudies]);
  return null;
};

export default function App() {
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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

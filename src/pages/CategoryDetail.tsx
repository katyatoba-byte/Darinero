import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CATEGORIES, PRODUCTS } from '../constants';

const CategoryDetail = () => {
  const { id } = useParams();
  const category = CATEGORIES.find(c => c.id === id);
  const allProducts = PRODUCTS.filter(p => p.categoryId === id);
  const mainProducts = allProducts.filter(p => !p.isReadyProposal);
  const readyProposals = allProducts.filter(p => p.isReadyProposal);

  if (!category) return <div>Category not found</div>;

  return (
    <main className="pt-32">
      <section className="section-padding bg-offwhite">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-24"
          >
            <Link to="/categories" className="text-copper uppercase tracking-widest text-xs font-bold mb-6 block hover:gap-2 transition-all">
              ← Назад към категориите
            </Link>
            <h1 className="text-5xl md:text-7xl mb-8">{category.title}</h1>
            <p className="text-xl text-charcoal font-light leading-relaxed">
              {category.description}
            </p>
          </motion.div>

          {category.id === 'christmas-employees' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16 p-8 bg-navy text-white border-l-4 border-copper"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif mb-4">Важна информация за визуализациите</h3>
                  <p className="text-white/70 font-light leading-relaxed">
                    Показаните тук продукти са примерни конфигурации за ваша ориентация. Тъй като всяко предложение е индивидуално, след вашето запитване ще подготвим <span className="text-copper font-bold italic">реални снимки на продуктите</span> и пълна визуална презентация на вашето конкретно предложение.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 flex-shrink-0">
                  <div className="w-16 h-16 border border-white/10 flex items-center justify-center opacity-40">
                    <img src="https://cdn-icons-png.flaticon.com/512/2913/2913520.png" alt="Icon" className="w-8 h-8 invert" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-16 h-16 border border-white/10 flex items-center justify-center opacity-40">
                    <img src="https://cdn-icons-png.flaticon.com/512/2913/2913532.png" alt="Icon" className="w-8 h-8 invert" referrerPolicy="no-referrer" />
                  </div>
                  <div className="w-16 h-16 border border-white/10 flex items-center justify-center opacity-40">
                    <img src="https://cdn-icons-png.flaticon.com/512/2913/2913564.png" alt="Icon" className="w-8 h-8 invert" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {category.id === 'christmas-employees' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-24"
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-copper">Примерни компоненти</h2>
                <div className="h-[1px] flex-1 bg-navy/10"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: "Занаятчийски шоколад", img: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=600" },
                  { title: "Бутиков чай", img: "https://images.unsplash.com/photo-1594631252845-29fc4586c562?auto=format&fit=crop&q=80&w=600" },
                  { title: "Дървени орнаменти", img: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&q=80&w=600" },
                  { title: "Премиум опаковка", img: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=600" }
                ].map((item, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden bg-offwhite border border-navy/5">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">{item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-charcoal/60 italic text-center">
                * Това са само част от възможните компоненти. Всяка кутия се конфигурира индивидуално спрямо вашите предпочитания.
              </p>
            </motion.div>
          )}

          {category.id === 'christmas-employees' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-24"
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-copper">Примерни завършени кутии</h2>
                <div className="h-[1px] flex-1 bg-navy/10"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Класически уют", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800" },
                  { title: "Премиум селекция", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800" },
                  { title: "Еко минимализъм", img: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800" }
                ].map((item, idx) => (
                  <div key={idx} className="group overflow-hidden bg-white border border-navy/5 shadow-sm">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h4 className="font-serif text-lg text-navy">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {mainProducts.length > 0 && (
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-copper">Основни решения</h2>
                <div className="h-[1px] flex-1 bg-navy/10"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {mainProducts.map((product, idx) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white border border-navy/5 overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <Link to={`/product/${product.id}`} className="block aspect-[16/9] overflow-hidden relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      {product.isReadyProposal && (
                        <div className="absolute top-4 right-4 bg-copper text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Готово предложение
                        </div>
                      )}
                    </Link>
                    <div className="p-10">
                      <div className="flex justify-between items-start mb-4">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <h2 className="text-3xl font-serif text-navy leading-tight hover:text-copper transition-colors">{product.title}</h2>
                        </Link>
                        <span className="text-copper font-bold text-sm tracking-widest uppercase whitespace-nowrap ml-4">{product.budget}</span>
                      </div>
                      <p className="text-charcoal font-light mb-8 leading-relaxed line-clamp-3">
                        {product.positioning}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-10 text-xs uppercase tracking-widest font-bold text-navy/60">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-copper/60">Мин. количество</span>
                          <span>{product.minQuantity}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-copper/60">Срок за изработка</span>
                          <span>{product.leadTime}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/product/${product.id}`} 
                        className="btn-premium bg-navy text-white hover:bg-copper w-full text-center"
                      >
                        Виж детайли и персонализирай
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {readyProposals.length > 0 && (
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-copper">Готови предложения</h2>
                <div className="h-[1px] flex-1 bg-navy/10"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {readyProposals.map((product, idx) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white border border-navy/5 overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <Link to={`/product/${product.id}`} className="block aspect-[16/9] overflow-hidden relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      {product.isReadyProposal && (
                        <div className="absolute top-4 right-4 bg-copper text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          Готово предложение
                        </div>
                      )}
                    </Link>
                    <div className="p-10">
                      <div className="flex justify-between items-start mb-4">
                        <Link to={`/product/${product.id}`} className="flex-1">
                          <h2 className="text-3xl font-serif text-navy leading-tight hover:text-copper transition-colors">{product.title}</h2>
                        </Link>
                        <span className="text-copper font-bold text-sm tracking-widest uppercase whitespace-nowrap ml-4">{product.budget}</span>
                      </div>
                      <p className="text-charcoal font-light mb-8 leading-relaxed line-clamp-3">
                        {product.positioning}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-10 text-xs uppercase tracking-widest font-bold text-navy/60">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-copper/60">Мин. количество</span>
                          <span>{product.minQuantity}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-copper/60">Срок за изработка</span>
                          <span>{product.leadTime}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/product/${product.id}`} 
                        className="btn-premium bg-navy text-white hover:bg-copper w-full text-center"
                      >
                        Виж детайли и персонализирай
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {allProducts.length === 0 && (
            <div className="text-center py-24 bg-white border border-navy/5">
              <p className="text-xl text-charcoal font-light">В момента няма продукти в тази категория. Моля, свържете се с нас за индивидуална оферта.</p>
              <Link to="/contact" className="btn-premium bg-copper text-white mt-8 inline-block">Свържете се с нас</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryDetail;

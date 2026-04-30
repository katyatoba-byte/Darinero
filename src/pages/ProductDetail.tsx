import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ChevronDown, Plus, Minus } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../constants';
import ProductCustomizer from '../components/ProductCustomizer';
import QuickOrder from '../components/QuickOrder';
import { Item } from '../types';

const ProductDetail = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const category = CATEGORIES.find(c => c.id === product?.categoryId);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<{ items: Item[], quantity: number } | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!product) return <div>Product not found</div>;

  const faqs = [
    {
      question: "Какво е минималното количество за поръчка?",
      answer: "Минималното количество за поръчка на корпоративни подаръчни кутии е 10 броя. Важно е да знаете, че за добавяне на персонализация (брандиране с лого) минималното количество е 20 броя."
    },
    {
      question: "Колко време отнема изработката и доставката?",
      answer: "Стандартният срок за изработка е между 1 и 3 седмици, в зависимост от сложността на конфигурацията и натовареността на сезона. Препоръчваме ранни запитвания за коледния период."
    },
    {
      question: "Мога ли да добавя собствено лого върху продуктите?",
      answer: "Да, предлагаме пълно брандиране при поръчка на над 20 броя. Логото ви може да бъде поставено върху кутията, картичката и върху голяма част от самите продукти чрез гравиране, печат или стикери."
    },
    {
      question: "Предлагате ли индивидуална доставка до адреси на служители?",
      answer: "Да, можем да организираме логистиката директно до домовете на вашите служители или до офиси на куриер, спестявайки ви време и усилия в координацията."
    },
    {
      question: "Мога ли да променя съдържанието на готова кутия?",
      answer: "Разбира се. Всяко наше готово предложение е само отправна точка. Можем да добавим, премахнем или заменим продукти, за да отговорим точно на вашия бюджет и изисквания."
    }
  ];

  const displayProducts = PRODUCTS
    .filter(p => p.id !== product.id && p.isReadyProposal && p.categoryId === product.categoryId)
    .slice(0, 3);

  const handleInquiry = (config: { items: Item[], quantity: number }) => {
    setCurrentConfig(config);
    setShowInquiryForm(true);
    // Scroll to form
    setTimeout(() => {
      const element = document.getElementById('inquiry-section');
      if (element) {
        window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <main className="pt-32">
      {/* Product Hero / Quick Order */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {product.isReadyProposal ? (
            <div className="space-y-16">
              <Link to={`/category/${product.categoryId}`} className="text-copper uppercase tracking-widest text-xs font-bold mb-6 block hover:gap-2 transition-all">
                ← Назад към {category?.title}
              </Link>
              <QuickOrder product={product} onInquiry={handleInquiry} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pt-16 border-t border-navy/5">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-serif text-navy">За продукта</h2>
                    <p className="text-charcoal font-light leading-relaxed text-lg whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>

                  {product.brandingDescription && (
                    <div className="space-y-6 p-8 bg-offwhite border border-navy/5">
                      <h3 className="text-2xl font-serif text-navy">Гъвкави решения за вашия бранд</h3>
                      <p className="text-charcoal font-light leading-relaxed whitespace-pre-wrap">
                        {product.brandingDescription}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-12">
                  {product.technicalSpecs && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-serif text-navy">Техническа спецификация</h3>
                      <div className="border border-navy/5 overflow-hidden">
                        {product.technicalSpecs.map((spec, idx) => (
                          <div key={idx} className={`grid grid-cols-2 p-4 ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-white'} border-b border-navy/5 last:border-0`}>
                            <span className="text-xs uppercase tracking-widest font-bold text-navy/60">{spec.label}</span>
                            <span className="text-navy font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.suitableForList && (
                    <div className="space-y-6">
                      <h3 className="text-xs uppercase tracking-widest font-bold text-copper">ЗА КОГО Е ПОДХОДЯЩ</h3>
                      <ul className="space-y-4">
                        {product.suitableForList.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-navy font-medium">
                            <div className="w-1.5 h-1.5 bg-copper rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.whyChooseList && (
                    <div className="space-y-6">
                      <h3 className="text-xs uppercase tracking-widest font-bold text-copper">Защо да изберете този корпоративен подарък</h3>
                      <ul className="space-y-4">
                        {product.whyChooseList.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-navy font-medium">
                            <Check size={16} className="text-copper" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* How we work section */}
              <div className="pt-24 border-t border-navy/5">
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h2 className="text-4xl font-serif text-navy mb-6">Как работим</h2>
                  <p className="text-charcoal font-light text-lg italic">
                    Тъй като продаваме услуга, а не само стока, за нас е важно да видите стъпките до крайния резултат:
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { 
                      num: '01', 
                      title: 'Свързваме се с вас', 
                      desc: 'След като получим вашето запитване, се свързваме с вас, за да обсъдим детайлите по персонализацията.' 
                    },
                    { 
                      num: '02', 
                      title: 'Изпращане на лого', 
                      desc: 'Изпращате запитване с вашето лого и предпочитания за брандиране.' 
                    },
                    { 
                      num: '03', 
                      title: 'Визуализация', 
                      desc: 'Изпращаме ви дигитален проект за одобрение преди стартиране на изработката.' 
                    },
                    { 
                      num: '04', 
                      title: 'Изработка и доставка', 
                      desc: '7-10 работни дни за персонализирани поръчки. Без персонализация – до 3 дни.' 
                    }
                  ].map((step, idx) => (
                    <div key={idx} className="relative p-8 bg-white border border-navy/5 hover:shadow-xl transition-all group">
                      <span className="text-6xl font-serif text-navy/5 absolute top-4 right-4 group-hover:text-copper/10 transition-colors">{step.num}</span>
                      <h4 className="text-lg font-bold text-navy mb-4 relative z-10">{step.title}</h4>
                      <p className="text-sm text-charcoal font-light leading-relaxed relative z-10">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              {product.faqs && (
                <div className="pt-24 border-t border-navy/5">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-serif text-navy mb-12 text-center">Често задавани въпроси</h2>
                    <div className="space-y-6">
                      {product.faqs.map((faq, idx) => (
                        <div key={idx} className="p-8 bg-offwhite border border-navy/5">
                          <h4 className="text-lg font-bold text-navy mb-4">„{faq.question}“</h4>
                          <p className="text-charcoal font-light leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <Link to={`/category/${product.categoryId}`} className="text-copper uppercase tracking-widest text-xs font-bold mb-6 block hover:gap-2 transition-all">
                  ← Назад към {category?.title}
                </Link>
                <h1 className="text-5xl md:text-6xl font-serif text-navy">{product.title}</h1>
                <p className="text-2xl text-copper font-light italic">{product.positioning}</p>
                <p className="text-charcoal font-light leading-relaxed text-lg whitespace-pre-wrap">
                  {product.description}
                  {"\n\n"}
                  Подаръци, които не просто стоят в шкафа, а карат служителите ви да се чувстват истински оценени.
                </p>
                
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-navy/5">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-copper">Бюджет</span>
                    <p className="text-navy font-bold">{product.budget}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-copper">Мин. количество</span>
                    <p className="text-navy font-bold">{product.minQuantity}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-copper">Срок за изработка</span>
                    <p className="text-navy font-bold">{product.leadTime}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-copper">Персонализация</span>
                    <p className="text-navy font-bold">{product.personalizationType}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-8">
                  <button 
                    onClick={() => {
                      const element = document.getElementById('customizer-section');
                      if (element) window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
                    }}
                    className="btn-premium bg-navy text-white px-8 py-4 hover:bg-copper w-full md:w-auto"
                  >
                    Конфигурирайте кутия
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {product.images.slice(1).map((img, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden">
                      <img 
                        src={img} 
                        alt={`${product.title} detail`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Customizer Section - Only for non-ready proposals */}
      {!product.isReadyProposal && (
        <section id="customizer-section" className="section-padding bg-offwhite border-y border-navy/5">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mb-16">
              <h2 className="text-4xl md:text-5xl mb-6">Персонализирайте вашата кутия</h2>
              <p className="text-charcoal font-light text-lg">
                Изберете от нашата селекция допълнителни продукти, за да направите подаръка още по-специален.
              </p>
            </div>
            <ProductCustomizer product={product} onInquiry={handleInquiry} />
          </div>
        </section>
      )}

      {/* Inquiry Form Section */}
      <section id="inquiry-section" className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6">Изпратете вашето запитване</h2>
            <p className="text-charcoal font-light text-lg">
              Кажете ни: бюджет, брой и дали искате брандиране – ние ще предложим решение.
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-navy">Име и фамилия</label>
                <input type="text" className="w-full p-4 border border-navy/10 focus:border-copper outline-none transition-colors" placeholder="Константин Георгиев" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-navy">Компания</label>
                <input type="text" className="w-full p-4 border border-navy/10 focus:border-copper outline-none transition-colors" placeholder="DARINERO ЕООД" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-navy">Имейл</label>
                <input type="email" className="w-full p-4 border border-navy/10 focus:border-copper outline-none transition-colors" placeholder="office@darinero.bg" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-navy">Телефон</label>
                <input type="tel" className="w-full p-4 border border-navy/10 focus:border-copper outline-none transition-colors" placeholder="+359 888 000 000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-navy">Допълнителни изисквания</label>
              <textarea rows={4} className="w-full p-4 border border-navy/10 focus:border-copper outline-none transition-colors" placeholder="Имате ли изисквания за брандиране, стил или бюджет?"></textarea>
            </div>
            
            {currentConfig && (
              <div className="p-6 bg-offwhite border border-navy/5 space-y-4">
                <h4 className="font-bold text-navy uppercase text-xs tracking-widest">Вашата избрана конфигурация:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentConfig.items.map(item => (
                    <span key={item.id} className="text-[10px] bg-navy text-white px-3 py-1 uppercase tracking-widest">{item.name}</span>
                  ))}
                </div>
                <p className="text-sm font-bold text-copper">Количество: {currentConfig.quantity} броя</p>
              </div>
            )}

            <button type="submit" className="btn-premium bg-navy text-white w-full py-6 hover:bg-copper">
              Изпрати конфигурацията
            </button>
          </form>

          {/* How it Works - Integrated into the flow */}
          {product.id === 'christmas-employees-gifts' && (
            <div className="mt-24 pt-24 border-t border-navy/5">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-serif text-navy mb-4">Как работи</h3>
                <div className="w-16 h-0.5 bg-copper mx-auto" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { num: '01', title: 'Конфигурирате', desc: 'Избирате продукти и персонализация' },
                  { num: '02', title: 'Запитване', desc: 'Изпращате вашата конфигурация' },
                  { num: '03', title: 'Оферта', desc: 'Получавате оферта + визия до 24ч.' },
                  { num: '04', title: 'Изпълнение', desc: 'Одобрявате и ние поемаме всичко' }
                ].map((step, idx) => (
                  <div key={idx} className="text-center space-y-2">
                    <span className="text-3xl font-serif text-copper/30 block">{step.num}</span>
                    <h4 className="text-sm font-bold text-navy">{step.title}</h4>
                    <p className="text-[11px] text-charcoal font-light leading-tight">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.id === 'christmas-employees-gifts' && (
            <div className="mt-24 space-y-16">
              <div className="p-12 bg-offwhite border border-navy/5 text-center space-y-10">
                <div className="space-y-4">
                  <h3 className="text-3xl font-serif text-navy">Коледни подаръци за служители, без губене на време и грешни избори.</h3>
                  <p className="text-xl text-copper font-light italic">Вие избирате съдържанието. Ние го превръщаме в завършен подарък, готов за поднасяне.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-navy/5">
                  <div className="space-y-2">
                    <Check className="text-copper mx-auto" />
                    <p className="text-sm font-bold text-navy uppercase tracking-widest">Без риск от неподходящ избор</p>
                  </div>
                  <div className="space-y-2">
                    <Check className="text-copper mx-auto" />
                    <p className="text-sm font-bold text-navy uppercase tracking-widest">Спестявате десетки часове координация</p>
                  </div>
                  <div className="space-y-2">
                    <Check className="text-copper mx-auto" />
                    <p className="text-sm font-bold text-navy uppercase tracking-widest">Получавате готово решение, не списък с продукти</p>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-3xl mx-auto space-y-6">
                <p className="text-2xl font-serif text-navy italic leading-relaxed">
                  „Не избирате просто продукти. Избирате какво усещане ще получат вашите служители. Ние ще се погрижим това да изглежда точно както трябва.“
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {displayProducts.length > 0 && (
        <section className="section-padding bg-offwhite">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-navy mb-12">Избери от нашите готови предложения</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayProducts.map(relatedProduct => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/product/${relatedProduct.id}`}
                  className="group bg-white border border-navy/5 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={relatedProduct.images[0]} 
                      alt={relatedProduct.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-navy mb-2">{relatedProduct.title}</h3>
                    <p className="text-copper text-sm font-bold uppercase tracking-widest">{relatedProduct.budget}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-navy mb-4">Често задавани въпроси</h2>
            <div className="w-20 h-1 bg-copper mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-navy/5 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-offwhite/30 hover:bg-offwhite/50 transition-colors"
                >
                  <span className="font-serif text-lg text-navy pr-8">{faq.question}</span>
                  <div className="flex-shrink-0 text-copper">
                    {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0, opacity: openFaq === index ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-charcoal font-light leading-relaxed border-t border-navy/5">
                    {faq.answer}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default ProductDetail;

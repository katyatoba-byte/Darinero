import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Check, Info } from 'lucide-react';
import { Product, Item } from '../types';

interface ProductCustomizerProps {
  product: Product;
  onInquiry: (config: { items: Item[], quantity: number }) => void;
}

const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ product, onInquiry }) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>(product.defaultItems);
  const [selectedPersonalization, setSelectedPersonalization] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(parseInt(product.minQuantity));

  const toggleItem = (item: Item) => {
    const isBaseItem = product.defaultItems.some(d => d.id === item.id);
    const selectedBaseItems = selectedItems.filter(i => 
      product.defaultItems.some(d => d.id === i.id)
    );

    if (isSelected(item.id)) {
      // Constraint: Always keep at least one base product
      if (isBaseItem && selectedBaseItems.length <= 1) {
        return;
      }
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const togglePersonalization = (option: string) => {
    if (selectedPersonalization.includes(option)) {
      setSelectedPersonalization(selectedPersonalization.filter(o => o !== option));
    } else {
      setSelectedPersonalization([...selectedPersonalization, option]);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    const minQty = parseInt(product.minQuantity);
    const finalQty = Math.max(minQty, newQty);
    setQuantity(finalQty);
  };

  const isSelected = (itemId: string) => !!selectedItems.find(i => i.id === itemId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-16">
        {/* Section 1: Box Base */}
        <section>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-serif text-navy">Започвате от тук</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold bg-navy/5 px-3 py-1 text-navy/60">Основа на кутията</span>
            </div>
            <p className="text-charcoal font-light">Изберете основата на вашата кутия. Трябва да остане поне един продукт като база.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.defaultItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => toggleItem(item)}
                className={`p-6 border transition-all text-left flex flex-col gap-4 group ${
                  isSelected(item.id) 
                    ? 'border-navy bg-navy/5 shadow-sm' 
                    : 'border-navy/5 bg-white hover:border-navy/20'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected(item.id) ? 'bg-navy text-white' : 'bg-offwhite text-navy group-hover:bg-navy group-hover:text-white'
                }`}>
                  {isSelected(item.id) ? <Check size={18} /> : <Plus size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">{item.name}</h4>
                  <p className="text-[11px] text-charcoal font-light leading-relaxed">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 2: Optional Items */}
        <section>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-serif text-navy">Надградете според бюджета</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold bg-copper/10 px-3 py-1 text-copper">Добавете към кутията</span>
            </div>
            <p className="text-charcoal font-light">Добавете продукти за премиум усещане, практичност или емоционален ефект. Повечето клиенти избират бюджет между 15 и 40 €.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.optionalItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => toggleItem(item)}
                className={`p-6 border transition-all text-left flex items-start gap-4 group ${
                  isSelected(item.id) 
                    ? 'border-copper bg-copper/5 shadow-sm' 
                    : 'border-navy/5 bg-white hover:border-navy/20'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected(item.id) ? 'bg-copper text-white' : 'bg-offwhite text-navy group-hover:bg-navy group-hover:text-white'
                }`}>
                  {isSelected(item.id) ? <Check size={18} /> : <Plus size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-navy text-sm mb-1">{item.name}</h4>
                  <p className="text-[11px] text-copper font-medium italic">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Personalization */}
        {product.personalizationOptions && (
          <section>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-serif text-navy">Пълно брандиране с вашето лого</h3>
                <span className="text-[10px] uppercase tracking-widest font-bold bg-navy/5 px-3 py-1 text-navy/60">Персонализация</span>
              </div>
              <div className="space-y-3">
                <p className="text-charcoal font-light">Професионалното интегриране на вашия бранд превръща кутията в корпоративен подарък. Всички персонализации се визуализират преди потвърждение.</p>
                
                {quantity < 20 && (
                  <div className="bg-copper/10 border-l-4 border-copper p-4 flex items-start gap-3">
                    <Info size={18} className="text-copper shrink-0 mt-0.5" />
                    <div>
                      <p className="text-copper font-bold text-sm">Важно: Персонализацията се предлага при поръчка на минимум 20 броя.</p>
                      <p className="text-copper/80 text-xs mt-1">Можете да изберете опциите сега, но те ще бъдат валидни при финална поръчка над 20 бр.</p>
                    </div>
                  </div>
                )}
                
                <p className="text-copper font-bold italic text-sm">Ние ще ви изпратим готово предложение – не списък с продукти.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.personalizationOptions.map((option) => (
                <label 
                  key={option}
                  className={`flex items-center gap-4 p-4 border transition-all cursor-pointer ${
                    selectedPersonalization.includes(option)
                      ? 'border-copper bg-copper/5'
                      : 'border-navy/5 bg-white hover:border-navy/10'
                  }`}
                >
                  <div className={`w-6 h-6 border flex items-center justify-center transition-colors ${
                    selectedPersonalization.includes(option) ? 'bg-copper border-copper text-white' : 'border-navy/20'
                  }`}>
                    {selectedPersonalization.includes(option) && <Check size={14} />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={selectedPersonalization.includes(option)}
                    onChange={() => togglePersonalization(option)}
                  />
                  <span className="text-sm font-medium text-navy">{option}</span>
                </label>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Summary Panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-32 bg-navy p-10 text-offwhite border border-white/10 shadow-2xl">
          <h3 className="text-2xl font-serif mb-8 border-b border-white/10 pb-6 text-white">Вашата конфигурация</h3>
          
          <div className="space-y-8 mb-10">
            {/* Base Products */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Основа</span>
              <ul className="space-y-2 text-xs font-light">
                {selectedItems.filter(i => product.defaultItems.some(d => d.id === i.id)).map(item => (
                  <li key={item.id} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-copper rounded-full" />
                      {item.name}
                    </div>
                    <button 
                      onClick={() => toggleItem(item)}
                      className="text-white/20 hover:text-copper transition-colors opacity-0 group-hover/item:opacity-100"
                      title="Премахни"
                    >
                      <Minus size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Added Products */}
            {selectedItems.filter(i => !product.defaultItems.find(d => d.id === i.id)).length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Добавени продукти</span>
                <ul className="space-y-2 text-xs font-light">
                  {selectedItems.filter(i => !product.defaultItems.find(d => d.id === i.id)).map(item => (
                    <li key={item.id} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-copper rounded-full" />
                        {item.name}
                      </div>
                      <button 
                        onClick={() => toggleItem(item)}
                        className="text-white/20 hover:text-copper transition-colors opacity-0 group-hover/item:opacity-100"
                        title="Премахни"
                      >
                        <Minus size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Personalization */}
            {selectedPersonalization.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Персонализация</span>
                <ul className="space-y-2 text-xs font-light">
                  {selectedPersonalization.map(option => (
                    <li key={option} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-copper rounded-full" />
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6 mb-10 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest font-bold text-white/40">Количество</span>
              <div className="flex items-center gap-2 bg-white/5 p-1 border border-white/10">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:text-copper transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input 
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) handleQuantityChange(val);
                  }}
                  onBlur={() => {
                    handleQuantityChange(quantity);
                  }}
                  className="w-16 text-center font-bold bg-transparent outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button 
                  onClick={() => handleQuantityChange(quantity + 1) }
                  className="w-8 h-8 flex items-center justify-center hover:text-copper transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-white/40 italic flex items-start gap-2">
              <Info size={12} className="shrink-0 mt-0.5" />
              Минимално количество: {product.minQuantity}
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => onInquiry({ items: selectedItems, quantity })}
              className="btn-premium bg-copper text-white w-full hover:bg-offwhite hover:text-navy py-6"
            >
              Изпрати конфигурацията
            </button>
            <div className="space-y-2 text-center">
              <p className="text-[10px] text-white/60 uppercase tracking-widest">
                Ще получите индивидуална оферта до 24 часа
              </p>
              <p className="text-[9px] text-white/30 leading-tight">
                Офертата включва: Конкретна цена, Визия на подаръка, Препоръки за оптимизация
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;

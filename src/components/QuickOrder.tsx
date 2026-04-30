import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Info, Plus, Minus, Sparkles, Package } from 'lucide-react';
import { Product, Item } from '../types';

interface QuickOrderProps {
  product: Product;
  onInquiry: (config: { items: Item[], quantity: number }) => void;
}

const QuickOrder: React.FC<QuickOrderProps> = ({ product, onInquiry }) => {
  const [withPersonalization, setWithPersonalization] = useState(true);
  const minQty = parseInt(product.minQuantity) || 1;
  const [quantity, setQuantity] = useState(Math.max(minQty, product.id === 'ready-anniversary' ? 1 : 50));
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  
  const canPersonalizeAnyQuantity = product.id === 'ready-anniversary';

  useEffect(() => {
    if (withPersonalization) {
      setSelectedItems([...product.defaultItems, ...product.optionalItems]);
    } else {
      setSelectedItems([...product.defaultItems]);
    }
  }, [withPersonalization, product]);

  const handleOrder = () => {
    onInquiry({ items: selectedItems, quantity });
  };

  return (
    <div className="bg-white shadow-2xl overflow-hidden border border-navy/5">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Product Image Section */}
        <div className="relative aspect-square lg:aspect-auto overflow-hidden bg-offwhite">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <span className="bg-navy text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 shadow-lg">
              Готово предложение
            </span>
            {withPersonalization && (
              <span className="bg-copper text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 shadow-lg flex items-center gap-2">
                <Sparkles size={12} /> Персонализирано
              </span>
            )}
          </div>
        </div>

        {/* Order Controls Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif text-navy mb-4">{product.title}</h1>
              <p className="text-copper font-light italic text-lg">{product.positioning}</p>
            </div>

            {/* Contents Summary */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-navy/40 flex items-center gap-2">
                <Package size={14} /> Какво съдържа кутията:
              </h3>
              <ul className="grid grid-cols-1 gap-3">
                {product.defaultItems.map(item => (
                  <li key={item.id} className="flex items-start gap-3 text-sm text-charcoal font-light">
                    <div className="mt-1 w-4 h-4 bg-navy/5 rounded-full flex items-center justify-center text-navy shrink-0">
                      <Check size={10} />
                    </div>
                    <span><strong className="font-bold text-navy">{item.name}</strong> – {item.description}</span>
                  </li>
                ))}
                {withPersonalization && product.optionalItems.map(item => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={item.id} 
                    className="flex items-start gap-3 text-sm text-copper font-medium"
                  >
                    <div className="mt-1 w-4 h-4 bg-copper/10 rounded-full flex items-center justify-center text-copper shrink-0">
                      <Sparkles size={10} />
                    </div>
                    <span><strong className="font-bold">{item.name}</strong> – {item.description}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Personalization Toggle */}
            <div className="space-y-4 pt-6 border-t border-navy/5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest font-bold text-navy/40">Опция за брандиране</label>
                {quantity < 20 && !canPersonalizeAnyQuantity && (
                  <span className="text-[10px] text-copper font-bold uppercase tracking-widest bg-copper/5 px-2 py-1">Минимум 20 бр. за брандиране</span>
                )}
                {canPersonalizeAnyQuantity && (
                   <span className="text-[10px] text-copper font-bold uppercase tracking-widest bg-copper/5 px-2 py-1">Персонализация от 1 бр.</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setWithPersonalization(false)}
                  className={`py-4 px-6 border text-xs uppercase tracking-widest font-bold transition-all ${
                    !withPersonalization 
                      ? 'bg-navy text-white border-navy' 
                      : 'bg-white text-navy border-navy/10 hover:border-navy/30'
                  }`}
                >
                  Без персонализация
                </button>
                <button 
                  onClick={() => setWithPersonalization(true)}
                  className={`py-4 px-6 border text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${
                    withPersonalization 
                      ? 'bg-copper text-white border-copper shadow-lg' 
                      : 'bg-white text-copper border-copper/20 hover:border-copper/40'
                  }`}
                >
                  <Sparkles size={14} /> С персонализация
                </button>
              </div>
              {quantity < 20 && !canPersonalizeAnyQuantity && (
                <p className="text-[10px] text-copper italic font-medium">
                  * Важно: Персонализацията (лого, картички, брандиране) се предлага при поръчка на 20 или повече броя.
                </p>
              )}
              {canPersonalizeAnyQuantity && (
                <p className="text-[10px] text-copper italic font-medium">
                  * За този сет персонализацията на картичка и кутия е възможна дори за 1 брой.
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4 pt-6 border-t border-navy/5">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-widest font-bold text-navy/40">Количество</label>
                <div className="flex items-center gap-6 bg-offwhite p-2 border border-navy/5">
                  <button 
                    onClick={() => setQuantity(Math.max(parseInt(product.minQuantity) || 1, canPersonalizeAnyQuantity ? quantity - 1 : quantity - 10))}
                    className="w-10 h-10 flex items-center justify-center hover:text-copper transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-16 text-center font-bold text-xl text-navy">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(canPersonalizeAnyQuantity ? quantity + 1 : quantity + 10)}
                    className="w-10 h-10 flex items-center justify-center hover:text-copper transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-charcoal/40 italic flex items-center gap-2">
                <Info size={12} /> Минимално количество: {product.minQuantity}
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex justify-between items-end mb-4">
              <span className="text-xs uppercase tracking-widest font-bold text-navy/40">Бюджет на кутия</span>
              <span className="text-3xl font-serif text-navy">{product.budget}</span>
            </div>
            <button 
              onClick={handleOrder}
              className="btn-premium bg-navy text-white w-full py-8 text-lg hover:bg-copper shadow-xl"
            >
              Поръчай сега
            </button>
            <p className="text-[10px] text-center text-charcoal/40 uppercase tracking-widest">
              Индивидуална оферта и визуализация до 24 часа
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickOrder;

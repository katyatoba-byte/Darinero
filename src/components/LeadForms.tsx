import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Download, Send, FileText } from 'lucide-react';
import { GiftCatalog, useContent } from '../content';
import { getRememberedLead, rememberLead, requestCatalog, startDownload } from '../leads';
import { submitInquiry } from '../inquiry';

const inputCls = 'w-full bg-transparent border-b border-navy/20 py-2 outline-none focus:border-copper transition-colors';
const labelCls = 'text-[10px] uppercase tracking-widest font-bold text-navy/50';

export function Modal({ open, onClose, children, wide }: { open: boolean; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`relative bg-white w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} my-8 p-6 md:p-10 shadow-2xl`} onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-navy/50 hover:text-navy" aria-label="Затвори"><X size={24} /></button>
        {children}
      </div>
    </div>
  );
}

const ConsentText = () => (
  <>Съгласен/на съм да получавам предложения и нови каталози от Darinero. Мога да се отпиша по всяко време. <Link to="/politika-za-poveritelnost" target="_blank" className="underline hover:text-copper">Политика за поверителност</Link></>
);

// ---------- Catalogue download ----------

export function useCatalogDownload() {
  const [catalog, setCatalog] = useState<GiftCatalog | null>(null);
  const [done, setDone] = useState(false);
  const open = async (c: GiftCatalog) => {
    if (!c.pdf) return;
    const lead = getRememberedLead();
    if (lead) {
      // Known visitor: download straight away and record it in the background.
      startDownload(c.pdf, c.title);
      requestCatalog(c.id, lead, true);
      return;
    }
    setDone(false);
    setCatalog(c);
  };
  return { catalog, done, setDone, open, close: () => setCatalog(null) };
}

export function CatalogDownloadModal({ ctl, onOffer }: { ctl: ReturnType<typeof useCatalogDownload>; onOffer?: () => void }) {
  const { catalog, done, setDone, close } = ctl;
  const [form, setForm] = useState({ name: '', company: '', email: '', consent: false, website: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [pdf, setPdf] = useState('');
  if (!catalog) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSending(true);
    const r = await requestCatalog(catalog.id, form, false);
    setSending(false);
    if (!r.ok || !r.pdf) { setError(r.error || 'Възникна грешка.'); return; }
    rememberLead({ name: form.name, company: form.company, email: form.email, consent: form.consent });
    setPdf(r.pdf);
    setDone(true);
    startDownload(r.pdf, catalog.title);
  };

  return (
    <Modal open={!!catalog} onClose={close}>
      <div className="flex gap-5 items-start mb-6 pr-8">
        {catalog.cover && <img src={catalog.cover} alt="" className="w-20 shadow-md shrink-0" />}
        <div>
          <span className="text-copper uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Каталог</span>
          <h2 className="text-2xl font-serif text-navy leading-tight">Изтеглете каталога „{catalog.title}“</h2>
        </div>
      </div>
      {done ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-copper text-white rounded-full flex items-center justify-center mx-auto mb-6"><Download size={28} /></div>
          <p className="text-xl font-serif text-navy mb-6">Благодарим! Каталогът се сваля.</p>
          <a href={pdf} target="_blank" rel="noopener" className="btn-premium bg-navy text-white hover:bg-copper inline-block mb-4">Изтеглете каталога</a>
          {onOffer && <div><button type="button" onClick={() => { close(); onOffer(); }} className="text-copper uppercase text-xs font-bold tracking-widest hover:underline mt-2">Поискайте оферта →</button></div>}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <input type="text" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="space-y-1"><label className={labelCls}>Име *</label><input required className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoComplete="name" /></div>
          <div className="space-y-1"><label className={labelCls}>Фирма *</label><input required className={inputCls} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} autoComplete="organization" /></div>
          <div className="space-y-1"><label className={labelCls}>Служебен имейл *</label><input required type="email" className={inputCls} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" /></div>
          <label className="flex gap-3 items-start text-sm text-charcoal font-light">
            <input type="checkbox" className="mt-1 accent-copper" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} />
            <span><ConsentText /></span>
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={sending} className="btn-premium w-full bg-navy text-white hover:bg-copper disabled:opacity-60 flex items-center justify-center gap-2">
            <Download size={16} /> {sending ? 'Изпращане…' : 'Изтеглете каталога'}
          </button>
        </form>
      )}
    </Modal>
  );
}

// ---------- Catalogue card ----------

export function CatalogCard({ catalog, themeLink, onDownload }: { catalog: GiftCatalog; themeLink?: string; onDownload: (c: GiftCatalog) => void }) {
  return (
    <div className="group bg-white border border-navy/5 shadow-sm hover:shadow-md transition-all flex flex-col">
      <button type="button" onClick={() => onDownload(catalog)} disabled={!catalog.pdf} className="block aspect-[3/4] overflow-hidden bg-offwhite relative">
        {catalog.cover
          ? <img src={catalog.cover} alt={catalog.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          : <span className="absolute inset-0 flex items-center justify-center text-navy/20"><FileText size={64} /></span>}
      </button>
      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {catalog.priceRange && <span className="text-[10px] uppercase tracking-widest font-bold bg-copper/10 text-navy px-3 py-1">{catalog.priceRange}</span>}
          {catalog.pages && <span className="text-[10px] uppercase tracking-widest font-bold bg-offwhite text-navy/60 px-3 py-1">{catalog.pages} стр.</span>}
        </div>
        <h3 className="text-2xl font-serif mb-3 text-navy">{catalog.title}</h3>
        {catalog.description && <p className="text-charcoal font-light mb-6">{catalog.description}</p>}
        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 items-center">
          {catalog.pdf
            ? <button type="button" onClick={() => onDownload(catalog)} className="btn-premium bg-navy text-white hover:bg-copper text-xs">Изтеглете каталога</button>
            : <span className="text-xs uppercase tracking-widest font-bold text-navy/40">Скоро</span>}
          {themeLink && <Link to={themeLink} className="text-copper font-bold uppercase text-xs tracking-widest hover:underline">Вижте комплектите →</Link>}
        </div>
      </div>
    </div>
  );
}

// ---------- Offer / inquiry form ----------

export const OCCASIONS = ['Коледа', '8 март', 'Великден', 'Onboarding', 'Партньори', 'Събитие', 'Друго'];
const QUANTITIES = ['до 20', '20–50', '50–100', 'над 100'];
const BUDGETS = ['до 10 €', '10–20 €', '20–40 €', 'над 40 €'];
const LOOKING = ['Готов комплект', 'Комплект с нашето лого', 'Индивидуално предложение'];

export interface OfferContext { occasion?: string; occasionSlug?: string; product?: string; catalog?: string }

export function OfferForm({ context, onDone }: { context?: OfferContext; onDone?: () => void }) {
  const { settings } = useContent();
  const lead = getRememberedLead();
  const empty = {
    name: lead?.name || '', company: lead?.company || '', email: lead?.email || '', phone: '',
    occasion: context?.occasion && OCCASIONS.includes(context.occasion) ? context.occasion : '',
    quantity: '', budget: '', deliveryDate: '', lookingFor: '', product: context?.product || '', message: '', consent: false, website: '',
  };
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  useEffect(() => { setForm(f => ({ ...f, product: context?.product || '' })); }, [context?.product]);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSending(true);
    const r = await submitInquiry({
      source: 'Запитване за оферта', ...form, catalog: context?.catalog || '', occasionSlug: context?.occasionSlug || '', confirm: true,
    });
    setSending(false);
    if (!r.ok) { setError(r.error || ''); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-copper text-white rounded-full flex items-center justify-center mx-auto mb-6"><Send size={26} /></div>
        <p className="text-2xl font-serif text-navy mb-3">Здравейте{form.name ? `, ${form.name}` : ''}! Получихме запитването ви{form.occasion ? ` за ${form.occasion}` : ''}.</p>
        <p className="text-charcoal font-light">Ще се свържем с вас с конкретно предложение до 1 работен ден. Ако е спешно: <a className="text-copper" href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></p>
        {onDone && <button type="button" onClick={onDone} className="mt-8 text-copper uppercase text-xs font-bold tracking-widest hover:underline">Затвори</button>}
      </div>
    );
  }

  const select = (k: keyof typeof empty, label: string, opts: string[]) => (
    <div className="space-y-1">
      <label className={labelCls}>{label} *</label>
      <select required className={inputCls} value={form[k] as string} onChange={set(k)}>
        <option value="" disabled>— изберете —</option>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-6">
      <input type="text" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1"><label className={labelCls}>Име *</label><input required className={inputCls} value={form.name} onChange={set('name')} autoComplete="name" /></div>
        <div className="space-y-1"><label className={labelCls}>Фирма *</label><input required className={inputCls} value={form.company} onChange={set('company')} autoComplete="organization" /></div>
        <div className="space-y-1"><label className={labelCls}>Служебен имейл *</label><input required type="email" className={inputCls} value={form.email} onChange={set('email')} autoComplete="email" /></div>
        <div className="space-y-1"><label className={labelCls}>Телефон</label><input type="tel" className={inputCls} value={form.phone} onChange={set('phone')} autoComplete="tel" /></div>
        {select('occasion', 'Повод', OCCASIONS)}
        {select('quantity', 'Брой подаръци', QUANTITIES)}
        {select('budget', 'Бюджет на брой без ДДС', BUDGETS)}
        <div className="space-y-1"><label className={labelCls}>Желана дата за доставка *</label><input required type="date" className={inputCls} value={form.deliveryDate} onChange={set('deliveryDate')} /></div>
      </div>
      {select('lookingFor', 'Какво търсите', LOOKING)}
      {form.product && (
        <div className="flex items-center gap-3 text-sm">
          <span className={labelCls}>Избран комплект:</span>
          <span className="bg-offwhite px-3 py-1 text-navy">{form.product}</span>
          <button type="button" className="text-navy/40 hover:text-navy" onClick={() => setForm(f => ({ ...f, product: '' }))} aria-label="Премахни"><X size={16} /></button>
        </div>
      )}
      <div className="space-y-1"><label className={labelCls}>Съобщение</label><textarea rows={3} className={inputCls + ' resize-none'} value={form.message} onChange={set('message')} /></div>
      <label className="flex gap-3 items-start text-sm text-charcoal font-light">
        <input type="checkbox" className="mt-1 accent-copper" checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))} />
        <span><ConsentText /></span>
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={sending} className="btn-premium w-full bg-navy text-white hover:bg-copper disabled:opacity-60">
        {sending ? 'Изпращане…' : 'Изпратете запитване'}
      </button>
      <p className="text-sm text-charcoal font-light text-center">
        <a href={`mailto:${settings.email}`} className="hover:text-copper">{settings.email}</a> · <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-copper">{settings.phone}</a>
      </p>
    </form>
  );
}

export function useOfferModal() {
  const [ctx, setCtx] = useState<OfferContext | null>(null);
  return { ctx, open: (c: OfferContext = {}) => setCtx(c), close: () => setCtx(null) };
}

export function OfferModal({ ctl }: { ctl: ReturnType<typeof useOfferModal> }) {
  return (
    <Modal open={!!ctl.ctx} onClose={ctl.close} wide>
      <span className="text-copper uppercase tracking-[0.3em] text-[10px] font-bold block mb-3">Оферта</span>
      <h2 className="text-3xl font-serif text-navy mb-8 pr-8">Разкажете ни какво търсите — ще ви изпратим оферта до 1 работен ден.</h2>
      {ctl.ctx && <OfferForm context={ctl.ctx} onDone={ctl.close} />}
    </Modal>
  );
}

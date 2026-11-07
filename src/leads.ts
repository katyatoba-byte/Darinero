// Helpers for the catalogue download form, UTM tracking and the remembered visitor.

const UTM_KEY = 'darinero_utm';
const LEAD_KEY = 'darinero_lead';
const UTM_DAYS = 30;
const LEAD_DAYS = 180;

export interface Utm { utm_source?: string; utm_medium?: string; utm_campaign?: string }
export interface RememberedLead { name: string; company: string; email: string; consent: boolean }

function store(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify({ value, at: Date.now() })); } catch { /* storage unavailable */ }
}
function read<T>(key: string, days: number): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, at } = JSON.parse(raw);
    if (Date.now() - at > days * 864e5) { localStorage.removeItem(key); return null; }
    return value as T;
  } catch { return null; }
}

// Called on every page load: keeps the UTM parameters of the visit that brought the person here.
export function captureUtm() {
  if (typeof window === 'undefined') return;
  const p = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  (['utm_source', 'utm_medium', 'utm_campaign'] as const).forEach(k => { const v = p.get(k); if (v) utm[k] = v.slice(0, 100); });
  if (Object.keys(utm).length && !read<Utm>(UTM_KEY, UTM_DAYS)) store(UTM_KEY, utm);
}
export const getUtm = (): Utm => read<Utm>(UTM_KEY, UTM_DAYS) || {};

export const getRememberedLead = () => read<RememberedLead>(LEAD_KEY, LEAD_DAYS);
export const rememberLead = (lead: RememberedLead) => store(LEAD_KEY, lead);

export async function requestCatalog(catalogId: string, lead: RememberedLead & { website?: string }, repeat: boolean): Promise<{ ok: boolean; pdf?: string; error?: string }> {
  try {
    const res = await fetch('/api/catalog-download.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalogId, ...lead, repeat, page: window.location.pathname, ...getUtm() }),
    });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok) return { ok: true, pdf: json.pdf };
    return { ok: false, error: json?.error || 'Възникна грешка. Моля, опитайте отново.' };
  } catch {
    return { ok: false, error: 'Няма връзка със сървъра. Моля, опитайте отново.' };
  }
}

export function startDownload(url: string, title: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = (title || 'katalog').replace(/[^\p{L}\p{N}]+/gu, '-') + '.pdf';
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

import { getUtm } from './leads';

export interface InquiryPayload {
  source: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  employees?: string;
  occasion?: string;
  budget?: string;
  message?: string;
  product?: string;
  configuration?: string;
  quantity?: string;
  deliveryDate?: string;
  lookingFor?: string;
  catalog?: string;
  occasionSlug?: string;
  consent?: boolean;
  confirm?: boolean; // send a confirmation e-mail to the client
  website?: string; // honeypot – must stay empty
}

export async function submitInquiry(data: InquiryPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/inquiry.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, page: window.location.pathname, ...getUtm() }),
    });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.ok) return { ok: true };
    return { ok: false, error: json?.error || 'Възникна грешка. Моля, опитайте отново или ни пишете на имейл.' };
  } catch {
    return { ok: false, error: 'Няма връзка със сървъра. Моля, опитайте отново или ни пишете на имейл.' };
  }
}

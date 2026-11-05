/* DARINERO admin panel – edits /api/content.php data through /admin/api.php */
(() => {
  'use strict';

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') node.className = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) node.append(c.nodeType ? c : document.createTextNode(String(c)));
    return node;
  };
  const clone = o => JSON.parse(JSON.stringify(o));

  async function api(action, body, isForm) {
    const opts = { method: 'POST', headers: { 'X-CSRF': window.CSRF }, credentials: 'same-origin' };
    if (isForm) opts.body = body;
    else { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body || {}); }
    const res = await fetch('/admin/api.php?action=' + encodeURIComponent(action), opts);
    const json = await res.json().catch(() => ({ ok: false, error: 'Неочакван отговор от сървъра.' }));
    if (json.relogin) { alertBox('Сесията е изтекла. Презаредете страницата и влезте отново.'); }
    if (!json.ok) throw new Error(json.error || 'Грешка');
    return json;
  }

  const TRANSLIT = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sht',ъ:'a',ь:'y',ю:'yu',я:'ya' };
  const slugify = s => String(s || '').toLowerCase().split('').map(c => TRANSLIT[c] ?? c).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'item-' + Date.now().toString(36);

  // ---------- schema ----------
  const ITEM = [
    { key: 'id', label: 'ID', type: 'id', from: 'name' },
    { key: 'name', label: 'Име', type: 'text' },
    { key: 'description', label: 'Описание', type: 'text' },
    { key: 'image', label: 'Снимка (по желание)', type: 'image' },
  ];
  const SCHEMA = {
    categories: { label: 'Категории', titleKey: 'title', fields: [
      { key: 'id', label: 'ID (част от адреса /category/…)', type: 'id', from: 'title' },
      { key: 'title', label: 'Заглавие', type: 'text' },
      { key: 'description', label: 'Описание', type: 'textarea' },
      { key: 'image', label: 'Снимка', type: 'image' },
    ]},
    products: { label: 'Продукти', titleKey: 'title', groupBy: 'categoryId', fields: [
      { key: 'id', label: 'ID (част от адреса /product/…)', type: 'id', from: 'title' },
      { key: 'categoryId', label: 'Категория', type: 'category' },
      { key: 'title', label: 'Заглавие', type: 'text' },
      { key: 'positioning', label: 'Кратко позициониране (под заглавието)', type: 'text' },
      { key: 'description', label: 'Описание', type: 'textarea' },
      { key: 'images', label: 'Снимки', type: 'images' },
      { key: 'isReadyProposal', label: 'Готово предложение (без конфигуратор)', type: 'bool' },
      { key: 'budget', label: 'Бюджет', type: 'text', half: true },
      { key: 'minQuantity', label: 'Минимално количество', type: 'text', half: true },
      { key: 'leadTime', label: 'Срок за изработка', type: 'text', half: true },
      { key: 'occasionType', label: 'Повод', type: 'text', half: true },
      { key: 'suitableFor', label: 'Подходящо за', type: 'text', half: true },
      { key: 'boxStyle', label: 'Стил на кутията', type: 'text', half: true },
      { key: 'personalizationType', label: 'Тип персонализация', type: 'text', half: true },
      { key: 'individualDelivery', label: 'Индивидуална доставка', type: 'bool', half: true },
      { key: 'defaultItems', label: 'Включени продукти в кутията', type: 'array', titleKey: 'name', fields: ITEM },
      { key: 'optionalItems', label: 'Допълнителни (по избор) продукти', type: 'array', titleKey: 'name', fields: ITEM },
      { key: 'personalizationOptions', label: 'Опции за персонализация', type: 'list' },
      { key: 'suitableForList', label: 'Подходящо за (списък)', type: 'list' },
      { key: 'whyChooseList', label: 'Защо да изберете (списък)', type: 'list' },
      { key: 'brandingDescription', label: 'Текст за брандиране', type: 'textarea' },
      { key: 'technicalSpecs', label: 'Технически характеристики', type: 'array', titleKey: 'label', fields: [
        { key: 'label', label: 'Характеристика', type: 'text', half: true }, { key: 'value', label: 'Стойност', type: 'text', half: true } ] },
      { key: 'faqs', label: 'Въпроси за този продукт', type: 'array', titleKey: 'question', fields: [
        { key: 'question', label: 'Въпрос', type: 'text' }, { key: 'answer', label: 'Отговор', type: 'textarea' } ] },
    ]},
    concepts: { label: 'Концепции', titleKey: 'title', fields: [
      { key: 'id', label: 'ID', type: 'id', from: 'title' },
      { key: 'title', label: 'Заглавие', type: 'text' },
      { key: 'category', label: 'Етикет (напр. Onboarding)', type: 'text' },
      { key: 'description', label: 'Описание', type: 'textarea' },
      { key: 'image', label: 'Снимка', type: 'image' },
      { key: 'link', label: 'Линк при клик (напр. /contact или /case-study/econt-logistics)', type: 'text' },
    ]},
    caseStudies: { label: 'Case Studies', titleKey: 'title', fields: [
      { key: 'id', label: 'ID (част от адреса /case-study/…)', type: 'id', from: 'title' },
      { key: 'title', label: 'Заглавие', type: 'text' },
      { key: 'subtitle', label: 'Подзаглавие', type: 'text' },
      { key: 'client', label: 'Клиент', type: 'text', half: true },
      { key: 'industry', label: 'Индустрия', type: 'text', half: true },
      { key: 'occasion', label: 'Повод', type: 'text', half: true },
      { key: 'quantity', label: 'Обем (напр. 75 комплекта)', type: 'text', half: true },
      { key: 'services', label: 'Какво направихме (списък)', type: 'list' },
      { key: 'shortSummary', label: 'Кратко описание (за картата в списъка и за Google)', type: 'textarea' },
      { key: 'cardImage', label: 'Снимка за картата в списъка', type: 'image' },
      { key: 'image', label: 'Голяма снимка на страницата', type: 'image' },
      { key: 'summary', label: '1. Резюме (всеки ред с • става точка)', type: 'textarea', rows: 8 },
      { key: 'challenge', label: '2. Предизвикателството', type: 'textarea', rows: 8 },
      { key: 'solution', label: '3. Нашето решение', type: 'textarea', rows: 10 },
      { key: 'results', label: '4. Резултати', type: 'list', multiline: true },
      { key: 'testimonial', label: 'Отзив от клиента', type: 'object', fields: [
        { key: 'text', label: 'Текст', type: 'textarea' },
        { key: 'author', label: 'Автор', type: 'text', half: true },
        { key: 'company', label: 'Компания / длъжност', type: 'text', half: true } ] },
      { key: 'gallery', label: 'Галерия', type: 'images' },
    ]},
    services: { label: 'Услуги', titleKey: 'title', fields: [
      { key: 'id', label: 'ID', type: 'id', from: 'title' },
      { key: 'title', label: 'Заглавие', type: 'text' },
      { key: 'description', label: 'Описание', type: 'textarea' },
      { key: 'useCase', label: 'Кога се използва', type: 'text' },
      { key: 'value', label: 'Стойност за клиента', type: 'text' },
      { key: 'budget', label: 'Бюджет', type: 'text' },
    ]},
    processSteps: { label: 'Стъпки на процеса (начална страница)', titleKey: 'title', fields: [
      { key: 'number', label: 'Номер', type: 'text', half: true },
      { key: 'title', label: 'Заглавие', type: 'text', half: true },
      { key: 'description', label: 'Описание', type: 'textarea' },
    ]},
  };
  const SETTINGS = [
    { key: 'email', label: 'Имейл за контакт (показва се на сайта)', type: 'text', half: true },
    { key: 'phone', label: 'Телефон', type: 'text', half: true },
    { key: 'address', label: 'Адрес (страница Контакт)', type: 'text', half: true },
    { key: 'footerLocation', label: 'Град във футъра', type: 'text', half: true },
    { key: 'inquiryEmail', label: 'Имейл, на който пристигат запитванията', type: 'text' },
    { key: 'siteTitle', label: 'Заглавие на сайта (Google и браузър)', type: 'text' },
    { key: 'siteDescription', label: 'Описание за Google (до ~160 символа)', type: 'textarea', rows: 3 },
    { key: 'instagram', label: 'Instagram линк (празно = скрит)', type: 'text' },
    { key: 'facebook', label: 'Facebook линк (празно = скрит)', type: 'text' },
    { key: 'linkedin', label: 'LinkedIn линк (празно = скрит)', type: 'text' },
    { key: 'generalFaqs', label: 'Общи въпроси (показват се на всяка продуктова страница)', type: 'array', titleKey: 'question', fields: [
      { key: 'question', label: 'Въпрос', type: 'text' }, { key: 'answer', label: 'Отговор', type: 'textarea' } ] },
  ];

  const TABS = [
    ['inquiries', 'Запитвания'], ['products', 'Продукти'], ['categories', 'Категории'],
    ['caseStudies', 'Case Studies'], ['concepts', 'Концепции'], ['services', 'Услуги'],
    ['processSteps', 'Процес'], ['settings', 'Настройки'], ['tools', 'Версии и парола'],
  ];

  // ---------- state ----------
  let content = null;
  let dirty = false;
  let current = location.hash.slice(1) || 'inquiries';
  const ui = { filter: '', open: new Set() };

  const status = $('#status');
  const saveBtn = $('#saveBtn');
  const app = $('#app');

  function setDirty(v = true) {
    dirty = v;
    saveBtn.disabled = !v;
    status.textContent = v ? 'Има незапазени промени' : status.textContent;
    status.className = v ? 'warn' : 'muted';
  }
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  function alertBox(msg, kind = 'error') {
    const box = el('div', { class: 'toast ' + kind }, msg);
    document.body.append(box);
    setTimeout(() => box.remove(), kind === 'error' ? 7000 : 3000);
  }

  saveBtn.addEventListener('click', save);
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (dirty) save(); }
  });

  async function save() {
    const problem = validate();
    if (problem) { alertBox(problem); return; }
    saveBtn.disabled = true;
    status.textContent = 'Записване…';
    try {
      const r = await api('save', { content });
      dirty = false;
      status.textContent = 'Запазено в ' + r.savedAt + ' – промените вече са на сайта';
      status.className = 'ok';
      alertBox('Запазено. Промените са видими на сайта.', 'ok');
    } catch (err) {
      saveBtn.disabled = false;
      status.textContent = 'Грешка при записа';
      alertBox(err.message);
    }
  }

  function validate() {
    for (const [section, def] of Object.entries(SCHEMA)) {
      const ids = new Set();
      for (const item of content[section] || []) {
        if (!def.fields.some(f => f.key === 'id')) break;
        if (!item.id) return `${def.label}: „${item[def.titleKey] || 'нов запис'}“ няма ID.`;
        if (ids.has(item.id)) return `${def.label}: ID „${item.id}“ се повтаря.`;
        ids.add(item.id);
      }
    }
    for (const p of content.products) {
      if (!content.categories.some(c => c.id === p.categoryId)) return `Продукт „${p.title}“ няма валидна категория.`;
    }
    return '';
  }

  // ---------- field renderers ----------
  function field(def, obj, onChange) {
    const val = obj[def.key];
    const set = v => { obj[def.key] = v; setDirty(); onChange && onChange(); };
    const wrap = el('div', { class: 'field' + (def.half ? ' half' : '') });
    const label = el('label', {}, def.label);
    wrap.append(label);

    switch (def.type) {
      case 'text':
      case 'id': {
        const input = el('input', { value: val ?? '', oninput: e => set(e.target.value) });
        if (def.type === 'id') {
          input.addEventListener('input', () => { input.value = slugify(input.value).replace(/-$/, ''); });
          input.addEventListener('blur', () => { input.value = slugify(input.value); set(input.value); });
          wrap.append(input, el('small', { class: 'muted' }, 'Само латински букви, цифри и тирета. Промяната сменя адреса на страницата.'));
        } else wrap.append(input);
        break;
      }
      case 'textarea':
        wrap.append(el('textarea', { rows: def.rows || 4, oninput: e => set(e.target.value) }, val ?? ''));
        break;
      case 'bool':
        wrap.className += ' checkbox';
        label.prepend(el('input', { type: 'checkbox', checked: !!val, onchange: e => set(e.target.checked) }));
        break;
      case 'category': {
        const sel = el('select', { onchange: e => set(e.target.value) },
          content.categories.map(c => el('option', { value: c.id, selected: c.id === val }, c.title)));
        if (!content.categories.some(c => c.id === val)) sel.prepend(el('option', { value: '', selected: true }, '— изберете —'));
        wrap.append(sel);
        break;
      }
      case 'image':
        wrap.append(imageInput(val, v => { set(v); }));
        break;
      case 'images': {
        const list = Array.isArray(val) ? val : (obj[def.key] = []);
        const box = el('div', { class: 'images' });
        const draw = () => {
          box.replaceChildren(
            ...list.map((url, i) => el('div', { class: 'img-item' },
              imageInput(url, v => { list[i] = v; setDirty(); }),
              el('div', { class: 'row-actions' },
                i > 0 ? el('button', { type: 'button', class: 'ghost sm', onclick: () => { [list[i - 1], list[i]] = [list[i], list[i - 1]]; setDirty(); draw(); } }, '←') : null,
                el('button', { type: 'button', class: 'ghost sm danger', onclick: () => { list.splice(i, 1); setDirty(); draw(); } }, 'Премахни')))),
            el('div', { class: 'img-item add' }, uploadButton('+ Добави снимка', url => { list.push(url); setDirty(); draw(); }, true)));
        };
        draw();
        wrap.append(box);
        break;
      }
      case 'list': {
        const list = Array.isArray(val) ? val : (obj[def.key] = []);
        const box = el('div', { class: 'list' });
        const draw = () => {
          box.replaceChildren(
            ...list.map((s, i) => el('div', { class: 'list-row' },
              def.multiline
                ? el('textarea', { rows: 2, oninput: e => { list[i] = e.target.value; setDirty(); } }, s)
                : el('input', { value: s, oninput: e => { list[i] = e.target.value; setDirty(); } }),
              el('button', { type: 'button', class: 'ghost sm', title: 'Нагоре', onclick: () => { if (i) { [list[i - 1], list[i]] = [list[i], list[i - 1]]; setDirty(); draw(); } } }, '↑'),
              el('button', { type: 'button', class: 'ghost sm danger', title: 'Изтрий', onclick: () => { list.splice(i, 1); setDirty(); draw(); } }, '✕'))),
            el('button', { type: 'button', class: 'ghost sm', onclick: () => { list.push(''); setDirty(); draw(); setTimeout(() => box.querySelectorAll('input,textarea')[list.length - 1]?.focus()); } }, '+ Добави ред'));
        };
        draw();
        wrap.append(box);
        break;
      }
      case 'object': {
        const o = val && typeof val === 'object' ? val : (obj[def.key] = {});
        const grid = el('div', { class: 'grid nested' });
        def.fields.forEach(f => grid.append(field(f, o)));
        wrap.append(grid);
        break;
      }
      case 'array': {
        const list = Array.isArray(val) ? val : (obj[def.key] = []);
        wrap.append(arrayEditor(list, def, true));
        break;
      }
    }
    return wrap;
  }

  function imageInput(url, onSet) {
    const box = el('div', { class: 'image-input' });
    const preview = el('div', { class: 'preview' });
    const input = el('input', { value: url || '', placeholder: 'Адрес на снимка или качете файл' });
    const showPreview = u => preview.replaceChildren(u ? el('img', { src: u, alt: '', loading: 'lazy', onerror: e => e.target.classList.add('broken') }) : el('span', { class: 'muted' }, 'няма снимка'));
    input.addEventListener('change', () => { onSet(input.value.trim()); showPreview(input.value.trim()); });
    showPreview(url);
    const isPlaceholder = /picsum\.photos/.test(url || '');
    box.append(preview, el('div', { class: 'image-controls' }, input,
      uploadButton('Качи снимка', u => { input.value = u; onSet(u); showPreview(u); }),
      isPlaceholder ? el('small', { class: 'warn' }, 'Временна картинка – сменете с реална снимка') : null));
    return box;
  }

  function uploadButton(text, onUrl, primary) {
    const file = el('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp,image/gif', hidden: true });
    const btn = el('button', { type: 'button', class: primary ? 'secondary' : 'ghost sm', onclick: () => file.click() }, text);
    file.addEventListener('change', async () => {
      if (!file.files[0]) return;
      const fd = new FormData();
      fd.append('file', file.files[0]);
      const old = btn.textContent;
      btn.textContent = 'Качване…';
      btn.disabled = true;
      try { const r = await api('upload', fd, true); onUrl(r.url); }
      catch (err) { alertBox(err.message); }
      finally { btn.textContent = old; btn.disabled = false; file.value = ''; }
    });
    return el('span', {}, btn, file);
  }

  function arrayEditor(list, def, nested) {
    const box = el('div', { class: nested ? 'array nested' : 'array' });
    const titleOf = item => (item[def.titleKey] || '').toString().trim() || '(без заглавие)';
    const draw = () => {
      const filter = nested ? '' : ui.filter.toLowerCase();
      const rows = [];
      let lastGroup = null;
      list.forEach((item, i) => {
        if (filter && !JSON.stringify(item).toLowerCase().includes(filter)) return;
        if (def.groupBy && !filter) {
          const g = item[def.groupBy];
          if (g !== lastGroup) {
            lastGroup = g;
            rows.push(el('h3', { class: 'group' }, content.categories.find(c => c.id === g)?.title || 'Без категория'));
          }
        }
        const key = (nested ? 'n:' : '') + current + ':' + (item.id || i) + ':' + i;
        const details = el('details', { class: 'item', open: ui.open.has(key) });
        details.addEventListener('toggle', () => { details.open ? ui.open.add(key) : ui.open.delete(key); if (details.open && !body.childElementCount) fill(); });
        const titleSpan = el('span', { class: 'item-title' }, titleOf(item));
        const summary = el('summary', {}, titleSpan,
          el('span', { class: 'row-actions', onclick: e => e.preventDefault() },
            el('button', { type: 'button', class: 'ghost sm', title: 'Нагоре', onclick: () => move(i, -1) }, '↑'),
            el('button', { type: 'button', class: 'ghost sm', title: 'Надолу', onclick: () => move(i, 1) }, '↓'),
            el('button', { type: 'button', class: 'ghost sm', title: 'Копие', onclick: () => duplicate(i) }, 'Копие'),
            el('button', { type: 'button', class: 'ghost sm danger', title: 'Изтрий', onclick: () => remove(i) }, 'Изтрий')));
        const body = el('div', { class: 'grid' });
        const fill = () => def.fields.forEach(f => body.append(field(f, item, () => {
          if (f.key === def.titleKey) titleSpan.textContent = titleOf(item);
        })));
        if (details.open) fill();
        details.append(summary, body);
        rows.push(details);
      });
      if (!rows.length) rows.push(el('p', { class: 'muted' }, filter ? 'Няма съвпадения.' : 'Няма записи.'));
      box.replaceChildren(...rows,
        el('button', { type: 'button', class: nested ? 'ghost sm' : 'secondary', onclick: add }, nested ? '+ Добави' : '+ Добави нов запис'));
    };
    const move = (i, d) => { const j = i + d; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; setDirty(); draw(); };
    const remove = i => { if (confirm(`Да изтрия ли „${titleOf(list[i])}“?`)) { list.splice(i, 1); setDirty(); draw(); } };
    const duplicate = i => {
      const copy = clone(list[i]);
      if ('id' in copy) copy.id = slugify(copy.id + '-kopie');
      if (def.titleKey in copy) copy[def.titleKey] = copy[def.titleKey] + ' (копие)';
      list.splice(i + 1, 0, copy); setDirty(); draw();
    };
    const add = () => {
      const item = {};
      def.fields.forEach(f => {
        item[f.key] = f.type === 'list' || f.type === 'images' || f.type === 'array' ? []
          : f.type === 'bool' ? false : f.type === 'object' ? {} : '';
      });
      if ('id' in item) item.id = 'nov-' + Date.now().toString(36);
      if (def.groupBy && content.categories[0]) item[def.groupBy] = content.categories[0].id;
      list.push(item);
      const key = (nested ? 'n:' : '') + current + ':' + item.id + ':' + (list.length - 1);
      ui.open.add(key);
      setDirty(); draw();
      setTimeout(() => box.querySelectorAll('details.item')[box.querySelectorAll('details.item').length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    };
    draw();
    return box;
  }

  // ---------- views ----------
  function renderTabs() {
    $('#tabs').replaceChildren(...TABS.map(([id, label]) =>
      el('a', { href: '#' + id, class: id === current ? 'active' : '' }, label)));
  }

  function render() {
    renderTabs();
    if (current === 'inquiries') return renderInquiries();
    if (current === 'settings') {
      const grid = el('div', { class: 'grid' });
      SETTINGS.forEach(f => grid.append(field(f, content.settings)));
      return app.replaceChildren(el('h2', {}, 'Настройки'), grid);
    }
    if (current === 'tools') return renderTools();
    const def = SCHEMA[current];
    if (!def) { current = 'inquiries'; return render(); }
    const search = el('input', { type: 'search', placeholder: 'Търсене…', value: ui.filter, class: 'search' });
    let editor = arrayEditor(content[current], def, false);
    search.addEventListener('input', () => {
      ui.filter = search.value;
      const fresh = arrayEditor(content[current], def, false);
      editor.replaceWith(fresh);
      editor = fresh;
    });
    app.replaceChildren(el('div', { class: 'section-head' }, el('h2', {}, def.label), search), editor);
  }

  async function renderInquiries() {
    app.replaceChildren(el('h2', {}, 'Запитвания'), el('p', { class: 'muted' }, 'Зареждане…'));
    let list = [];
    try { list = (await api('inquiries')).inquiries; } catch (err) { app.append(el('p', { class: 'error' }, err.message)); return; }
    if (current !== 'inquiries') return;
    const open = list.filter(i => !i.handled).length;
    const labels = { source: 'Източник', company: 'Компания', email: 'Имейл', phone: 'Телефон', employees: 'Брой служители', occasion: 'Повод', budget: 'Бюджет', product: 'Продукт', configuration: 'Конфигурация', message: 'Съобщение', page: 'Страница' };
    app.replaceChildren(
      el('div', { class: 'section-head' }, el('h2', {}, 'Запитвания'), el('span', { class: 'muted' }, `${list.length} общо, ${open} необработени`)),
      list.length ? el('div', { class: 'inquiries' }, list.map(q => {
        const card = el('div', { class: 'inquiry' + (q.handled ? ' handled' : '') });
        const toggle = el('label', { class: 'checkbox' }, el('input', { type: 'checkbox', checked: !!q.handled, onchange: async e => {
          try { await api('inquiry-handled', { id: q.id, handled: e.target.checked }); q.handled = e.target.checked; card.classList.toggle('handled', q.handled); }
          catch (err) { alertBox(err.message); e.target.checked = !e.target.checked; }
        } }), 'Обработено');
        card.append(
          el('div', { class: 'inquiry-head' },
            el('strong', {}, q.name || q.email), el('span', { class: 'muted' }, new Date(q.date).toLocaleString('bg-BG')), toggle),
          el('dl', {}, Object.entries(labels).filter(([k]) => q[k]).map(([k, l]) => [
            el('dt', {}, l),
            el('dd', {}, k === 'email' ? el('a', { href: 'mailto:' + q.email }, q.email) : k === 'phone' ? el('a', { href: 'tel:' + q.phone }, q.phone) : q[k]),
          ])));
        return card;
      })) : el('p', { class: 'muted' }, 'Все още няма запитвания от новите форми.'));
  }

  async function renderTools() {
    const pass = { current: '', new: '', repeat: '' };
    const passForm = el('form', { class: 'grid card-plain', onsubmit: async e => {
      e.preventDefault();
      if (pass.new !== pass.repeat) return alertBox('Новите пароли не съвпадат.');
      try { await api('password', { current: pass.current, new: pass.new }); alertBox('Паролата е сменена.', 'ok'); e.target.reset(); }
      catch (err) { alertBox(err.message); }
    } },
      ...[['current', 'Текуща парола', 'current-password'], ['new', 'Нова парола (поне 10 символа)', 'new-password'], ['repeat', 'Повторете новата', 'new-password']].map(([k, l, ac]) =>
        el('div', { class: 'field half' }, el('label', {}, l), el('input', { type: 'password', autocomplete: ac, required: true, oninput: e => { pass[k] = e.target.value; } }))),
      el('div', { class: 'field' }, el('button', { class: 'secondary' }, 'Смени паролата')));

    const backupsBox = el('div', { class: 'list' }, el('p', { class: 'muted' }, 'Зареждане…'));
    app.replaceChildren(
      el('h2', {}, 'Предишни версии'),
      el('p', { class: 'muted' }, 'При всеки запис пазим копие на предишното съдържание (последните 40). Зареждането на стара версия не я публикува, докато не натиснете „Запази промените“.'),
      backupsBox,
      el('h2', {}, 'Смяна на парола'), passForm);
    try {
      const { backups } = await api('backups');
      backupsBox.replaceChildren(...(backups.length ? backups.map(name => {
        const m = name.match(/content-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/);
        const when = m ? `${m[3]}.${m[2]}.${m[1]} ${m[4]}:${m[5]}` : name;
        return el('div', { class: 'list-row' }, el('span', {}, 'Версия преди запис от ' + when),
          el('button', { type: 'button', class: 'ghost sm', onclick: async () => {
            if (dirty && !confirm('Имате незапазени промени. Да ги заменя ли с тази версия?')) return;
            try { content = normalize((await api('restore', { name })).content); setDirty(); alertBox('Версията е заредена. Натиснете „Запази промените“, за да я публикувате.', 'ok'); }
            catch (err) { alertBox(err.message); }
          } }, 'Зареди'));
      }) : [el('p', { class: 'muted' }, 'Още няма записани версии.')]));
    } catch (err) { backupsBox.replaceChildren(el('p', { class: 'error' }, err.message)); }
  }

  function normalize(c) {
    c = c || {};
    c.settings = c.settings || {};
    for (const k of Object.keys(SCHEMA)) if (!Array.isArray(c[k])) c[k] = [];
    if (!Array.isArray(c.settings.generalFaqs)) c.settings.generalFaqs = [];
    return c;
  }

  window.addEventListener('hashchange', () => {
    current = location.hash.slice(1) || 'inquiries';
    ui.filter = '';
    render();
    window.scrollTo(0, 0);
  });

  // ---------- boot ----------
  api('load').then(r => {
    content = normalize(r.content);
    status.textContent = r.customized ? '' : 'Показва се първоначалното съдържание на сайта';
    render();
  }).catch(err => { app.replaceChildren(el('p', { class: 'error' }, 'Неуспешно зареждане: ' + err.message)); });
})();

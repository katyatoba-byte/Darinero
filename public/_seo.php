<?php
// Server-side rendering of page text + meta tags + schema.org data, so that
// Google and AI search engines can read every page without running JavaScript.
// React replaces the rendered markup as soon as it starts in the browser.

declare(strict_types=1);
require_once __DIR__ . '/api/_lib.php';

const SITE_URL = 'https://darinero.com';

function e($s): string { return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

function abs_url(string $u): string {
    if ($u === '') return '';
    if (preg_match('#^https?://#', $u)) return $u;
    return SITE_URL . '/' . ltrim($u, '/');
}

function trim_text(string $s, int $len = 160): string {
    $s = trim(preg_replace('/\s+/u', ' ', str_replace('•', '', $s)) ?? '');
    return mb_strlen($s) > $len ? rtrim(mb_substr($s, 0, $len - 1)) . '…' : $s;
}

function by_id(array $list, string $id): ?array {
    foreach ($list as $item) if (($item['id'] ?? '') === $id) return $item;
    return null;
}

// Paragraph text with "•" bullet lines turned into a list.
function rich_text(string $text): string {
    $out = ''; $list = [];
    $flush = function () use (&$out, &$list) {
        if ($list) { $out .= '<ul>' . implode('', array_map(fn($l) => '<li>' . e($l) . '</li>', $list)) . '</ul>'; $list = []; }
    };
    foreach (preg_split('/\n+/', $text) ?: [] as $line) {
        $line = trim($line);
        if ($line === '') continue;
        if (str_starts_with($line, '•')) { $list[] = trim(mb_substr($line, 1)); continue; }
        $flush();
        $out .= '<p>' . e($line) . '</p>';
    }
    $flush();
    return $out;
}

function ul(array $items): string {
    $items = array_filter(array_map(fn($i) => is_array($i) ? trim(($i['name'] ?? '') . (empty($i['description']) ? '' : ' – ' . $i['description'])) : trim((string) $i), $items));
    return $items ? '<ul>' . implode('', array_map(fn($i) => '<li>' . e($i) . '</li>', $items)) . '</ul>' : '';
}

function organization(array $s): array {
    return array_filter([
        '@type' => 'Organization',
        '@id' => SITE_URL . '/#organization',
        'name' => 'DARINERO',
        'legalName' => 'Даринеро ООД',
        'url' => SITE_URL . '/',
        'description' => $s['siteDescription'] ?? '',
        'email' => $s['email'] ?? '',
        'telephone' => preg_replace('/\s+/', '', $s['phone'] ?? ''),
        'address' => ['@type' => 'PostalAddress', 'streetAddress' => 'ул. Котовск 12', 'addressLocality' => 'Русе', 'addressCountry' => 'BG'],
        'areaServed' => ['@type' => 'Country', 'name' => 'България'],
        'knowsAbout' => ['Корпоративни подаръци', 'Подаръчни кутии за служители', 'Коледни подаръци за фирми', 'Welcome kit за нови служители', 'Персонализация с лого'],
        'sameAs' => array_values(array_filter([$s['instagram'] ?? '', $s['facebook'] ?? '', $s['linkedin'] ?? ''])),
    ]);
}

function breadcrumbs(array $trail): array {
    $items = [];
    foreach ($trail as $i => [$name, $path]) {
        $items[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $name, 'item' => SITE_URL . $path];
    }
    return ['@type' => 'BreadcrumbList', 'itemListElement' => $items];
}

function faq_schema(array $faqs): ?array {
    $q = array_values(array_filter($faqs, fn($f) => !empty($f['question']) && !empty($f['answer'])));
    if (!$q) return null;
    return ['@type' => 'FAQPage', 'mainEntity' => array_map(fn($f) => [
        '@type' => 'Question', 'name' => $f['question'],
        'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['answer']],
    ], $q)];
}

function nav_html(): string {
    $links = ['/' => 'Начало', '/categories' => 'Каталог', '/services' => 'Услуги', '/case-studies' => 'Case Studies', '/concepts' => 'Концепции', '/about' => 'За нас', '/contact' => 'Контакт'];
    $h = '<nav aria-label="Основна навигация"><ul>';
    foreach ($links as $href => $label) $h .= '<li><a href="' . e($href) . '">' . e($label) . '</a></li>';
    return $h . '</ul></nav>';
}

function footer_html(array $s): string {
    return '<footer><p><strong>DARINERO</strong> – Даринеро ООД. Корпоративни подаръци и подаръчни кутии.</p>'
        . '<p>Адрес: ' . e($s['address'] ?? '') . ' · Имейл: <a href="mailto:' . e($s['email'] ?? '') . '">' . e($s['email'] ?? '') . '</a>'
        . ' · Телефон: <a href="tel:' . e(preg_replace('/\s+/', '', $s['phone'] ?? '')) . '">' . e($s['phone'] ?? '') . '</a></p></footer>';
}

/**
 * Returns ['status', 'title', 'description', 'canonical', 'image', 'html', 'schema' => []]
 */
function render_route(string $path, array $c): array {
    $s = $c['settings'] ?? [];
    $parts = array_values(array_filter(explode('/', trim($path, '/')), 'strlen'));
    $section = $parts[0] ?? '';
    $id = $parts[1] ?? '';
    $home = ['Начало', '/'];

    $page = [
        'status' => 200,
        'title' => $s['siteTitle'] ?? 'DARINERO',
        'description' => $s['siteDescription'] ?? '',
        'canonical' => SITE_URL . ($section === '' ? '/' : '/' . implode('/', $parts)),
        'image' => '',
        'type' => 'website',
        'html' => '',
        'schema' => [],
    ];
    $suffix = ' | DARINERO';

    switch ($section) {
        case '':
            $h = '<h1>' . e($s['siteTitle'] ?? 'DARINERO') . '</h1><p>' . e($s['siteDescription'] ?? '') . '</p>';
            $h .= '<p>Поемаме целия процес – от концепцията и подбора на продукти, през дизайна и персонализацията, до доставката.</p>';
            if (!empty($c['processSteps'])) {
                $h .= '<h2>Как работим</h2><ol>';
                foreach ($c['processSteps'] as $st) $h .= '<li><strong>' . e($st['title'] ?? '') . '</strong> – ' . e($st['description'] ?? '') . '</li>';
                $h .= '</ol>';
            }
            $h .= '<h2>Каталог</h2><ul>';
            foreach ($c['categories'] ?? [] as $cat) $h .= '<li><a href="/category/' . e($cat['id']) . '">' . e($cat['title']) . '</a> – ' . e($cat['description'] ?? '') . '</li>';
            $h .= '</ul><h2>Case Studies</h2><ul>';
            foreach ($c['caseStudies'] ?? [] as $cs) $h .= '<li><a href="/case-study/' . e($cs['id']) . '">' . e($cs['title']) . '</a> – ' . e($cs['shortSummary'] ?? '') . '</li>';
            $h .= '</ul>';
            $page['html'] = $h;
            $page['schema'][] = ['@type' => 'WebSite', '@id' => SITE_URL . '/#website', 'url' => SITE_URL . '/', 'name' => 'DARINERO', 'inLanguage' => 'bg', 'publisher' => ['@id' => SITE_URL . '/#organization']];
            break;

        case 'categories':
            $page['title'] = 'Каталог корпоративни подаръци' . $suffix;
            $page['description'] = 'Каталог с корпоративни подаръци и подаръчни кутии: ' . implode(', ', array_map(fn($x) => $x['title'], $c['categories'] ?? [])) . '.';
            $h = '<h1>Каталог корпоративни подаръци</h1><ul>';
            foreach ($c['categories'] ?? [] as $cat) $h .= '<li><h2><a href="/category/' . e($cat['id']) . '">' . e($cat['title']) . '</a></h2><p>' . e($cat['description'] ?? '') . '</p></li>';
            $page['html'] = $h . '</ul>';
            $page['schema'][] = breadcrumbs([$home, ['Каталог', '/categories']]);
            break;

        case 'category':
            $cat = by_id($c['categories'] ?? [], $id);
            if (!$cat) break;
            $products = array_values(array_filter($c['products'] ?? [], fn($p) => ($p['categoryId'] ?? '') === $id));
            $page['title'] = $cat['title'] . $suffix;
            $page['description'] = trim_text($cat['description'] ?? '') ?: $page['description'];
            $page['image'] = abs_url($cat['image'] ?? '');
            $h = '<h1>' . e($cat['title']) . '</h1><p>' . e($cat['description'] ?? '') . '</p><ul>';
            foreach ($products as $p) $h .= '<li><h2><a href="/product/' . e($p['id']) . '">' . e($p['title']) . '</a></h2><p>' . e($p['positioning'] ?? '') . '</p></li>';
            $page['html'] = $h . '</ul>';
            $page['schema'][] = breadcrumbs([$home, ['Каталог', '/categories'], [$cat['title'], '/category/' . $id]]);
            $page['schema'][] = ['@type' => 'ItemList', 'name' => $cat['title'], 'itemListElement' => array_map(fn($p, $i) => ['@type' => 'ListItem', 'position' => $i + 1, 'url' => SITE_URL . '/product/' . $p['id'], 'name' => $p['title']], $products, array_keys($products))];
            break;

        case 'product':
            $p = by_id($c['products'] ?? [], $id);
            if (!$p) break;
            $cat = by_id($c['categories'] ?? [], (string) ($p['categoryId'] ?? ''));
            $page['title'] = $p['title'] . $suffix;
            $page['description'] = trim_text(($p['positioning'] ?? '') . '. ' . ($p['description'] ?? ''));
            $page['image'] = abs_url($p['images'][0] ?? '');
            $facts = [
                'Бюджет' => $p['budget'] ?? '', 'Минимално количество' => $p['minQuantity'] ?? '', 'Срок за изработка' => $p['leadTime'] ?? '',
                'Повод' => $p['occasionType'] ?? '', 'Подходящо за' => $p['suitableFor'] ?? '', 'Персонализация' => $p['personalizationType'] ?? '',
                'Стил на кутията' => $p['boxStyle'] ?? '', 'Индивидуална доставка' => !empty($p['individualDelivery']) ? 'Да' : '',
            ];
            $h = '<h1>' . e($p['title']) . '</h1>';
            if (!empty($p['positioning'])) $h .= '<p><strong>' . e($p['positioning']) . '</strong></p>';
            $h .= rich_text((string) ($p['description'] ?? ''));
            $h .= '<h2>Основна информация</h2><dl>';
            foreach ($facts as $k => $v) if ($v !== '') $h .= '<dt>' . e($k) . '</dt><dd>' . e($v) . '</dd>';
            $h .= '</dl>';
            if (!empty($p['defaultItems'])) $h .= '<h2>Какво включва кутията</h2>' . ul($p['defaultItems']);
            if (!empty($p['optionalItems'])) $h .= '<h2>Допълнителни продукти по избор</h2>' . ul($p['optionalItems']);
            if (!empty($p['personalizationOptions'])) $h .= '<h2>Опции за персонализация</h2>' . ul($p['personalizationOptions']);
            if (!empty($p['brandingDescription'])) $h .= '<h2>Брандиране</h2>' . rich_text((string) $p['brandingDescription']);
            if (!empty($p['suitableForList'])) $h .= '<h2>Подходящо за</h2>' . ul($p['suitableForList']);
            if (!empty($p['whyChooseList'])) $h .= '<h2>Защо да изберете този подарък</h2>' . ul($p['whyChooseList']);
            if (!empty($p['technicalSpecs'])) {
                $h .= '<h2>Характеристики</h2><dl>';
                foreach ($p['technicalSpecs'] as $sp) $h .= '<dt>' . e($sp['label'] ?? '') . '</dt><dd>' . e($sp['value'] ?? '') . '</dd>';
                $h .= '</dl>';
            }
            $faqs = array_merge($p['faqs'] ?? [], $s['generalFaqs'] ?? []);
            if ($faqs) {
                $h .= '<h2>Често задавани въпроси</h2>';
                foreach ($faqs as $f) $h .= '<h3>' . e($f['question'] ?? '') . '</h3><p>' . e($f['answer'] ?? '') . '</p>';
            }
            $h .= '<p><a href="/contact">Изпратете запитване</a></p>';
            $page['html'] = $h;
            $trail = [$home, ['Каталог', '/categories']];
            if ($cat) $trail[] = [$cat['title'], '/category/' . $cat['id']];
            $trail[] = [$p['title'], '/product/' . $id];
            $page['schema'][] = breadcrumbs($trail);
            $page['schema'][] = array_filter([
                '@type' => 'Product', 'name' => $p['title'], 'description' => trim_text((string) ($p['description'] ?? ''), 500),
                'image' => array_values(array_filter(array_map('abs_url', $p['images'] ?? []))),
                'brand' => ['@type' => 'Brand', 'name' => 'DARINERO'], 'category' => $cat['title'] ?? null,
                'url' => SITE_URL . '/product/' . $id,
            ]);
            if ($fq = faq_schema($faqs)) $page['schema'][] = $fq;
            break;

        case 'case-studies':
            $page['title'] = 'Case Studies – реализирани проекти за корпоративни подаръци' . $suffix;
            $page['description'] = 'Реални проекти на DARINERO за корпоративни подаръци: ' . implode(', ', array_filter(array_map(fn($x) => $x['client'] ?? '', $c['caseStudies'] ?? []))) . '.';
            $h = '<h1>Case Studies</h1><p>Реални истории за мащабни проекти, кратки срокове и безкомпромисно качество.</p><ul>';
            foreach ($c['caseStudies'] ?? [] as $cs) $h .= '<li><h2><a href="/case-study/' . e($cs['id']) . '">' . e($cs['title']) . '</a></h2><p>' . e($cs['shortSummary'] ?? '') . '</p></li>';
            $page['html'] = $h . '</ul>';
            $page['schema'][] = breadcrumbs([$home, ['Case Studies', '/case-studies']]);
            break;

        case 'case-study':
            $cs = by_id($c['caseStudies'] ?? [], $id);
            if (!$cs) break;
            $page['title'] = $cs['title'] . $suffix;
            $page['description'] = trim_text($cs['shortSummary'] ?? '') ?: trim_text((string) ($cs['summary'] ?? ''));
            $page['image'] = abs_url($cs['image'] ?? ($cs['cardImage'] ?? ''));
            $page['type'] = 'article';
            $h = '<article><h1>' . e($cs['title']) . '</h1>';
            if (!empty($cs['subtitle'])) $h .= '<p><em>' . e($cs['subtitle']) . '</em></p>';
            $facts = ['Клиент' => $cs['client'] ?? '', 'Индустрия' => $cs['industry'] ?? '', 'Повод' => $cs['occasion'] ?? '', 'Обем' => $cs['quantity'] ?? ''];
            $h .= '<dl>';
            foreach ($facts as $k => $v) if ($v !== '') $h .= '<dt>' . e($k) . '</dt><dd>' . e($v) . '</dd>';
            $h .= '</dl>';
            $h .= '<h2>Резюме</h2>' . rich_text((string) ($cs['summary'] ?? ''));
            $h .= '<h2>Предизвикателството</h2>' . rich_text((string) ($cs['challenge'] ?? ''));
            $h .= '<h2>Нашето решение</h2>' . rich_text((string) ($cs['solution'] ?? ''));
            if (!empty($cs['results'])) $h .= '<h2>Резултати и въздействие</h2>' . ul($cs['results']);
            if (!empty($cs['services'])) $h .= '<h2>Какво направихме</h2>' . ul($cs['services']);
            if (!empty($cs['testimonial']['text'])) {
                $h .= '<blockquote><p>' . e($cs['testimonial']['text']) . '</p><footer>' . e(trim(($cs['testimonial']['author'] ?? '') . ', ' . ($cs['testimonial']['company'] ?? ''), ', ')) . '</footer></blockquote>';
            }
            $page['html'] = $h . '<p><a href="/contact">Искате подобен резултат? Изпратете запитване</a></p></article>';
            $page['schema'][] = breadcrumbs([$home, ['Case Studies', '/case-studies'], [$cs['title'], '/case-study/' . $id]]);
            $page['schema'][] = array_filter([
                '@type' => 'Article', 'headline' => mb_substr($cs['title'], 0, 110), 'description' => $page['description'],
                'image' => $page['image'] ?: null, 'inLanguage' => 'bg',
                'author' => ['@id' => SITE_URL . '/#organization'], 'publisher' => ['@id' => SITE_URL . '/#organization'],
                'mainEntityOfPage' => SITE_URL . '/case-study/' . $id,
                'about' => !empty($cs['client']) ? ['@type' => 'Organization', 'name' => $cs['client']] : null,
                'keywords' => implode(', ', array_filter(['корпоративни подаръци', $cs['occasion'] ?? '', $cs['industry'] ?? ''])),
            ]);
            break;

        case 'concepts':
            $page['title'] = 'Концепции за корпоративни подаръци' . $suffix;
            $page['description'] = 'Концепции за корпоративни подаръци: ' . implode(', ', array_map(fn($x) => $x['title'], $c['concepts'] ?? [])) . '.';
            $h = '<h1>Концепции</h1><ul>';
            foreach ($c['concepts'] ?? [] as $x) $h .= '<li><h2>' . e($x['title']) . '</h2><p>' . e($x['description'] ?? '') . '</p></li>';
            $page['html'] = $h . '</ul>';
            $page['schema'][] = breadcrumbs([$home, ['Концепции', '/concepts']]);
            break;

        case 'services':
            $page['title'] = 'Услуги – корпоративни подаръци до ключ' . $suffix;
            $page['description'] = 'Услуги на DARINERO: ' . implode(', ', array_map(fn($x) => $x['title'], $c['services'] ?? [])) . '.';
            $h = '<h1>Услуги</h1>';
            foreach ($c['services'] ?? [] as $sv) {
                $h .= '<section><h2>' . e($sv['title']) . '</h2><p>' . e($sv['description'] ?? '') . '</p><dl>';
                foreach (['Кога' => $sv['useCase'] ?? '', 'Стойност' => $sv['value'] ?? '', 'Бюджет' => $sv['budget'] ?? ''] as $k => $v) if ($v !== '') $h .= '<dt>' . e($k) . '</dt><dd>' . e($v) . '</dd>';
                $h .= '</dl></section>';
                $page['schema'][] = ['@type' => 'Service', 'name' => $sv['title'], 'description' => $sv['description'] ?? '', 'provider' => ['@id' => SITE_URL . '/#organization'], 'areaServed' => 'BG'];
            }
            $page['html'] = $h;
            $page['schema'][] = breadcrumbs([$home, ['Услуги', '/services']]);
            break;

        case 'about':
            $page['title'] = 'За нас' . $suffix;
            $page['description'] = 'DARINERO (Даринеро ООД) – партньор за корпоративни подаръци: концепция, подбор на продукти, персонализация с лого и доставка.';
            $page['html'] = '<h1>За нас</h1><p>' . e($page['description']) . '</p><p>Офис и склад: ' . e($s['address'] ?? '') . '.</p>';
            $page['schema'][] = breadcrumbs([$home, ['За нас', '/about']]);
            break;

        case 'contact':
            $page['title'] = 'Контакт – запитване за корпоративни подаръци' . $suffix;
            $page['description'] = 'Свържете се с DARINERO за корпоративни подаръци: ' . ($s['email'] ?? '') . ', ' . ($s['phone'] ?? '') . '. Отговаряме до 24 часа.';
            $page['html'] = '<h1>Контакт</h1><p>Попълнете формата и ще се свържем с вас до 24 часа.</p><ul><li>Имейл: <a href="mailto:' . e($s['email'] ?? '') . '">' . e($s['email'] ?? '') . '</a></li><li>Телефон: ' . e($s['phone'] ?? '') . '</li><li>Адрес: ' . e($s['address'] ?? '') . '</li></ul>';
            $page['schema'][] = breadcrumbs([$home, ['Контакт', '/contact']]);
            $page['schema'][] = ['@type' => 'ContactPage', 'url' => SITE_URL . '/contact', 'about' => ['@id' => SITE_URL . '/#organization']];
            break;
    }

    if ($page['html'] === '') {
        $page['status'] = 404;
        $page['title'] = 'Страницата не е намерена' . $suffix;
        $page['html'] = '<h1>Страницата не е намерена</h1><p><a href="/">Към началната страница</a></p>';
        $page['schema'] = [];
    }
    array_unshift($page['schema'], organization($s));
    $page['html'] = nav_html() . '<main>' . $page['html'] . '</main>' . footer_html($s);
    return $page;
}

function site_urls(array $c): array {
    $urls = ['/', '/categories', '/services', '/case-studies', '/concepts', '/about', '/contact'];
    foreach ($c['categories'] ?? [] as $x) $urls[] = '/category/' . $x['id'];
    foreach ($c['products'] ?? [] as $x) $urls[] = '/product/' . $x['id'];
    foreach ($c['caseStudies'] ?? [] as $x) $urls[] = '/case-study/' . $x['id'];
    return $urls;
}

<?php
// /sitemap.xml and /llms.txt (rewritten here by .htaccess)
require __DIR__ . '/_seo.php';

$content = load_content();
$s = $content['settings'] ?? [];
$type = $_GET['type'] ?? '';
$mtime = @filemtime(DATA_DIR . '/content.json') ?: @filemtime(DEFAULT_CONTENT) ?: time();

if ($type === 'sitemap') {
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach (site_urls($content) as $u) {
        echo '  <url><loc>' . e(SITE_URL . $u) . '</loc><lastmod>' . date('Y-m-d', $mtime) . '</lastmod></url>' . "\n";
    }
    echo '</urlset>' . "\n";
    exit;
}

if ($type === 'llms') {
    header('Content-Type: text/plain; charset=utf-8');
    $out = "# DARINERO – корпоративни подаръци\n\n";
    $out .= '> ' . ($s['siteDescription'] ?? '') . "\n\n";
    $out .= "DARINERO (Даринеро ООД) е партньор за корпоративни подаръци в България: концепция, подбор на продукти, персонализация с лого, опаковане и доставка до ключ. Офис и склад: " . ($s['address'] ?? '') . ". Контакт: " . ($s['email'] ?? '') . ", " . ($s['phone'] ?? '') . ".\n\n";
    $out .= "## Основни страници\n\n";
    foreach (['/katalozi' => 'Каталози (PDF) с корпоративни подаръци', '/categories' => 'Продукти', '/services' => 'Услуги', '/case-studies' => 'Case Studies – реализирани проекти', '/concepts' => 'Концепции', '/contact' => 'Контакт и запитване'] as $u => $l) {
        $out .= "- [$l](" . SITE_URL . "$u)\n";
    }
    foreach ($content['themePages'] ?? [] as $tp) {
        if (!empty($tp['hidden']) || empty($tp['id'])) continue;
        $out .= '- [' . ($tp['seoTitle'] ?? $tp['name'] ?? $tp['id']) . '](' . SITE_URL . '/' . $tp['id'] . '): ' . trim_text((string) ($tp['metaDescription'] ?? ''), 240) . "\n";
    }
    $out .= "\n## Каталог\n\n";
    foreach ($content['categories'] ?? [] as $cat) {
        $out .= '- [' . $cat['title'] . '](' . SITE_URL . '/category/' . $cat['id'] . '): ' . trim_text($cat['description'] ?? '', 200) . "\n";
    }
    $out .= "\n## Продукти\n\n";
    foreach ($content['products'] ?? [] as $p) {
        $bits = array_filter([$p['positioning'] ?? '', !empty($p['budget']) ? 'Бюджет: ' . $p['budget'] : '', !empty($p['minQuantity']) ? 'Минимум: ' . $p['minQuantity'] : '']);
        $out .= '- [' . $p['title'] . '](' . SITE_URL . '/product/' . $p['id'] . '): ' . trim_text(implode('. ', $bits), 240) . "\n";
    }
    $out .= "\n## Case Studies\n\n";
    foreach ($content['caseStudies'] ?? [] as $cs) {
        $out .= '- [' . $cs['title'] . '](' . SITE_URL . '/case-study/' . $cs['id'] . '): ' . trim_text($cs['shortSummary'] ?? '', 240) . "\n";
    }
    $faqs = $s['generalFaqs'] ?? [];
    if ($faqs) {
        $out .= "\n## Често задавани въпроси\n\n";
        foreach ($faqs as $f) $out .= '- **' . ($f['question'] ?? '') . '** ' . ($f['answer'] ?? '') . "\n";
    }
    echo $out;
    exit;
}

http_response_code(404);

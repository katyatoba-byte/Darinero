<?php
// Front controller: serves the React app with server-rendered text and meta tags.
require __DIR__ . '/_seo.php';

$template = @file_get_contents(__DIR__ . '/index.html');
if ($template === false) {
    http_response_code(500);
    exit('Site template missing.');
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = rawurldecode($path);
if ($path === '/index.php' || $path === '/index.html') {
    header('Location: /', true, 301);
    exit;
}
// One canonical form: no trailing slash.
if ($path !== '/' && str_ends_with($path, '/')) {
    header('Location: ' . rtrim($path, '/'), true, 301);
    exit;
}

$content = load_content();
$page = render_route($path, $content);
http_response_code($page['status']);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

$image = $page['image'] ?: '';
$head = '<title>' . e($page['title']) . '</title>'
    . '<meta name="description" content="' . e($page['description']) . '">'
    . ($page['status'] === 404 ? '<meta name="robots" content="noindex">' : '<link rel="canonical" href="' . e($page['canonical']) . '">')
    . '<meta property="og:type" content="' . e($page['type']) . '">'
    . '<meta property="og:site_name" content="DARINERO">'
    . '<meta property="og:locale" content="bg_BG">'
    . '<meta property="og:title" content="' . e($page['title']) . '">'
    . '<meta property="og:description" content="' . e($page['description']) . '">'
    . '<meta property="og:url" content="' . e($page['canonical']) . '">'
    . ($image ? '<meta property="og:image" content="' . e($image) . '">' : '')
    . '<meta name="twitter:card" content="' . ($image ? 'summary_large_image' : 'summary') . '">'
    . '<script type="application/ld+json">' . json_encode(['@context' => 'https://schema.org', '@graph' => $page['schema']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>'
    . '<script>window.__DARINERO_CONTENT__=' . json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) . ';</script>'
    . '<style>.ssr{max-width:72rem;margin:0 auto;padding:8rem 1.5rem 4rem;line-height:1.6}.ssr nav ul{display:flex;flex-wrap:wrap;gap:1rem;list-style:none;padding:0}.ssr h1{font-size:2.5rem;margin:1rem 0}.ssr h2{font-size:1.5rem;margin:2rem 0 .75rem}.ssr dt{font-weight:600}.ssr dd{margin:0 0 .5rem}.ssr img{max-width:100%;height:auto}</style>';

// Replace the static <title>/description/OG tags from index.html with page-specific ones.
$html = preg_replace('#<title>.*?</title>#s', '', $template);
$html = preg_replace('#<meta (name="description"|property="og:[a-z_]+"|name="twitter:[a-z]+")[^>]*>\s*#', '', $html);
$html = preg_replace('#<link rel="canonical"[^>]*>\s*#', '', $html);
$html = str_replace('</head>', $head . '</head>', $html);
$html = str_replace('<div id="root"></div>', '<div id="root"><div class="ssr">' . $page['html'] . '</div></div>', $html);

echo $html;

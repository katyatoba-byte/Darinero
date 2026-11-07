<?php
// Catalogue download form: records the download, adds the contact to Mailchimp
// (only with consent) and returns the PDF link so the browser can download it at once.
require __DIR__ . '/_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    json_response(['ok' => false, 'error' => 'Невалидна заявка.'], 400);
}

$content = load_content();
$catalogId = clean_text($input['catalogId'] ?? '', 80);
$catalog = null;
foreach ($content['catalogs'] ?? [] as $c) {
    if (($c['id'] ?? '') === $catalogId && ($c['status'] ?? 'active') !== 'archived') { $catalog = $c; break; }
}
if (!$catalog || empty($catalog['pdf'])) {
    json_response(['ok' => false, 'error' => 'Каталогът не е наличен.'], 404);
}

// Honeypot: answer like a success, store nothing.
if (!empty($input['website'])) {
    json_response(['ok' => true, 'pdf' => $catalog['pdf']]);
}

$data = [
    'name'    => clean_text($input['name'] ?? '', 120),
    'company' => clean_text($input['company'] ?? '', 160),
    'email'   => clean_text($input['email'] ?? '', 160),
    'consent' => !empty($input['consent']),
    'repeat'  => !empty($input['repeat']),
    'page'    => clean_text($input['page'] ?? '', 200),
    'utm_source'   => clean_text($input['utm_source'] ?? '', 100),
    'utm_medium'   => clean_text($input['utm_medium'] ?? '', 100),
    'utm_campaign' => clean_text($input['utm_campaign'] ?? '', 100),
];

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Моля, въведете валиден имейл адрес.'], 422);
}
if (!$data['repeat'] && ($data['name'] === '' || $data['company'] === '')) {
    json_response(['ok' => false, 'error' => 'Моля, попълнете име и фирма.'], 422);
}
if (!rate_limit('catalog', 20, 600)) {
    json_response(['ok' => false, 'error' => 'Твърде много заявки за кратко време. Моля, опитайте след малко.'], 429);
}

ensure_data_dirs();

$tags = [$catalog['mailchimpTag'] ?? '', 'povod-' . ($catalog['occasion'] ?? ''), 'izt-site'];
// A returning visitor (form skipped) gets the new tag only if they are already a contact.
$status = $data['consent']
    ? mailchimp_sync($data['email'], $data['name'], $data['company'], $tags, true)
    : ($data['repeat'] ? mailchimp_sync($data['email'], '', '', $tags, false) : 'no-consent');

append_json_list(DATA_DIR . '/downloads.json', [
    'id' => bin2hex(random_bytes(6)),
    'date' => date('c'),
    'catalogId' => $catalog['id'],
    'catalog' => $catalog['title'] ?? $catalog['id'],
    'tags' => array_values(array_filter($tags, fn($t) => $t !== '' && $t !== 'povod-')),
    'mailchimp' => $status,
    'ip' => client_ip(),
] + $data);

json_response(['ok' => true, 'pdf' => $catalog['pdf']]);

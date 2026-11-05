<?php
// Receives inquiries from the site forms: e-mails them and stores them for /admin.
require __DIR__ . '/_lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($input)) {
    json_response(['ok' => false, 'error' => 'Невалидна заявка.'], 400);
}

// Honeypot: bots fill every field. Pretend success, store nothing.
if (!empty($input['website'])) {
    json_response(['ok' => true]);
}

$fields = [
    'source'        => ['Източник', 80],
    'name'          => ['Име', 120],
    'company'       => ['Компания', 160],
    'email'         => ['Имейл', 160],
    'phone'         => ['Телефон', 40],
    'employees'     => ['Брой служители', 40],
    'occasion'      => ['Повод', 160],
    'budget'        => ['Бюджет', 120],
    'product'       => ['Продукт', 200],
    'configuration' => ['Конфигурация', 2000],
    'message'       => ['Съобщение', 5000],
    'page'          => ['Страница', 200],
];
$data = [];
foreach ($fields as $key => [, $max]) {
    $data[$key] = clean_text($input[$key] ?? '', $max);
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Моля, въведете валиден имейл адрес.'], 422);
}

if (!rate_limit('inquiry', 6, 600)) {
    json_response(['ok' => false, 'error' => 'Изпратихте няколко запитвания за кратко време. Моля, опитайте след малко.'], 429);
}

ensure_data_dirs();

$record = ['id' => bin2hex(random_bytes(6)), 'date' => date('c'), 'ip' => client_ip(), 'handled' => false] + $data;

// Store first, so nothing is lost even if e-mail delivery fails.
$file = DATA_DIR . '/inquiries.json';
$fh = fopen($file, 'c+');
if ($fh) {
    flock($fh, LOCK_EX);
    $list = json_decode(stream_get_contents($fh) ?: '[]', true) ?: [];
    array_unshift($list, $record);
    $list = array_slice($list, 0, 3000);
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    flock($fh, LOCK_UN);
    fclose($fh);
    @chmod($file, 0640);
}

// E-mail
$content = load_content();
$to = $content['settings']['inquiryEmail'] ?? '';
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    $to = 'office@darinero.com';
}

$subjectParts = array_filter([$data['source'] ?: 'Запитване', $data['company'] ?: $data['name'], $data['product']]);
$subject = 'Ново запитване от darinero.com – ' . implode(' / ', $subjectParts);

$lines = [];
foreach ($fields as $key => [$label]) {
    if ($data[$key] !== '') {
        $lines[] = $label . ': ' . $data[$key];
    }
}
$body = "Получено ново запитване от сайта:\n\n" . implode("\n", $lines)
      . "\n\nДата: " . date('d.m.Y H:i')
      . "\n\nМожете да отговорите директно на този имейл – отговорът ще отиде при клиента."
      . "\nВсички запитвания: https://darinero.com/admin/";

$host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'darinero.com');
if (!preg_match('/^[a-z0-9.-]+$/i', $host)) $host = 'darinero.com';
$headers = [
    'From: =?UTF-8?B?' . base64_encode('Сайт DARINERO') . '?= <noreply@' . $host . '>',
    'Reply-To: ' . $data['email'],
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];
$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f noreply@' . $host);

if (!$sent) {
    error_log('DARINERO inquiry mail() failed for ' . $record['id']);
}

json_response(['ok' => true]);

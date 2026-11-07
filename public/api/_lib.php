<?php
// Shared helpers for the DARINERO site API and admin panel.
// All data lives OUTSIDE public_html so a redeploy never wipes it:
//   /home/<user>/darinero-data/
//     content.json       – site content edited from /admin
//     inquiries.json     – submitted inquiries
//     admin.json         – admin password hash
//     uploads/           – images uploaded from /admin
//     backups/           – previous versions of content.json

declare(strict_types=1);

date_default_timezone_set('Europe/Sofia');

define('DATA_DIR', dirname(__DIR__, 2) . '/darinero-data');
define('UPLOAD_DIR', DATA_DIR . '/uploads');
define('BACKUP_DIR', DATA_DIR . '/backups');
define('DEFAULT_CONTENT', __DIR__ . '/default-content.json');

function ensure_data_dirs(): void {
    foreach ([DATA_DIR, UPLOAD_DIR, BACKUP_DIR] as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0750, true);
        }
    }
    $deny = DATA_DIR . '/.htaccess';
    if (!is_file($deny)) {
        @file_put_contents($deny, "Require all denied\n");
    }
}

function json_response($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_file(string $path, $fallback = null) {
    if (!is_file($path)) return $fallback;
    $raw = file_get_contents($path);
    if ($raw === false) return $fallback;
    $data = json_decode($raw, true);
    return $data === null ? $fallback : $data;
}

function write_json_file(string $path, $data): bool {
    $tmp = $path . '.tmp-' . bin2hex(random_bytes(4));
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) return false;
    if (file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    chmod($tmp, 0640);
    return rename($tmp, $path);
}

function load_content(): array {
    $defaults = read_json_file(DEFAULT_CONTENT, []);
    $content = read_json_file(DATA_DIR . '/content.json');
    if (!is_array($content)) return $defaults;
    // Sections added after the content was first saved (e.g. catalogs) come from the defaults.
    foreach ($defaults as $key => $value) {
        if (!array_key_exists($key, $content)) $content[$key] = $value;
    }
    if (isset($defaults['settings']) && is_array($content['settings'] ?? null)) {
        $content['settings'] += $defaults['settings'];
    }
    return $content;
}

// Appends a record to a JSON list file (newest first), safely under a lock.
function append_json_list(string $file, array $record, int $max = 5000): void {
    $fh = fopen($file, 'c+');
    if (!$fh) return;
    flock($fh, LOCK_EX);
    $list = json_decode(stream_get_contents($fh) ?: '[]', true) ?: [];
    array_unshift($list, $record);
    $list = array_slice($list, 0, $max);
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    flock($fh, LOCK_UN);
    fclose($fh);
    @chmod($file, 0640);
}

// ---------- Mailchimp (settings live in darinero-data/mailchimp.json, never in public content) ----------

function mailchimp_config(): ?array {
    $cfg = read_json_file(DATA_DIR . '/mailchimp.json');
    if (!is_array($cfg) || empty($cfg['apiKey']) || empty($cfg['listId'])) return null;
    if (!preg_match('/-([a-z]+[0-9]+)$/', (string) $cfg['apiKey'], $m)) return null;
    $cfg['dc'] = $m[1];
    return $cfg;
}

function mailchimp_request(array $cfg, string $method, string $path, ?array $body = null): array {
    if (!function_exists('curl_init')) return ['code' => 0, 'data' => ['detail' => 'PHP curl is not available']];
    $ch = curl_init('https://' . $cfg['dc'] . '.api.mailchimp.com/3.0' . $path);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_USERPWD => 'darinero:' . $cfg['apiKey'],
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE));
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'data' => is_string($raw) ? (json_decode($raw, true) ?: []) : []];
}

/**
 * Adds/updates a subscriber (only when $subscribe is true) and adds tags.
 * When $subscribe is false, tags are added only if the contact already exists.
 * Returns 'sent', 'skipped' (no config / not a contact) or 'error'.
 */
function mailchimp_sync(string $email, string $name, string $company, array $tags, bool $subscribe): string {
    $cfg = mailchimp_config();
    if (!$cfg) return 'skipped';
    $hash = md5(strtolower(trim($email)));
    $base = '/lists/' . rawurlencode((string) $cfg['listId']) . '/members/' . $hash;
    if ($subscribe) {
        $r = mailchimp_request($cfg, 'PUT', $base, [
            'email_address' => $email,
            'status_if_new' => 'subscribed',
            'merge_fields' => array_filter(['FNAME' => $name, 'COMPANY' => $company], 'strlen'),
        ]);
        if ($r['code'] === 400 && str_contains(json_encode($r['data']), 'merge')) {
            // The audience has no COMPANY field – retry with the name only.
            $r = mailchimp_request($cfg, 'PUT', $base, ['email_address' => $email, 'status_if_new' => 'subscribed', 'merge_fields' => array_filter(['FNAME' => $name], 'strlen')]);
        }
        if ($r['code'] < 200 || $r['code'] >= 300) return 'error';
    } else {
        $r = mailchimp_request($cfg, 'GET', $base . '?fields=id');
        if ($r['code'] === 404) return 'skipped';
        if ($r['code'] < 200 || $r['code'] >= 300) return 'error';
    }
    $tags = array_values(array_unique(array_filter(array_map(fn($t) => mb_substr(trim((string) $t), 0, 100), $tags), 'strlen')));
    if ($tags) {
        $r = mailchimp_request($cfg, 'POST', $base . '/tags', ['tags' => array_map(fn($t) => ['name' => $t, 'status' => 'active'], $tags)]);
        if ($r['code'] < 200 || $r['code'] >= 300) return 'error';
    }
    return 'sent';
}

function send_plain_mail(string $to, string $subject, string $body, string $replyTo = ''): bool {
    $host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'darinero.com');
    if (!preg_match('/^[a-z0-9.-]+$/i', (string) $host)) $host = 'darinero.com';
    $headers = [
        'From: =?UTF-8?B?' . base64_encode('DARINERO') . '?= <noreply@' . $host . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    if ($replyTo !== '') $headers[] = 'Reply-To: ' . $replyTo;
    return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f noreply@' . $host);
}

function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

// Simple file-based rate limiter. Returns true when the action is allowed.
function rate_limit(string $bucket, int $max, int $windowSeconds): bool {
    ensure_data_dirs();
    $file = DATA_DIR . '/ratelimit-' . preg_replace('/[^a-z0-9_-]/i', '', $bucket) . '.json';
    $fh = fopen($file, 'c+');
    if (!$fh) return true;
    flock($fh, LOCK_EX);
    $data = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
    $now = time();
    $ip = client_ip();
    foreach ($data as $k => $times) {
        $data[$k] = array_values(array_filter($times, fn($t) => $t > $now - $windowSeconds));
        if (!$data[$k]) unset($data[$k]);
    }
    $allowed = count($data[$ip] ?? []) < $max;
    if ($allowed) $data[$ip][] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($data));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $allowed;
}

function clean_text($value, int $maxLen): string {
    $s = is_scalar($value) ? (string) $value : '';
    $s = str_replace(["\r\n", "\r"], "\n", $s);
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr(trim($s), 0, $maxLen);
}

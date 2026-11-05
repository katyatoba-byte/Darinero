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
    $content = read_json_file(DATA_DIR . '/content.json');
    if (is_array($content)) return $content;
    return read_json_file(DEFAULT_CONTENT, []);
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

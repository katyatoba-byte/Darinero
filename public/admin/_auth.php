<?php
require __DIR__ . '/../api/_lib.php';

define('ADMIN_FILE', DATA_DIR . '/admin.json');
define('SETUP_CODE_FILE', DATA_DIR . '/setup-code.txt');

session_name('darinero_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/admin/',
    'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');

const SESSION_TTL = 8 * 3600;

function admin_config(): ?array {
    $cfg = read_json_file(ADMIN_FILE);
    return is_array($cfg) && !empty($cfg['hash']) ? $cfg : null;
}

function is_logged_in(): bool {
    if (empty($_SESSION['admin']) || empty($_SESSION['at'])) return false;
    if (time() - $_SESSION['at'] > SESSION_TTL) {
        $_SESSION = [];
        return false;
    }
    $_SESSION['at'] = time();
    return true;
}

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(24));
    }
    return $_SESSION['csrf'];
}

function check_csrf(string $token): bool {
    return !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $token);
}

function login_locked(): bool {
    $attempts = read_json_file(DATA_DIR . '/login-attempts.json', []);
    $mine = array_filter($attempts[client_ip()] ?? [], fn($t) => $t > time() - 900);
    return count($mine) >= 6;
}

function record_failed_login(): void {
    ensure_data_dirs();
    $file = DATA_DIR . '/login-attempts.json';
    $attempts = read_json_file($file, []);
    foreach ($attempts as $ip => $times) {
        $attempts[$ip] = array_values(array_filter($times, fn($t) => $t > time() - 900));
        if (!$attempts[$ip]) unset($attempts[$ip]);
    }
    $attempts[client_ip()][] = time();
    write_json_file($file, $attempts);
}

function clear_failed_logins(): void {
    $file = DATA_DIR . '/login-attempts.json';
    $attempts = read_json_file($file, []);
    unset($attempts[client_ip()]);
    write_json_file($file, $attempts);
}

function valid_new_password(string $p): ?string {
    if (mb_strlen($p) < 10) return 'Паролата трябва да е поне 10 символа.';
    return null;
}

<?php
// Serves images uploaded from the admin panel (stored outside public_html).
require __DIR__ . '/_lib.php';

$name = $_GET['f'] ?? '';
if (!preg_match('/^[a-f0-9]{16,40}\.(jpg|png|webp|gif)$/', $name)) {
    http_response_code(404);
    exit;
}
$path = UPLOAD_DIR . '/' . $name;
if (!is_file($path)) {
    http_response_code(404);
    exit;
}
$types = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif'];
$ext = pathinfo($name, PATHINFO_EXTENSION);
header('Content-Type: ' . $types[$ext]);
header('Content-Length: ' . filesize($path));
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
readfile($path);

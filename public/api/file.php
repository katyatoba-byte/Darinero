<?php
// Serves PDF catalogues uploaded from the admin panel (stored outside public_html).
require __DIR__ . '/_lib.php';

$name = $_GET['f'] ?? '';
if (!preg_match('/^[a-z0-9-]{1,80}-[a-f0-9]{8}\.pdf$/', $name)) {
    http_response_code(404);
    exit;
}
$path = UPLOAD_DIR . '/' . $name;
if (!is_file($path)) {
    http_response_code(404);
    exit;
}
header('Content-Type: application/pdf');
header('Content-Length: ' . filesize($path));
header('Content-Disposition: inline; filename="' . $name . '"');
header('Cache-Control: public, max-age=3600');
header('X-Content-Type-Options: nosniff');
readfile($path);

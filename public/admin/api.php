<?php
require __DIR__ . '/_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}
if (!is_logged_in()) {
    json_response(['ok' => false, 'error' => 'Сесията е изтекла. Влезте отново.', 'relogin' => true], 401);
}
if (!check_csrf($_SERVER['HTTP_X_CSRF'] ?? '')) {
    json_response(['ok' => false, 'error' => 'Невалиден токен. Презаредете страницата.'], 403);
}

ensure_data_dirs();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'load':
        json_response(['ok' => true, 'content' => load_content(), 'customized' => is_file(DATA_DIR . '/content.json')]);

    case 'save':
        $input = json_decode(file_get_contents('php://input') ?: '', true);
        $content = $input['content'] ?? null;
        $required = ['settings', 'categories', 'products', 'concepts', 'services', 'processSteps', 'caseStudies'];
        if (!is_array($content)) json_response(['ok' => false, 'error' => 'Невалидно съдържание.'], 400);
        foreach ($required as $key) {
            if (!array_key_exists($key, $content)) json_response(['ok' => false, 'error' => "Липсва раздел: $key"], 400);
        }
        // Keep a backup of the previous version.
        $current = DATA_DIR . '/content.json';
        if (is_file($current)) {
            copy($current, BACKUP_DIR . '/content-' . date('Ymd-His') . '.json');
            $backups = glob(BACKUP_DIR . '/content-*.json') ?: [];
            sort($backups);
            foreach (array_slice($backups, 0, max(0, count($backups) - 40)) as $old) @unlink($old);
        }
        if (!write_json_file($current, $content)) json_response(['ok' => false, 'error' => 'Неуспешен запис на сървъра.'], 500);
        json_response(['ok' => true, 'savedAt' => date('H:i:s')]);

    case 'upload':
        $f = $_FILES['file'] ?? null;
        if (!$f || $f['error'] !== UPLOAD_ERR_OK) json_response(['ok' => false, 'error' => 'Файлът не беше качен.'], 400);
        if ($f['size'] > 10 * 1024 * 1024) json_response(['ok' => false, 'error' => 'Файлът е над 10 MB.'], 400);
        $info = @getimagesize($f['tmp_name']);
        $map = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'];
        if (!$info || !isset($map[$info[2]])) json_response(['ok' => false, 'error' => 'Позволени са само JPG, PNG, WEBP и GIF.'], 400);
        $ext = $map[$info[2]];
        $name = bin2hex(random_bytes(12)) . '.' . $ext;
        $dest = UPLOAD_DIR . '/' . $name;
        $resized = false;
        // Shrink very large photos to keep the site fast (needs GD).
        if (in_array($ext, ['jpg', 'png', 'webp'], true) && $info[0] > 2000 && function_exists('imagecreatetruecolor')) {
            $src = $ext === 'jpg' ? @imagecreatefromjpeg($f['tmp_name']) : ($ext === 'png' ? @imagecreatefrompng($f['tmp_name']) : @imagecreatefromwebp($f['tmp_name']));
            if ($src) {
                $w = 2000; $h = (int) round($info[1] * 2000 / $info[0]);
                $dst = imagecreatetruecolor($w, $h);
                if ($ext !== 'jpg') { imagealphablending($dst, false); imagesavealpha($dst, true); }
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $info[0], $info[1]);
                $resized = $ext === 'jpg' ? imagejpeg($dst, $dest, 85) : ($ext === 'png' ? imagepng($dst, $dest, 8) : imagewebp($dst, $dest, 85));
            }
        }
        if (!$resized && !move_uploaded_file($f['tmp_name'], $dest)) json_response(['ok' => false, 'error' => 'Неуспешен запис на файла.'], 500);
        @chmod($dest, 0640);
        json_response(['ok' => true, 'url' => '/api/img.php?f=' . $name]);

    case 'inquiries':
        json_response(['ok' => true, 'inquiries' => read_json_file(DATA_DIR . '/inquiries.json', [])]);

    case 'inquiry-handled':
        $input = json_decode(file_get_contents('php://input') ?: '', true);
        $id = (string) ($input['id'] ?? '');
        $file = DATA_DIR . '/inquiries.json';
        $list = read_json_file($file, []);
        foreach ($list as &$item) {
            if (($item['id'] ?? '') === $id) $item['handled'] = !empty($input['handled']);
        }
        unset($item);
        write_json_file($file, $list);
        json_response(['ok' => true]);

    case 'backups':
        $files = glob(BACKUP_DIR . '/content-*.json') ?: [];
        rsort($files);
        json_response(['ok' => true, 'backups' => array_map('basename', array_slice($files, 0, 40))]);

    case 'restore':
        $input = json_decode(file_get_contents('php://input') ?: '', true);
        $name = (string) ($input['name'] ?? '');
        if (!preg_match('/^content-\d{8}-\d{6}\.json$/', $name) || !is_file(BACKUP_DIR . '/' . $name)) {
            json_response(['ok' => false, 'error' => 'Няма такава версия.'], 404);
        }
        $data = read_json_file(BACKUP_DIR . '/' . $name);
        if (!is_array($data)) json_response(['ok' => false, 'error' => 'Повреден файл.'], 500);
        json_response(['ok' => true, 'content' => $data]);

    case 'password':
        $input = json_decode(file_get_contents('php://input') ?: '', true);
        $cfg = admin_config();
        if (!$cfg || !password_verify((string) ($input['current'] ?? ''), $cfg['hash'])) {
            json_response(['ok' => false, 'error' => 'Текущата парола е грешна.'], 400);
        }
        $new = (string) ($input['new'] ?? '');
        if ($err = valid_new_password($new)) json_response(['ok' => false, 'error' => $err], 400);
        write_json_file(ADMIN_FILE, ['hash' => password_hash($new, PASSWORD_DEFAULT), 'updated' => date('c')]);
        json_response(['ok' => true]);

    default:
        json_response(['ok' => false, 'error' => 'Unknown action'], 400);
}

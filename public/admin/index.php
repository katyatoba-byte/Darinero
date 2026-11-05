<?php
require __DIR__ . '/_auth.php';

$error = '';
$cfg = admin_config();
$setupMode = $cfg === null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $do = $_POST['do'] ?? '';
    if (!check_csrf($_POST['csrf'] ?? '')) {
        $error = 'Сесията изтече. Опитайте отново.';
    } elseif ($do === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: /admin/');
        exit;
    } elseif (login_locked()) {
        $error = 'Твърде много неуспешни опити. Опитайте отново след 15 минути.';
    } elseif ($do === 'setup' && $setupMode) {
        $code = trim((string) ($_POST['code'] ?? ''));
        $expected = is_file(SETUP_CODE_FILE) ? trim((string) file_get_contents(SETUP_CODE_FILE)) : '';
        $pass = (string) ($_POST['password'] ?? '');
        if ($expected === '' || !hash_equals($expected, $code)) {
            record_failed_login();
            $error = 'Грешен код за активиране.';
        } elseif ($pass !== (string) ($_POST['password2'] ?? '')) {
            $error = 'Паролите не съвпадат.';
        } elseif ($err = valid_new_password($pass)) {
            $error = $err;
        } else {
            ensure_data_dirs();
            write_json_file(ADMIN_FILE, ['hash' => password_hash($pass, PASSWORD_DEFAULT), 'created' => date('c')]);
            @unlink(SETUP_CODE_FILE);
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            $_SESSION['at'] = time();
            header('Location: /admin/');
            exit;
        }
    } elseif ($do === 'login' && !$setupMode) {
        if (password_verify((string) ($_POST['password'] ?? ''), $cfg['hash'])) {
            clear_failed_logins();
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            $_SESSION['at'] = time();
            header('Location: /admin/');
            exit;
        }
        record_failed_login();
        usleep(600000);
        $error = 'Грешна парола.';
    }
}

$csrf = csrf_token();
$logged = is_logged_in();
$h = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="bg">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Админ панел | DARINERO</title>
<link rel="stylesheet" href="/admin/admin.css">
</head>
<body>
<?php if (!$logged): ?>
  <main class="login">
    <form method="post" class="card">
      <h1>DARINERO<span>.</span></h1>
      <p class="muted"><?= $setupMode ? 'Първоначално активиране на админ панела' : 'Вход в админ панела' ?></p>
      <?php if ($error): ?><p class="error"><?= $h($error) ?></p><?php endif; ?>
      <input type="hidden" name="csrf" value="<?= $h($csrf) ?>">
      <?php if ($setupMode): ?>
        <input type="hidden" name="do" value="setup">
        <label>Код за активиране<input name="code" required autocomplete="off"></label>
        <label>Нова парола (поне 10 символа)<input type="password" name="password" required minlength="10" autocomplete="new-password"></label>
        <label>Повторете паролата<input type="password" name="password2" required minlength="10" autocomplete="new-password"></label>
        <button class="primary">Активирай</button>
      <?php else: ?>
        <input type="hidden" name="do" value="login">
        <label>Парола<input type="password" name="password" required autofocus autocomplete="current-password"></label>
        <button class="primary">Вход</button>
      <?php endif; ?>
    </form>
  </main>
<?php else: ?>
  <header class="top">
    <a class="brand" href="/" target="_blank" rel="noopener">DARINERO<span>.</span> <small>админ</small></a>
    <nav id="tabs"></nav>
    <div class="top-actions">
      <span id="status" class="muted"></span>
      <button id="saveBtn" class="primary" disabled>Запази промените</button>
      <form method="post" class="inline">
        <input type="hidden" name="csrf" value="<?= $h($csrf) ?>">
        <input type="hidden" name="do" value="logout">
        <button class="ghost">Изход</button>
      </form>
    </div>
  </header>
  <main id="app" class="app"><p class="muted">Зареждане…</p></main>
  <script>window.CSRF = <?= json_encode($csrf) ?>;</script>
  <script src="/admin/admin.js?v=1"></script>
<?php endif; ?>
</body>
</html>

<?php
// admin.php - Upgraded Admin Panel
session_start();
require_once 'db.php';

// Ensure uploads directory exists
if (!file_exists('uploads')) {
    mkdir('uploads', 0755, true);
}

// Helper: Handle Image Upload
function handleUpload($fileField) {
    if (isset($_FILES[$fileField]) && $_FILES[$fileField]['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES[$fileField]['name'], PATHINFO_EXTENSION);
        $filename = uniqid('img_') . '.' . $ext;
        $target = 'uploads/' . $filename;
        if (move_uploaded_file($_FILES[$fileField]['tmp_name'], $target)) {
            return $target;
        }
    }
    return null;
}

// Authentication
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        header('Location: admin.php');
        exit;
    } else {
        $error = "Невалидно потребителско име или парола!";
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

if (!isset($_SESSION['user_id'])) {
    ?>
    <!DOCTYPE html>
    <html lang="bg">
    <head>
        <meta charset="UTF-8">
        <title>Admin Login | Premium Boxes</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            :root { --navy: #1A2238; --copper: #D4AF37; }
            body { background-color: var(--navy); }
        </style>
    </head>
    <body class="h-screen flex items-center justify-center p-6">
        <div class="bg-white p-10 rounded-sm shadow-2xl w-full max-w-md">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-serif font-bold tracking-tighter text-[#1A2238]">PREMIUM <span class="text-[#D4AF37] italic">ADMIN</span></h1>
            </div>
            <?php if (isset($error)): ?>
                <div class="bg-red-50 text-red-600 p-4 mb-6 text-sm border-l-4 border-red-500"><?= $error ?></div>
            <?php endif; ?>
            <form method="POST" class="space-y-6">
                <div>
                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Потребител</label>
                    <input type="text" name="username" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37] transition-colors" required>
                </div>
                <div>
                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Парола</label>
                    <input type="password" name="password" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37] transition-colors" required>
                </div>
                <button type="submit" name="login" class="w-full bg-[#1A2238] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-colors">Влез в системата</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Access Control
$isAdmin = ($_SESSION['role'] === 'admin');

// Handle Actions
$action = $_GET['action'] ?? 'dashboard';
$msg = $_GET['msg'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Categories CRUD
    if (isset($_POST['save_category'])) {
        $id = $_POST['id'];
        $title = $_POST['title'];
        $desc = $_POST['description'];
        $meta_t = $_POST['meta_title'];
        $meta_d = $_POST['meta_description'];
        
        $image = handleUpload('image_file') ?: $_POST['existing_image'];

        $stmt = $pdo->prepare("REPLACE INTO categories (id, title, description, image, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $title, $desc, $image, $meta_t, $meta_d]);
        header('Location: admin.php?action=categories&msg=saved');
        exit;
    }

    // Products CRUD
    if (isset($_POST['save_product'])) {
        $id = $_POST['id'];
        $cat_id = $_POST['category_id'];
        $title = $_POST['title'];
        $pos = $_POST['positioning'];
        $desc = $_POST['description'];
        $budget = $_POST['budget'];
        $min_q = $_POST['min_quantity'];
        $meta_t = $_POST['meta_title'];
        $meta_d = $_POST['meta_description'];
        
        $image = handleUpload('image_file') ?: $_POST['existing_image'];
        $images_json = json_encode([$image]);

        $stmt = $pdo->prepare("REPLACE INTO products (id, category_id, title, positioning, description, images, budget, min_quantity, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $cat_id, $title, $pos, $desc, $images_json, $budget, $min_q, $meta_t, $meta_d]);
        header('Location: admin.php?action=products&msg=saved');
        exit;
    }

    // Pages CRUD
    if (isset($_POST['save_page'])) {
        $id = $_POST['id'];
        $title = $_POST['title'];
        $content = $_POST['content'];
        $meta_t = $_POST['meta_title'];
        $meta_d = $_POST['meta_description'];

        $stmt = $pdo->prepare("REPLACE INTO pages (id, title, content, meta_title, meta_description, is_system) VALUES (?, ?, ?, ?, ?, (SELECT is_system FROM pages WHERE id = ?))");
        $stmt->execute([$id, $title, $content, $meta_t, $meta_d, $id]);
        header('Location: admin.php?action=pages&msg=saved');
        exit;
    }

    // Case Studies CRUD
    if (isset($_POST['save_case_study'])) {
        $id = $_POST['id'];
        $title = $_POST['title'];
        $subtitle = $_POST['subtitle'];
        $summary = $_POST['summary'];
        $challenge = $_POST['challenge'];
        $solution = $_POST['solution'];
        $results = $_POST['results'];
        $meta_t = $_POST['meta_title'];
        $meta_d = $_POST['meta_description'];
        
        $image = handleUpload('image_file') ?: $_POST['existing_image'];

        $stmt = $pdo->prepare("REPLACE INTO case_studies (id, title, subtitle, summary, challenge, solution, results, image, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $title, $subtitle, $summary, $challenge, $solution, $results, $image, $meta_t, $meta_d]);
        header('Location: admin.php?action=case_studies&msg=saved');
        exit;
    }
    
    // Users CRUD (Admin Only)
    if ($isAdmin && isset($_POST['save_user'])) {
        $username = $_POST['username'];
        $role = $_POST['role'];
        $email = $_POST['email'];
        
        if (!empty($_POST['password'])) {
            $pass = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?) ON CONFLICT(username) DO UPDATE SET password=excluded.password, role=excluded.role, email=excluded.email");
            $stmt->execute([$username, $pass, $role, $email]);
        } else {
            $stmt = $pdo->prepare("UPDATE users SET role=?, email=? WHERE username=?");
            $stmt->execute([$role, $email, $username]);
        }
        header('Location: admin.php?action=users&msg=saved');
        exit;
    }
}

// Delete Logic
if (isset($_GET['delete_id'])) {
    $id = $_GET['delete_id'];
    $table = $_GET['table'];
    
    // Basic protection
    if (in_array($table, ['categories', 'products', 'pages', 'users'])) {
        if ($table === 'users' && !$isAdmin) die('Unauthorized');
        if ($table === 'pages') {
            $stmt = $pdo->prepare("SELECT is_system FROM pages WHERE id = ?");
            $stmt->execute([$id]);
            if ($stmt->fetchColumn()) die('Cannot delete system pages');
        }
        
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        if ($table === 'users') $stmt = $pdo->prepare("DELETE FROM users WHERE username = ?");
        
        $stmt->execute([$id]);
        header("Location: admin.php?action=$table&msg=deleted");
        exit;
    }
}

?>
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <title>Admin Panel | Premium Boxes</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Montserrat', sans-serif; }
        h1, h2, h3 { font-family: 'Playfair Display', serif; }
        .nav-link { @apply flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all; }
        .nav-link.active { @apply text-[#D4AF37] bg-white/5 border-r-4 border-[#D4AF37]; }
        .btn-copper { @apply bg-[#D4AF37] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#cbaa42] transition-colors; }
    </style>
</head>
<body class="bg-gray-50 text-[#1A2238]">
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-72 bg-[#1A2238] text-white flex flex-col">
            <div class="p-8 border-b border-white/10">
                <h2 class="text-xl font-serif font-bold tracking-tighter">PREMIUM <span class="text-[#D4AF37] italic">ADMIN</span></h2>
                <p class="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Logged as: <?= $_SESSION['username'] ?> (<?= $_SESSION['role'] ?>)</p>
            </div>
            <nav class="flex-grow py-6">
                <a href="admin.php?action=dashboard" class="nav-link <?= $action === 'dashboard' ? 'active' : '' ?>">Dashboard</a>
                <a href="admin.php?action=pages" class="nav-link <?= $action === 'pages' ? 'active' : '' ?>">Pages</a>
                <a href="admin.php?action=categories" class="nav-link <?= $action === 'categories' ? 'active' : '' ?>">Categories</a>
                <a href="admin.php?action=products" class="nav-link <?= $action === 'products' ? 'active' : '' ?>">Products</a>
                <a href="admin.php?action=case_studies" class="nav-link <?= $action === 'case_studies' ? 'active' : '' ?>">Case Studies</a>
                <?php if ($isAdmin): ?>
                    <a href="admin.php?action=users" class="nav-link <?= $action === 'users' ? 'active' : '' ?>">Users</a>
                <?php endif; ?>
            </nav>
            <div class="p-8 border-t border-white/10">
                <a href="index.php" target="_blank" class="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white block mb-4">View Site</a>
                <a href="admin.php?logout=1" class="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300">Logout</a>
            </div>
        </aside>

        <!-- Main -->
        <main class="flex-1 p-12 overflow-y-auto">
            <?php if ($msg): ?>
                <div class="bg-green-50 text-green-700 p-4 mb-8 border-l-4 border-green-500 text-sm">Action completed successfully.</div>
            <?php endif; ?>

            <?php if ($action === 'dashboard'): ?>
                <h1 class="text-4xl mb-12">Overview</h1>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white p-10 shadow-sm border border-gray-100">
                        <p class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Total Products</p>
                        <p class="text-5xl font-serif"><?= $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn() ?></p>
                    </div>
                    <div class="bg-white p-10 shadow-sm border border-gray-100">
                        <p class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Categories</p>
                        <p class="text-5xl font-serif"><?= $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn() ?></p>
                    </div>
                    <div class="bg-white p-10 shadow-sm border border-gray-100">
                        <p class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Active Pages</p>
                        <p class="text-5xl font-serif"><?= $pdo->query("SELECT COUNT(*) FROM pages")->fetchColumn() ?></p>
                    </div>
                </div>

            <?php elseif ($action === 'pages'): ?>
                <div class="flex justify-between items-center mb-12">
                    <h1 class="text-4xl">Pages</h1>
                    <button onclick="newPage()" class="btn-copper">+ New Page</button>
                </div>
                <div class="bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            <tr>
                                <th class="p-6">ID</th>
                                <th class="p-6">Title</th>
                                <th class="p-6">SEO Title</th>
                                <th class="p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <?php foreach ($pdo->query("SELECT * FROM pages")->fetchAll() as $p): ?>
                                <tr>
                                    <td class="p-6 font-mono text-xs"><?= $p['id'] ?></td>
                                    <td class="p-6 font-bold"><?= $p['title'] ?></td>
                                    <td class="p-6 text-gray-500 text-sm"><?= $p['meta_title'] ?></td>
                                    <td class="p-6">
                                        <button onclick="editPage(<?= htmlspecialchars(json_encode($p)) ?>)" class="text-[#D4AF37] font-bold uppercase text-[10px] tracking-widest hover:underline mr-4">Edit</button>
                                        <?php if (!$p['is_system']): ?>
                                            <a href="admin.php?delete_id=<?= $p['id'] ?>&table=pages" onclick="return confirm('Delete page?')" class="text-red-400 font-bold uppercase text-[10px] tracking-widest hover:underline">Delete</a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Page Modal -->
                <div id="pageModal" class="hidden fixed inset-0 bg-[#1A2238]/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div class="bg-white p-12 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 class="text-3xl mb-8" id="pageModalTitle">Edit Page</h2>
                        <form method="POST" class="space-y-8">
                            <input type="hidden" name="id" id="page_id">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Title</label>
                                    <input type="text" name="title" id="page_title" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                                </div>
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">SEO Meta Title</label>
                                    <input type="text" name="meta_title" id="page_meta_title" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">SEO Meta Description</label>
                                <textarea name="meta_description" id="page_meta_description" class="w-full border border-gray-200 p-4 outline-none focus:border-[#D4AF37]" rows="2"></textarea>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Content (HTML allowed)</label>
                                <textarea name="content" id="page_content" class="w-full border border-gray-200 p-4 outline-none focus:border-[#D4AF37] font-mono text-sm" rows="10"></textarea>
                            </div>
                            <div class="flex gap-4 pt-4">
                                <button type="button" onclick="closeModal('pageModal')" class="flex-1 border border-gray-200 py-4 font-bold uppercase tracking-widest text-xs">Cancel</button>
                                <button type="submit" name="save_page" class="flex-1 bg-[#1A2238] text-white py-4 font-bold uppercase tracking-widest text-xs">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>

            <?php elseif ($action === 'categories'): ?>
                <div class="flex justify-between items-center mb-12">
                    <h1 class="text-4xl">Categories</h1>
                    <button onclick="newCategory()" class="btn-copper">+ New Category</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php foreach ($pdo->query("SELECT * FROM categories")->fetchAll() as $c): ?>
                        <div class="bg-white border border-gray-100 group">
                            <div class="aspect-video overflow-hidden bg-gray-100">
                                <img src="<?= $c['image'] ?: 'https://via.placeholder.com/400x225' ?>" class="w-full h-full object-cover">
                            </div>
                            <div class="p-8">
                                <h3 class="text-2xl mb-4"><?= $c['title'] ?></h3>
                                <div class="flex justify-between items-center">
                                    <button onclick="editCategory(<?= htmlspecialchars(json_encode($c)) ?>)" class="text-[#D4AF37] font-bold uppercase text-[10px] tracking-widest hover:underline">Edit</button>
                                    <a href="admin.php?delete_id=<?= $c['id'] ?>&table=categories" onclick="return confirm('Delete category?')" class="text-red-400 font-bold uppercase text-[10px] tracking-widest hover:underline">Delete</a>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Category Modal -->
                <div id="catModal" class="hidden fixed inset-0 bg-[#1A2238]/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div class="bg-white p-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 class="text-3xl mb-8" id="catModalTitle">Category</h2>
                        <form method="POST" enctype="multipart/form-data" class="space-y-6">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">ID (slug)</label>
                                    <input type="text" name="id" id="cat_id" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                                </div>
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Title</label>
                                    <input type="text" name="title" id="cat_title" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                                </div>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Description</label>
                                <textarea name="description" id="cat_desc" class="w-full border border-gray-200 p-4 outline-none focus:border-[#D4AF37]" rows="3"></textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">SEO Meta Title</label>
                                    <input type="text" name="meta_title" id="cat_meta_title" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">SEO Meta Description</label>
                                    <input type="text" name="meta_description" id="cat_meta_description" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Image</label>
                                <input type="file" name="image_file" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100">
                                <input type="hidden" name="existing_image" id="cat_existing_image">
                            </div>
                            <div class="flex gap-4 pt-4">
                                <button type="button" onclick="closeModal('catModal')" class="flex-1 border border-gray-200 py-4 font-bold uppercase tracking-widest text-xs">Cancel</button>
                                <button type="submit" name="save_category" class="flex-1 bg-[#1A2238] text-white py-4 font-bold uppercase tracking-widest text-xs">Save</button>
                            </div>
                        </form>
                    </div>
                </div>

            <?php elseif ($action === 'products'): ?>
                <div class="flex justify-between items-center mb-12">
                    <h1 class="text-4xl">Products</h1>
                    <button onclick="newProduct()" class="btn-copper">+ New Product</button>
                </div>
                <div class="bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            <tr>
                                <th class="p-6">Product</th>
                                <th class="p-6">Category</th>
                                <th class="p-6">Budget</th>
                                <th class="p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <?php foreach ($pdo->query("SELECT * FROM products")->fetchAll() as $p): ?>
                                <tr>
                                    <td class="p-6 flex items-center gap-4">
                                        <?php $imgs = json_decode($p['images'], true); ?>
                                        <div class="w-12 h-12 bg-gray-100 overflow-hidden">
                                            <img src="<?= $imgs[0] ?: 'https://via.placeholder.com/100' ?>" class="w-full h-full object-cover">
                                        </div>
                                        <div>
                                            <p class="font-bold"><?= $p['title'] ?></p>
                                            <p class="text-[10px] text-gray-400 font-mono"><?= $p['id'] ?></p>
                                        </div>
                                    </td>
                                    <td class="p-6 text-sm text-blue-600"><?= $p['category_id'] ?></td>
                                    <td class="p-6 text-sm font-serif"><?= $p['budget'] ?></td>
                                    <td class="p-6">
                                        <button onclick="editProduct(<?= htmlspecialchars(json_encode($p)) ?>)" class="text-[#D4AF37] font-bold uppercase text-[10px] tracking-widest hover:underline mr-4">Edit</button>
                                        <a href="admin.php?delete_id=<?= $p['id'] ?>&table=products" onclick="return confirm('Delete product?')" class="text-red-400 font-bold uppercase text-[10px] tracking-widest hover:underline">Delete</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Product Modal -->
                <div id="prodModal" class="hidden fixed inset-0 bg-[#1A2238]/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div class="bg-white p-12 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 class="text-3xl mb-8" id="prodModalTitle">Product</h2>
                        <form method="POST" enctype="multipart/form-data" class="space-y-6">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">ID (slug)</label>
                                    <input type="text" name="id" id="prod_id" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                                </div>
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Category</label>
                                    <select name="category_id" id="prod_cat" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                                        <?php foreach ($pdo->query("SELECT id, title FROM categories")->fetchAll() as $c): ?>
                                            <option value="<?= $c['id'] ?>"><?= $c['title'] ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Title</label>
                                    <input type="text" name="title" id="prod_title" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                                </div>
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Positioning</label>
                                    <input type="text" name="positioning" id="prod_pos" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Description</label>
                                <textarea name="description" id="prod_desc" class="w-full border border-gray-200 p-4 outline-none focus:border-[#D4AF37]" rows="4"></textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Budget</label>
                                    <input type="text" name="budget" id="prod_budget" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Min Quantity</label>
                                    <input type="text" name="min_quantity" id="prod_min_q" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">SEO Meta Title</label>
                                    <input type="text" name="meta_title" id="prod_meta_title" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                                <div>
                                    <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">SEO Meta Description</label>
                                    <input type="text" name="meta_description" id="prod_meta_description" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                                </div>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Image</label>
                                <input type="file" name="image_file" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100">
                                <input type="hidden" name="existing_image" id="prod_existing_image">
                            </div>
                            <div class="flex gap-4 pt-4">
                                <button type="button" onclick="closeModal('prodModal')" class="flex-1 border border-gray-200 py-4 font-bold uppercase tracking-widest text-xs">Cancel</button>
                                <button type="submit" name="save_product" class="flex-1 bg-[#1A2238] text-white py-4 font-bold uppercase tracking-widest text-xs">Save</button>
                            </div>
                        </form>
                    </div>
                </div>

            <?php elseif ($action === 'users' && $isAdmin): ?>
                <div class="flex justify-between items-center mb-12">
                    <h1 class="text-4xl">Users</h1>
                    <button onclick="newUser()" class="btn-copper">+ New User</button>
                </div>
                <div class="bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            <tr>
                                <th class="p-6">Username</th>
                                <th class="p-6">Email</th>
                                <th class="p-6">Role</th>
                                <th class="p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <?php foreach ($pdo->query("SELECT * FROM users")->fetchAll() as $u): ?>
                                <tr>
                                    <td class="p-6 font-bold"><?= $u['username'] ?></td>
                                    <td class="p-6 text-sm"><?= $u['email'] ?></td>
                                    <td class="p-6"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest <?= $u['role'] === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600' ?>"><?= $u['role'] ?></span></td>
                                    <td class="p-6">
                                        <button onclick="editUser(<?= htmlspecialchars(json_encode($u)) ?>)" class="text-[#D4AF37] font-bold uppercase text-[10px] tracking-widest hover:underline mr-4">Edit</button>
                                        <a href="admin.php?delete_id=<?= $u['username'] ?>&table=users" onclick="return confirm('Delete user?')" class="text-red-400 font-bold uppercase text-[10px] tracking-widest hover:underline">Delete</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <!-- User Modal -->
                <div id="userModal" class="hidden fixed inset-0 bg-[#1A2238]/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
                    <div class="bg-white p-12 w-full max-w-md">
                        <h2 class="text-3xl mb-8" id="userModalTitle">User</h2>
                        <form method="POST" class="space-y-6">
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Username</label>
                                <input type="text" name="username" id="user_username" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Email</label>
                                <input type="email" name="email" id="user_email" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Role</label>
                                <select name="role" id="user_role" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]" required>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">Password (leave blank to keep current)</label>
                                <input type="password" name="password" class="w-full border-b border-gray-200 py-2 outline-none focus:border-[#D4AF37]">
                            </div>
                            <div class="flex gap-4 pt-4">
                                <button type="button" onclick="closeModal('userModal')" class="flex-1 border border-gray-200 py-4 font-bold uppercase tracking-widest text-xs">Cancel</button>
                                <button type="submit" name="save_user" class="flex-1 bg-[#1A2238] text-white py-4 font-bold uppercase tracking-widest text-xs">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            <?php elseif ($action === 'case_studies'): ?>
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-2xl font-bold">Case Studies</h2>
                    <button onclick="newCaseStudy()" class="bg-navy text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all">+ New Case Study</button>
                </div>
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 border-b">
                            <tr>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Title</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Subtitle</th>
                                <th class="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <?php 
                            $cs_list = $pdo->query("SELECT * FROM case_studies")->fetchAll();
                            foreach ($cs_list as $cs): 
                            ?>
                                <tr>
                                    <td class="px-6 py-4 font-medium"><?= $cs['title'] ?></td>
                                    <td class="px-6 py-4 text-gray-500 italic"><?= $cs['subtitle'] ?></td>
                                    <td class="px-6 py-4 text-right space-x-4">
                                        <button onclick='editCaseStudy(<?= json_encode($cs) ?>)' class="text-navy hover:text-copper font-bold text-xs uppercase tracking-widest">Edit</button>
                                        <a href="admin.php?delete_id=<?= $cs['id'] ?>&table=case_studies" onclick="return confirm('Are you sure?')" class="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest">Delete</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <!-- Case Study Modal -->
    <div id="caseStudyModal" class="fixed inset-0 bg-navy/80 backdrop-blur-sm hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="p-8 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                <h3 id="csModalTitle" class="text-2xl font-bold">New Case Study</h3>
                <button onclick="closeModal('caseStudyModal')" class="text-gray-400 hover:text-navy text-2xl">&times;</button>
            </div>
            <form action="admin.php" method="POST" enctype="multipart/form-data" class="p-8 space-y-6">
                <input type="hidden" name="id" id="cs_id">
                <input type="hidden" name="existing_image" id="cs_existing_image">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Title</label>
                        <input type="text" name="title" id="cs_title" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Subtitle</label>
                        <input type="text" name="subtitle" id="cs_subtitle" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none">
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Summary (Executive Summary)</label>
                    <textarea name="summary" id="cs_summary" rows="4" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">The Challenge</label>
                        <textarea name="challenge" id="cs_challenge" rows="6" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none"></textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">The Solution</label>
                        <textarea name="solution" id="cs_solution" rows="6" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none"></textarea>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Results (One per line)</label>
                    <textarea name="results" id="cs_results" rows="4" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none" placeholder="e.g. 1500+ gifts delivered in 48h"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Main Image</label>
                        <input type="file" name="image_file" class="w-full p-2 border rounded-lg">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Meta Title</label>
                        <input type="text" name="meta_title" id="cs_meta_title" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-widest text-gray-400">Meta Description</label>
                        <input type="text" name="meta_description" id="cs_meta_description" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-copper outline-none">
                    </div>
                </div>

                <div class="pt-6 border-t flex justify-end gap-4">
                    <button type="button" onclick="closeModal('caseStudyModal')" class="px-6 py-2 text-gray-500 font-bold uppercase text-xs tracking-widest">Cancel</button>
                    <button type="submit" name="save_case_study" class="bg-navy text-white px-8 py-2 rounded-lg hover:bg-opacity-90 transition-all font-bold uppercase text-xs tracking-widest">Save Case Study</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
        function openModal(id) { document.getElementById(id).classList.remove('hidden'); }

        // Page Logic
        function newPage() {
            document.getElementById('pageModalTitle').innerText = 'New Page';
            document.getElementById('page_id').value = '';
            document.getElementById('page_id').readOnly = false;
            document.getElementById('page_title').value = '';
            document.getElementById('page_content').value = '';
            document.getElementById('page_meta_title').value = '';
            document.getElementById('page_meta_description').value = '';
            openModal('pageModal');
        }
        function editPage(p) {
            document.getElementById('pageModalTitle').innerText = 'Edit Page';
            document.getElementById('page_id').value = p.id;
            document.getElementById('page_id').readOnly = true;
            document.getElementById('page_title').value = p.title;
            document.getElementById('page_content').value = p.content;
            document.getElementById('page_meta_title').value = p.meta_title;
            document.getElementById('page_meta_description').value = p.meta_description;
            openModal('pageModal');
        }

        // Category Logic
        function newCategory() {
            document.getElementById('catModalTitle').innerText = 'New Category';
            document.getElementById('cat_id').value = '';
            document.getElementById('cat_id').readOnly = false;
            document.getElementById('cat_title').value = '';
            document.getElementById('cat_desc').value = '';
            document.getElementById('cat_meta_title').value = '';
            document.getElementById('cat_meta_description').value = '';
            document.getElementById('cat_existing_image').value = '';
            openModal('catModal');
        }
        function editCategory(c) {
            document.getElementById('catModalTitle').innerText = 'Edit Category';
            document.getElementById('cat_id').value = c.id;
            document.getElementById('cat_id').readOnly = true;
            document.getElementById('cat_title').value = c.title;
            document.getElementById('cat_desc').value = c.description;
            document.getElementById('cat_meta_title').value = c.meta_title;
            document.getElementById('cat_meta_description').value = c.meta_description;
            document.getElementById('cat_existing_image').value = c.image;
            openModal('catModal');
        }

        // Product Logic
        function newProduct() {
            document.getElementById('prodModalTitle').innerText = 'New Product';
            document.getElementById('prod_id').value = '';
            document.getElementById('prod_id').readOnly = false;
            document.getElementById('prod_title').value = '';
            document.getElementById('prod_pos').value = '';
            document.getElementById('prod_desc').value = '';
            document.getElementById('prod_budget').value = '';
            document.getElementById('prod_min_q').value = '';
            document.getElementById('prod_meta_title').value = '';
            document.getElementById('prod_meta_description').value = '';
            document.getElementById('prod_existing_image').value = '';
            openModal('prodModal');
        }
        function editProduct(p) {
            document.getElementById('prodModalTitle').innerText = 'Edit Product';
            document.getElementById('prod_id').value = p.id;
            document.getElementById('prod_id').readOnly = true;
            document.getElementById('prod_cat').value = p.category_id;
            document.getElementById('prod_title').value = p.title;
            document.getElementById('prod_pos').value = p.positioning;
            document.getElementById('prod_desc').value = p.description;
            document.getElementById('prod_budget').value = p.budget;
            document.getElementById('prod_min_q').value = p.min_quantity;
            document.getElementById('prod_meta_title').value = p.meta_title;
            document.getElementById('prod_meta_description').value = p.meta_description;
            const imgs = JSON.parse(p.images || '[]');
            document.getElementById('prod_existing_image').value = imgs[0] || '';
            openModal('prodModal');
        }

        // User Logic
        function newUser() {
            document.getElementById('userModalTitle').innerText = 'New User';
            document.getElementById('user_username').value = '';
            document.getElementById('user_username').readOnly = false;
            document.getElementById('user_email').value = '';
            document.getElementById('user_role').value = 'editor';
            openModal('userModal');
        }
        function editUser(u) {
            document.getElementById('userModalTitle').innerText = 'Edit User';
            document.getElementById('user_username').value = u.username;
            document.getElementById('user_username').readOnly = true;
            document.getElementById('user_email').value = u.email;
            document.getElementById('user_role').value = u.role;
            openModal('userModal');
        }
        // Case Study Logic
        function newCaseStudy() {
            document.getElementById('csModalTitle').innerText = 'New Case Study';
            document.getElementById('cs_id').value = '';
            document.getElementById('cs_title').value = '';
            document.getElementById('cs_subtitle').value = '';
            document.getElementById('cs_summary').value = '';
            document.getElementById('cs_challenge').value = '';
            document.getElementById('cs_solution').value = '';
            document.getElementById('cs_results').value = '';
            document.getElementById('cs_existing_image').value = '';
            document.getElementById('cs_meta_title').value = '';
            document.getElementById('cs_meta_description').value = '';
            openModal('caseStudyModal');
        }
        function editCaseStudy(cs) {
            document.getElementById('csModalTitle').innerText = 'Edit Case Study';
            document.getElementById('cs_id').value = cs.id;
            document.getElementById('cs_title').value = cs.title;
            document.getElementById('cs_subtitle').value = cs.subtitle;
            document.getElementById('cs_summary').value = cs.summary;
            document.getElementById('cs_challenge').value = cs.challenge;
            document.getElementById('cs_solution').value = cs.solution;
            document.getElementById('cs_results').value = cs.results;
            document.getElementById('cs_existing_image').value = cs.image;
            document.getElementById('cs_meta_title').value = cs.meta_title;
            document.getElementById('cs_meta_description').value = cs.meta_description;
            openModal('caseStudyModal');
        }
    </script>
</body>
</html>

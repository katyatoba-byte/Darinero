<?php
// index.php - Main frontend for the corporate gift box service
require_once 'db.php';

$page = $_GET['page'] ?? 'home';
$category_id = $_GET['category_id'] ?? null;
$product_id = $_GET['product_id'] ?? null;
$case_study_id = $_GET['case_study_id'] ?? null;

// Fetch data for the page
$categories = $pdo->query("SELECT * FROM categories")->fetchAll();
$concepts = $pdo->query("SELECT * FROM concepts LIMIT 4")->fetchAll();
$steps = $pdo->query("SELECT * FROM process_steps ORDER BY number ASC")->fetchAll();
$case_studies = $pdo->query("SELECT * FROM case_studies")->fetchAll();

// Default SEO
// ... (rest of the SEO logic)

function format_case_study_text($text) {
    $lines = explode("\n", $text);
    $output = '';
    foreach ($lines as $line) {
        $trimmed = trim($line);
        if (empty($trimmed)) {
            $output .= '<div class="h-4"></div>';
            continue;
        }
        if (mb_substr($trimmed, 0, 1) === '•') {
            $content = trim(mb_substr($trimmed, 1));
            $parts = explode(':', $content, 2);
            if (count($parts) > 1) {
                $output .= '<div class="flex gap-4 pl-4 mb-4"><span class="text-copper mt-1.5 text-sm">●</span><p class="text-charcoal font-light leading-relaxed text-lg flex-1"><strong class="font-bold text-navy">' . htmlspecialchars($parts[0]) . ':</strong>' . htmlspecialchars($parts[1]) . '</p></div>';
            } else {
                $output .= '<div class="flex gap-4 pl-4 mb-4"><span class="text-copper mt-1.5 text-sm">●</span><p class="text-charcoal font-light leading-relaxed text-lg flex-1">' . htmlspecialchars($content) . '</p></div>';
            }
        } else {
            $output .= '<p class="text-charcoal font-light leading-relaxed text-lg mb-4">' . htmlspecialchars($line) . '</p>';
        }
    }
    return $output;
}

if ($page === 'case_study' && $case_study_id) {
    $stmt = $pdo->prepare("SELECT * FROM case_studies WHERE id = ?");
    $stmt->execute([$case_study_id]);
    $current_case_study = $stmt->fetch();
    
    if ($current_case_study) {
        if ($current_case_study['meta_title']) $meta_title = $current_case_study['meta_title'];
        if ($current_case_study['meta_description']) $meta_description = $current_case_study['meta_description'];
    }
}

// Default SEO
$meta_title = "Corporate Gift Boxes | Premium Curation";
$meta_description = "Custom curated corporate gift boxes for your brand. Premium quality and design.";

// Fetch current page data
$stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
$stmt->execute([$page]);
$current_page = $stmt->fetch();

if ($current_page) {
    if ($current_page['meta_title']) $meta_title = $current_page['meta_title'];
    if ($current_page['meta_description']) $meta_description = $current_page['meta_description'];
}

if ($page === 'category' && $category_id) {
    $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
    $stmt->execute([$category_id]);
    $current_category = $stmt->fetch();
    
    if ($current_category) {
        if ($current_category['meta_title']) $meta_title = $current_category['meta_title'];
        if ($current_category['meta_description']) $meta_description = $current_category['meta_description'];
        
        $stmt = $pdo->prepare("SELECT * FROM products WHERE category_id = ?");
        $stmt->execute([$category_id]);
        $category_products = $stmt->fetchAll();
    }
}

if ($page === 'product' && $product_id) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch();
    
    if ($product) {
        if ($product['meta_title']) $meta_title = $product['meta_title'];
        if ($product['meta_description']) $meta_description = $product['meta_description'];
        
        $stmt = $pdo->prepare("SELECT * FROM product_items WHERE product_id = ?");
        $stmt->execute([$product_id]);
        $product_items = $stmt->fetchAll();
        $product['images'] = json_decode($product['images'], true);
    }
}
?>
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $meta_title ?></title>
    <meta name="description" content="<?= $meta_description ?>">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-navy: #1A2238;
            --color-copper: #D4AF37;
            --color-softgray: #D9DDE3;
            --color-charcoal: #555555;
            --color-offwhite: #F8F9FA;
        }
        body { font-family: 'Montserrat', sans-serif; color: var(--color-charcoal); }
        h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; color: var(--color-navy); }
        .section-padding { padding: 6rem 1.5rem; }
        @media (min-width: 768px) { .section-padding { padding: 6rem 3rem; } }
        @media (min-width: 1024px) { .section-padding { padding: 6rem 6rem; } }
        .btn-premium {
            background-color: #cbaa42;
            color: white;
            padding: 1rem 2rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            font-weight: 500;
            transition: all 0.3s;
            border-radius: 4px;
            display: inline-block;
        }
        .btn-premium:hover { background-color: #1f273c; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .bg-navy { background-color: var(--color-navy); }
        .text-copper { color: var(--color-copper); }
        .bg-offwhite { background-color: var(--color-offwhite); }
        .text-navy { color: var(--color-navy); }
    </style>
</head>
<body class="bg-white antialiased">

    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="index.php" class="text-2xl font-serif font-bold tracking-tighter text-navy">PREMIUM <span class="text-copper italic">BOXES</span></a>
            <div class="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest">
                <a href="index.php" class="hover:text-copper transition-colors">Начало</a>
                <a href="index.php?page=categories" class="hover:text-copper transition-colors">Каталог</a>
                <a href="index.php?page=case_studies" class="hover:text-copper transition-colors">Case Studies</a>
                <a href="index.php?page=about" class="hover:text-copper transition-colors">За нас</a>
                <a href="index.php?page=contact" class="hover:text-copper transition-colors">Контакт</a>
            </div>
            <a href="index.php?page=contact" class="hidden md:block text-[10px] font-bold uppercase tracking-widest border-b-2 border-copper pb-1 hover:text-copper transition-colors">Запитване</a>
        </div>
    </nav>

    <div class="pt-20">
        <?php if ($page === 'home'): ?>
            <!-- Hero Section -->
            <section class="relative h-[90vh] flex items-center overflow-hidden bg-navy">
                <div class="absolute inset-0 opacity-40">
                    <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=2000" alt="Hero" class="w-full h-full object-cover">
                </div>
                <div class="relative z-10 max-w-7xl mx-auto px-6 text-white">
                    <span class="text-copper uppercase tracking-[0.4em] text-xs font-bold mb-8 block">Art of Gifting</span>
                    <h1 class="text-6xl md:text-8xl mb-12 leading-none text-white">Подаръкът като <br/><span class="italic font-light">стратегия.</span></h1>
                    <p class="text-xl md:text-2xl font-light max-w-2xl mb-12 text-white/70 leading-relaxed">
                        Ние не просто пълним кутии. Ние градим репутация чрез кураторски селекции и безкомпромисен дизайн.
                    </p>
                    <div class="flex flex-wrap gap-8">
                        <a href="index.php?page=categories" class="btn-premium">Разгледай каталога</a>
                        <a href="index.php?page=contact" class="px-8 py-4 border border-white/30 hover:bg-white hover:text-navy transition-all uppercase tracking-widest text-xs font-bold flex items-center gap-4">Заяви концепция <span>→</span></a>
                    </div>
                </div>
            </section>

            <!-- Problem Section -->
            <section class="section-padding bg-white">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Предизвикателството</span>
                            <h2 class="text-4xl md:text-5xl mb-12 leading-tight text-navy">
                                Подаряването не трябва да бъде <span class="italic">логистичен кошмар</span>
                            </h2>
                            <div class="space-y-8">
                                <div class="flex items-start gap-6">
                                    <div class="mt-1 text-copper">●</div>
                                    <p class="text-lg text-charcoal font-light">Губите дни в координация на десетки доставчици</p>
                                </div>
                                <div class="flex items-start gap-6">
                                    <div class="mt-1 text-copper">●</div>
                                    <p class="text-lg text-charcoal font-light">Получавате банални идеи, които не отразяват бранда ви</p>
                                </div>
                                <div class="flex items-start gap-6">
                                    <div class="mt-1 text-copper">●</div>
                                    <p class="text-lg text-charcoal font-light">Всичко се случва в последния момент под огромен стрес</p>
                                </div>
                            </div>
                        </div>
                        <div class="relative">
                            <div class="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl border border-gray-100">
                                <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1000" alt="Corporate Gifts" class="w-full h-full object-cover">
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Process Steps -->
            <section class="section-padding bg-offwhite">
                <div class="max-w-7xl mx-auto">
                    <div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div class="max-w-2xl">
                            <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Пътят до резултата</span>
                            <h2 class="text-4xl md:text-5xl text-navy">Премахваме хаоса от процеса</h2>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <?php foreach ($steps as $step): ?>
                            <div class="relative group">
                                <div class="text-8xl font-serif font-bold text-navy/5 absolute -top-10 -left-4 group-hover:text-copper/10 transition-colors">
                                    <?= $step['number'] ?>
                                </div>
                                <div class="relative z-10 pt-8">
                                    <h3 class="text-2xl mb-4 font-serif text-navy"><?= $step['title'] ?></h3>
                                    <p class="text-charcoal font-light leading-relaxed"><?= $step['description'] ?></p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </section>

            <!-- Solution Section -->
            <section class="section-padding bg-navy text-white">
                <div class="max-w-7xl mx-auto text-center mb-20">
                    <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Решението</span>
                    <h2 class="text-4xl md:text-6xl mb-8 text-white">Корпоративни подаръци, които работят за имиджа ви</h2>
                    <p class="text-xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
                        Вие задавате бюджета, ние градим репутацията ви.<br />
                        Създаваме концепция, подбираме продуктите, изграждаме визията и доставяме без риск за вас.
                    </p>
                </div>

                <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    <?php foreach (['Концепция', 'Подбор', 'Дизайн', 'Персонализация', 'Логистика'] as $idx => $step): ?>
                        <div class="p-10 border border-white/10 bg-white/5 backdrop-blur-sm text-center group transition-all hover:border-copper/50 hover:-translate-y-2">
                            <div class="text-copper text-4xl font-serif mb-6 opacity-30 group-hover:opacity-100 transition-opacity">0<?= $idx + 1 ?></div>
                            <h3 class="text-xl font-medium tracking-wide"><?= $step ?></h3>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="mt-20 text-center">
                    <p class="text-white/60 mb-8 mx-auto font-light">
                        Гарантирано качество и спазване на срокове, дори при кампании за 500+ служители.
                    </p>
                    <a href="index.php?page=contact" class="inline-block bg-copper text-white px-12 py-5 text-lg font-bold tracking-widest uppercase hover:bg-copper/90 transition-all shadow-xl">
                        НАПРАВЕТЕ ЗАПИТВАНЕ
                    </a>
                </div>
            </section>

            <!-- Concepts -->
            <section class="section-padding bg-white">
                <div class="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div>
                        <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Портфолио</span>
                        <h2 class="text-4xl md:text-5xl text-navy">Concept Showroom</h2>
                    </div>
                    <a href="index.php?page=concepts" class="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-navy hover:text-copper transition-colors">
                        Виж всички концепции <span class="group-hover:translate-x-2 transition-transform">→</span>
                    </a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <?php foreach ($concepts as $concept): ?>
                        <div class="group cursor-pointer">
                            <div class="aspect-[16/10] overflow-hidden mb-8 relative border border-gray-100">
                                <img src="<?= $concept['image'] ?>" alt="<?= $concept['title'] ?>" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                                <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-navy">
                                    <?= $concept['category'] ?>
                                </div>
                            </div>
                            <h3 class="text-3xl mb-4 text-navy group-hover:text-copper transition-colors"><?= $concept['title'] ?></h3>
                            <p class="text-charcoal font-light leading-relaxed max-w-xl"><?= $concept['description'] ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </section>

            <!-- Case Studies Section -->
            <section class="section-padding bg-offwhite">
                <div class="max-w-7xl mx-auto mb-20">
                    <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Успешни истории</span>
                    <h2 class="text-4xl md:text-5xl text-navy mb-8">Case Studies</h2>
                    <p class="text-xl text-charcoal font-light max-w-2xl leading-relaxed">
                        Вижте как решаваме реални бизнес предизвикателства чрез креативност и прецизна логистика.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php foreach ($case_studies as $cs): ?>
                        <div class="group bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div class="aspect-video overflow-hidden">
                                <img src="<?= $cs['image'] ?>" alt="<?= $cs['title'] ?>" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                            </div>
                            <div class="p-8">
                                <h3 class="text-xl font-serif mb-4 text-navy group-hover:text-copper transition-colors"><?= $cs['title'] ?></h3>
                                <p class="text-sm text-charcoal font-light mb-6 line-clamp-3"><?= $cs['summary'] ?></p>
                                <a href="index.php?page=case_study&case_study_id=<?= $cs['id'] ?>" class="inline-flex items-center gap-2 text-copper font-bold uppercase text-[10px] tracking-widest hover:gap-4 transition-all">
                                    Виж детайли <span class="text-lg">→</span>
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </section>

            <!-- Differentiation -->
            <section class="py-32 bg-navy text-white overflow-hidden relative">
                <div class="max-w-7xl mx-auto px-6 relative z-10">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                        <?php foreach ([
                            ['label' => "Не каталог.", 'value' => "Кураторство."],
                            ['label' => "Не доставчик.", 'value' => "Партньор."],
                            ['label' => "Не продукти.", 'value' => "Преживяване."]
                        ] as $item): ?>
                            <div class="space-y-4">
                                <p class="text-white/40 uppercase tracking-[0.3em] text-xs"><?= $item['label'] ?></p>
                                <p class="text-4xl md:text-5xl font-serif italic text-copper"><?= $item['value'] ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </section>

            <!-- Trust / Metrics -->
            <section class="section-padding bg-offwhite">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Доверие</span>
                            <h2 class="text-4xl md:text-5xl mb-8 text-navy">Доказани резултати в мащаб</h2>
                            <p class="text-lg text-charcoal font-light mb-12 leading-relaxed">
                                Работим с лидери в IT сектора, банковото дело и фармацията, за които качеството и точността не подлежат на компромис.
                            </p>
                            <div class="grid grid-cols-2 gap-12">
                                <div>
                                    <p class="text-5xl font-serif text-navy mb-2">300+</p>
                                    <p class="text-xs uppercase tracking-widest text-navy/40 font-bold">Служители в проект</p>
                                </div>
                                <div>
                                    <p class="text-5xl font-serif text-navy mb-2">3</p>
                                    <p class="text-xs uppercase tracking-widest text-navy/40 font-bold">Седмици реализация</p>
                                </div>
                                <div>
                                    <p class="text-5xl font-serif text-navy mb-2">100%</p>
                                    <p class="text-xs uppercase tracking-widest text-navy/40 font-bold">Успешна доставка</p>
                                </div>
                                <div>
                                    <p class="text-5xl font-serif text-navy mb-2">24/7</p>
                                    <p class="text-xs uppercase tracking-widest text-navy/40 font-bold">Логистичен контрол</p>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-4">
                                <div class="aspect-square bg-white border border-gray-100 flex items-center justify-center p-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all shadow-sm">
                                    <span class="text-2xl font-bold italic opacity-20 text-navy">IT CORP</span>
                                </div>
                                <div class="aspect-[3/4] overflow-hidden border border-gray-100 shadow-sm">
                                    <img src="https://picsum.photos/seed/box1/600/800" alt="Box detail" class="w-full h-full object-cover">
                                </div>
                            </div>
                            <div class="space-y-4 pt-12">
                                <div class="aspect-[3/4] overflow-hidden border border-gray-100 shadow-sm">
                                    <img src="https://picsum.photos/seed/box2/600/800" alt="Box detail" class="w-full h-full object-cover">
                                </div>
                                <div class="aspect-square bg-white border border-gray-100 flex items-center justify-center p-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all shadow-sm">
                                    <span class="text-2xl font-bold italic opacity-20 text-navy">GLOBAL BANK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Final CTA -->
            <section class="py-40 bg-white text-center px-6">
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-5xl md:text-7xl mb-12 leading-tight text-navy">Нека създадем нещо, което <span class="italic">ще се запомни</span></h2>
                    <a href="index.php?page=contact" class="btn-premium text-xl px-12 py-6">
                        Заяви концепция
                    </a>
                    <p class="mt-8 text-navy/40 text-sm uppercase tracking-widest">Първоначална консултация до 24 часа</p>
                </div>
            </section>

        <?php elseif ($page === 'categories'): ?>
            <section class="section-padding bg-offwhite min-h-screen">
                <div class="max-w-7xl mx-auto">
                    <div class="max-w-3xl mb-24">
                        <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Каталог</span>
                        <h1 class="text-5xl md:text-7xl mb-8">Категории кутии</h1>
                        <p class="text-xl text-charcoal font-light leading-relaxed">
                            Разгледайте нашите кураторски селекции, създадени да впечатляват. Всяка категория е само отправна точка за вашето уникално корпоративно решение.
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <?php foreach ($categories as $category): ?>
                            <div class="group bg-white border border-navy/5 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div class="aspect-[16/10] overflow-hidden relative">
                                    <img src="<?= $category['image'] ?>" alt="<?= $category['title'] ?>" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                                </div>
                                <div class="p-8">
                                    <h2 class="text-2xl font-serif mb-4 text-navy"><?= $category['title'] ?></h2>
                                    <p class="text-charcoal font-light mb-8 line-clamp-2"><?= $category['description'] ?></p>
                                    <a href="index.php?page=category&category_id=<?= $category['id'] ?>" class="inline-flex items-center gap-2 text-copper font-bold uppercase text-xs tracking-widest hover:gap-4 transition-all">
                                        Разгледай <span class="text-lg">→</span>
                                    </a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </section>

        <?php elseif ($page === 'category' && $category_id): ?>
            <section class="section-padding bg-offwhite min-h-screen">
                <div class="max-w-7xl mx-auto">
                    <div class="mb-16">
                        <a href="index.php?page=categories" class="text-xs uppercase tracking-widest font-bold text-copper hover:text-navy transition-colors">← Обратно към категориите</a>
                        <h1 class="text-5xl md:text-6xl mt-8 mb-4"><?= $current_category['title'] ?></h1>
                        <p class="text-xl text-charcoal font-light max-w-2xl"><?= $current_category['description'] ?></p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <?php if (empty($category_products)): ?>
                            <p class="text-navy/40 italic">Няма намерени продукти в тази категория.</p>
                        <?php else: ?>
                            <?php foreach ($category_products as $prod): ?>
                                <div class="group bg-white border border-navy/5 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div class="aspect-[16/10] overflow-hidden relative">
                                        <?php $imgs = json_decode($prod['images'], true); ?>
                                        <img src="<?= $imgs[0] ?>" alt="<?= $prod['title'] ?>" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                                    </div>
                                    <div class="p-8">
                                        <h2 class="text-2xl font-serif mb-4 text-navy"><?= $prod['title'] ?></h2>
                                        <p class="text-charcoal font-light mb-8 line-clamp-2"><?= $prod['positioning'] ?></p>
                                        <a href="index.php?page=product&product_id=<?= $prod['id'] ?>" class="inline-flex items-center gap-2 text-copper font-bold uppercase text-xs tracking-widest hover:gap-4 transition-all">
                                            Детайли <span class="text-lg">→</span>
                                        </a>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </section>

        <?php elseif ($page === 'product' && $product_id): ?>
            <section class="section-padding bg-white min-h-screen">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div class="space-y-4">
                            <div class="aspect-square overflow-hidden border border-gray-100">
                                <img src="<?= $product['images'][0] ?>" alt="<?= $product['title'] ?>" class="w-full h-full object-cover">
                            </div>
                        </div>
                        <div>
                            <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Корпоративен подарък</span>
                            <h1 class="text-4xl md:text-5xl mb-6"><?= $product['title'] ?></h1>
                            <p class="text-xl font-serif italic text-navy mb-8"><?= $product['positioning'] ?></p>
                            <div class="prose prose-navy max-w-none mb-12 text-charcoal font-light leading-relaxed">
                                <?= nl2br($product['description']) ?>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-8 mb-12 border-y border-gray-100 py-8">
                                <div>
                                    <p class="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Бюджет</p>
                                    <p class="font-serif text-lg"><?= $product['budget'] ?></p>
                                </div>
                                <div>
                                    <p class="text-[10px] uppercase tracking-widest font-bold text-navy/40 mb-1">Мин. количество</p>
                                    <p class="font-serif text-lg"><?= $product['min_quantity'] ?></p>
                                </div>
                            </div>

                            <a href="index.php?page=contact&product=<?= $product['id'] ?>" class="btn-premium w-full text-center">Запитване за този продукт</a>
                        </div>
                    </div>
                </div>
            </section>

        <?php elseif ($page === 'contact'): ?>
            <section class="section-padding bg-offwhite min-h-screen">
                <div class="max-w-7xl mx-auto">
                    <div class="max-w-3xl mx-auto text-center mb-16">
                        <h1 class="text-5xl md:text-6xl mb-8">Свържете се с нас</h1>
                        <p class="text-xl text-charcoal font-light">Готови сме да превърнем вашата идея в реалност. Изпратете ни запитване и ще се свържем с вас до 24 часа.</p>
                    </div>
                    <div class="max-w-2xl mx-auto bg-white p-12 shadow-xl border border-gray-100">
                        <form action="#" method="POST" class="space-y-6">
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-navy mb-2 block">Име и Фамилия</label>
                                <input type="text" required class="w-full bg-white border border-gray-200 py-3 px-4 outline-none focus:border-copper transition-colors">
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-navy mb-2 block">Фирма</label>
                                <input type="text" required class="w-full bg-white border border-gray-200 py-3 px-4 outline-none focus:border-copper transition-colors">
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-navy mb-2 block">Имейл</label>
                                <input type="email" required class="w-full bg-white border border-gray-200 py-3 px-4 outline-none focus:border-copper transition-colors">
                            </div>
                            <div>
                                <label class="text-[10px] uppercase tracking-widest font-bold text-navy mb-2 block">Съобщение</label>
                                <textarea rows="4" required class="w-full bg-white border border-gray-200 py-3 px-4 outline-none focus:border-copper transition-colors"></textarea>
                            </div>
                            <button type="submit" class="btn-premium w-full">Изпрати запитване</button>
                        </form>
                    </div>
                </div>
            </section>
        <?php elseif ($page === 'about'): ?>
            <section class="section-padding bg-white min-h-screen">
                <div class="max-w-4xl mx-auto prose prose-navy lg:prose-xl">
                    <?= $current_page['content'] ?? '<h1>За нас</h1><p>Съдържанието се подготвя...</p>' ?>
                </div>
            </section>
        <?php elseif ($page === 'case_study' && $case_study_id): ?>
            <section class="section-padding bg-white min-h-screen">
                <div class="max-w-7xl mx-auto">
                    <div class="mb-16">
                        <a href="index.php" class="text-xs uppercase tracking-widest font-bold text-copper hover:text-navy transition-colors">← Обратно към началото</a>
                        <h1 class="text-5xl md:text-7xl mt-8 mb-4"><?= $current_case_study['title'] ?></h1>
                        <p class="text-xl text-copper font-serif italic mb-12"><?= $current_case_study['subtitle'] ?></p>
                    </div>
                    
                    <div class="aspect-[16/7] overflow-hidden mb-24 border border-gray-100">
                        <img src="<?= $current_case_study['image'] ?>" alt="<?= $current_case_study['title'] ?>" class="w-full h-full object-cover">
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-24">
                        <div class="lg:col-span-2 space-y-16">
                            <div>
                                <h2 class="text-3xl mb-8 border-b border-gray-100 pb-4">1. Резюме (Executive Summary)</h2>
                                <div class="max-w-none">
                                    <?= format_case_study_text($current_case_study['summary']) ?>
                                </div>
                            </div>
                            <div>
                                <h2 class="text-3xl mb-8 border-b border-gray-100 pb-4">2. Предизвикателството (The Challenge)</h2>
                                <div class="max-w-none">
                                    <?= format_case_study_text($current_case_study['challenge']) ?>
                                </div>
                            </div>
                            <div>
                                <h2 class="text-3xl mb-8 border-b border-gray-100 pb-4">3. Нашето решение (The End-to-End Solution)</h2>
                                <div class="max-w-none">
                                    <?= format_case_study_text($current_case_study['solution']) ?>
                                </div>
                            </div>
                        </div>
                        <div class="bg-navy p-12 text-white h-fit sticky top-32">
                            <h2 class="text-2xl text-copper mb-8 font-serif italic">4. Резултати и Въздействие (Results & Impact)</h2>
                            <div class="space-y-8">
                                <?php 
                                $results = explode("\n", $current_case_study['results']);
                                foreach ($results as $result): 
                                    if (trim($result) === '') continue;
                                ?>
                                    <div class="border-l-2 border-copper pl-6">
                                        <p class="text-white/80 font-light leading-relaxed"><?= $result ?></p>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <div class="mt-12 pt-12 border-t border-white/10">
                                <p class="text-xs uppercase tracking-widest text-white/40 mb-6">Искате подобен резултат?</p>
                                <a href="index.php?page=contact" class="btn-premium w-full text-center">Запитване</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <?php elseif ($page === 'case_studies'): ?>
            <section class="section-padding bg-offwhite min-h-screen">
                <div class="max-w-7xl mx-auto">
                    <div class="max-w-3xl mb-24">
                        <span class="text-copper uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Портфолио</span>
                        <h1 class="text-5xl md:text-7xl mb-8">Case Studies</h1>
                        <p class="text-xl text-charcoal font-light leading-relaxed">
                            Реални истории за мащабни проекти, кратки срокове и безкомпромисно качество.
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <?php foreach ($case_studies as $cs): ?>
                            <div class="group bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <div class="aspect-video overflow-hidden">
                                    <img src="<?= $cs['image'] ?>" alt="<?= $cs['title'] ?>" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                                </div>
                                <div class="p-8">
                                    <h3 class="text-2xl font-serif mb-4 text-navy group-hover:text-copper transition-colors"><?= $cs['title'] ?></h3>
                                    <p class="text-charcoal font-light mb-8 line-clamp-3"><?= $cs['summary'] ?></p>
                                    <a href="index.php?page=case_study&case_study_id=<?= $cs['id'] ?>" class="inline-flex items-center gap-2 text-copper font-bold uppercase text-xs tracking-widest hover:gap-4 transition-all">
                                        Виж детайли <span class="text-lg">→</span>
                                    </a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>
    </div>

    <!-- Footer -->
    <footer class="bg-navy text-white section-padding">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div class="lg:col-span-2">
                <a href="index.php" class="text-3xl font-serif font-bold tracking-tighter text-white mb-8 block">PREMIUM <span class="text-copper italic">BOXES</span></a>
                <p class="text-white/50 font-light max-w-md leading-relaxed">
                    Ние вярваме, че корпоративният подарък е инвестиция в отношенията. Нашата мисия е да правим този процес лесен, стилен и запомнящ се.
                </p>
            </div>
            <div>
                <h4 class="text-copper uppercase tracking-widest text-xs font-bold mb-8">Навигация</h4>
                <ul class="space-y-4 text-sm font-light text-white/70">
                    <li><a href="index.php" class="hover:text-white transition-colors">Начало</a></li>
                    <li><a href="index.php?page=categories" class="hover:text-white transition-colors">Каталог</a></li>
                    <li><a href="index.php?page=case_studies" class="hover:text-white transition-colors">Case Studies</a></li>
                    <li><a href="index.php?page=about" class="hover:text-white transition-colors">За нас</a></li>
                    <li><a href="index.php?page=contact" class="hover:text-white transition-colors">Контакт</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-copper uppercase tracking-widest text-xs font-bold mb-8">Контакт</h4>
                <ul class="space-y-4 text-sm font-light text-white/70">
                    <li>hello@premiumboxes.bg</li>
                    <li>+359 888 123 456</li>
                    <li>София, България</li>
                </ul>
            </div>
        </div>
        <div class="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/30 flex flex-col md:flex-row justify-between gap-4">
            <p>&copy; 2026 Premium Boxes. Всички права запазени.</p>
            <div class="flex gap-8">
                <a href="#" class="hover:text-white transition-colors">Политика за поверителност</a>
                <a href="#" class="hover:text-white transition-colors">Общи условия</a>
            </div>
        </div>
    </footer>

</body>
</html>

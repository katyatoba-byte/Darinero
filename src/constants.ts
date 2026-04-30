import { Concept, Service, ProcessStep, Category, Product } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'bulgarian-heritage',
    title: 'Bulgarian Heritage Box',
    description: 'Селекция от автентични български вкусове и занаятчийски предмети, представени с модерен прочит.',
    image: 'https://picsum.photos/seed/heritage/800/1000',
    category: 'Premium Curation'
  },
  {
    id: 'welcome-experience',
    title: 'Welcome Experience',
    description: 'Първият ден в компанията е началото на една история. Направете го незабравим.',
    image: 'https://picsum.photos/seed/welcome/800/1000',
    category: 'Onboarding'
  },
  {
    id: 'vip-client',
    title: 'VIP Client Gift',
    description: 'Когато жестът трябва да говори за уважение, детайл и дългосрочно партньорство.',
    image: 'https://picsum.photos/seed/vip/800/1000',
    category: 'Corporate'
  },
  {
    id: 'event-concept',
    title: 'Event Concept',
    description: 'Подаръкът като част от сценографията на вашето корпоративно събитие.',
    image: 'https://picsum.photos/seed/event/800/1000',
    category: 'Events'
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'christmas-brands',
    title: 'Коледни кутии за брандове',
    description: 'Елегантни решения за вашите ключови партньори и клиенти.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'christmas-employees',
    title: 'Подаръци за служители',
    description: 'Празнична радост за целия екип, доставена до техния дом или офис.',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'vip-boxes',
    title: 'VIP подаръчни кутии',
    description: 'Ексклузивни селекции за най-важните моменти.',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'welcome-kits',
    title: 'Welcome kits',
    description: 'Първият ден в компанията е началото на една история. Направете го незабравим.',
    image: 'https://picsum.photos/seed/welcome/800/1000'
  },
  {
    id: 'event-boxes',
    title: 'Подаръчни кутии за събития',
    description: 'Подаръкът като част от сценографията на вашето корпоративно събитие.',
    image: 'https://picsum.photos/seed/event/800/1000'
  },
  {
    id: 'bulgarian-products',
    title: 'Подаръчни кутии с български продукти',
    description: 'Селекция от автентични български вкусове и занаятчийски предмети.',
    image: 'https://picsum.photos/seed/heritage/800/1000'
  },
  {
    id: 'wellness-boxes',
    title: 'Wellness gift boxes',
    description: 'Грижа за здравето и баланса на вашите служители.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'gourmet-boxes',
    title: 'Gourmet gift boxes',
    description: 'За ценителите на изтънчените вкусове и гурме преживявания.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'christmas-employees-gifts',
    categoryId: 'christmas-employees',
    title: 'Коледни подаръци за служители',
    positioning: 'Гъвкаво решение в бюджет от 15 до 40 €',
    description: 'Създайте подарък, който отговаря на вашия бюджет и стил. Започвате от базова кутия на стойност 15 €, след което избирате какво да включите и какво да персонализирате. Ние ще подготвим финално предложение и визия за одобрение.',
    images: [
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1000'
    ],
    suitableFor: 'Служители, екипи, мениджмънт',
    occasionType: 'Коледа и Нова Година',
    budget: 'от 15 € до 40 €',
    minQuantity: '10 броя',
    leadTime: '1–3 седмици',
    personalizationType: 'кутия, картичка, продукт',
    boxStyle: 'Еко кутия с празничен дизайн',
    individualDelivery: true,
    defaultItems: [
      { id: 'christmas-choco', name: 'Коледен шоколад', description: 'Занаятчийски шоколад с празничен дизайн.' },
      { id: 'christmas-tea-base', name: 'Коледен чай', description: 'Ароматна селекция от билки и подправки.' },
      { id: 'gingerbread-man', name: 'Коледна меденка', description: 'Ръчно изработена и декорирана.' }
    ],
    optionalItems: [
      { id: 'honey-jar', name: 'Мед', description: 'за топлина и уют' },
      { id: 'tea-strainer', name: 'Цедка за чай', description: 'практичен детайл' },
      { id: 'honey-dipper', name: 'Бъркалка за мед', description: 'завършеност' },
      { id: 'christmas-ornament', name: 'Коледна играчка', description: 'за празнично усещане' },
      { id: 'fortune-cookie', name: 'Коледно късметче', description: 'личен елемент' },
      { id: 'hot-choco-mix', name: 'Горещ шоколад', description: 'момент на наслада' }
    ],
    personalizationOptions: [
      'Кутия (лого) (над 20 бр.)',
      'Таг към кутията (над 20 бр.)',
      'Персонализирана картичка (над 20 бр.)',
      'Персонализиран шоколад (над 20 бр.)',
      'Коледна играчка (над 20 бр.)'
    ]
  },
  {
    id: 'christmas-brands-employees-gifts',
    categoryId: 'christmas-brands',
    title: 'Коледни подаръци за служители',
    positioning: 'Гъвкаво решение в бюджет от 15 до 40 € за вашите брандове',
    description: 'Създайте подарък, който отговаря на вашия бюджет и стил. Започвате от базова кутия на стойност 15 €, след което избирате какво да включите и какво да персонализирате. Ние ще подготвим финално предложение и визия за одобрение.',
    images: [
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1000'
    ],
    suitableFor: 'Служители, екипи, мениджмънт',
    occasionType: 'Коледа и Нова Година',
    budget: 'от 15 € до 40 €',
    minQuantity: '10 броя',
    leadTime: '1–3 седмици',
    personalizationType: 'кутия, картичка, продукт',
    boxStyle: 'Еко кутия с празничен дизайн',
    individualDelivery: true,
    defaultItems: [
      { id: 'christmas-choco', name: 'Коледен шоколад', description: 'Занаятчийски шоколад with празничен дизайн.' },
      { id: 'christmas-tea-base', name: 'Коледен чай', description: 'Ароматна селекция от билки and подправки.' },
      { id: 'gingerbread-man', name: 'Коледна меденка', description: 'Ръчно изработена and декорирана.' }
    ],
    optionalItems: [
      { id: 'honey-jar', name: 'Мед', description: 'за топлина и уют' },
      { id: 'tea-strainer', name: 'Цедка за чай', description: 'практичен детайл' },
      { id: 'honey-dipper', name: 'Бъркалка за мед', description: 'завършеност' },
      { id: 'christmas-ornament', name: 'Коледна играчка', description: 'за празнично усещане' },
      { id: 'fortune-cookie', name: 'Коледно късметче', description: 'личен елемент' },
      { id: 'hot-choco-mix', name: 'Горещ шоколад', description: 'момент на наслада' }
    ],
    personalizationOptions: [
      'Кутия (лого) (над 20 бр.)',
      'Таг към кутията (над 20 бр.)',
      'Персонализирана картичка (над 20 бр.)',
      'Персонализиран шоколад (над 20 бр.)',
      'Коледна играчка (над 20 бр.)'
    ]
  },
  {
    id: 'christmas-partners-gifts',
    categoryId: 'christmas-brands',
    title: 'Коледни подаръци за партньори',
    positioning: 'Елегантност и професионализъм за вашите бизнес партньорства.',
    description: 'Изискани подаръчни комплекти, които подчертават стойността на вашите дългосрочни бизнес отношения.',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000'
    ],
    suitableFor: 'Бизнес партньори, доставчици, асоциирани фирми',
    occasionType: 'Коледа и Нова Година',
    budget: '50 - 90 €',
    minQuantity: '20 броя',
    leadTime: '3 - 4 седмици',
    personalizationType: 'Брандирана лента, луксозна картичка, лого',
    boxStyle: 'Твърда кутия с магнитно затваряне',
    individualDelivery: true,
    defaultItems: [
      { id: 'wine-reserve', name: 'Резерва Вино', description: 'Селектирано българско вино от бутикова изба.' },
      { id: 'cheese-aged', name: 'Отлежало Сирене', description: 'Занаятчийско сирене с трюфел.' },
      { id: 'nuts-gourmet', name: 'Гурме Ядки', description: 'Микс от печени ядки с подправки.' }
    ],
    optionalItems: [
      { id: 'leather-accessory', name: 'Кожен Аксесоар', description: 'Ръчно изработен ключодържател или визитник.' }
    ]
  },
  {
    id: 'christmas-clients-gifts',
    categoryId: 'christmas-brands',
    title: 'Коледни подаръци за клиенти',
    positioning: 'Благодарност за доверието през изминалата година.',
    description: 'Стилни и запомнящи се подаръци, които укрепват връзката с вашите клиенти и оставят трайно впечатление.',
    images: [
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=1000'
    ],
    suitableFor: 'Ключови клиенти, корпоративни клиенти',
    occasionType: 'Коледа и Нова Година',
    budget: '30 - 60 €',
    minQuantity: '30 броя',
    leadTime: '3 седмици',
    personalizationType: 'Лого, персонализирано послание',
    boxStyle: 'Елегантна подаръчна кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'coffee-specialty', name: 'Спешълти Кафе', description: 'Прясно изпечено кафе от малка пекарна.' },
      { id: 'chocolate-artisan', name: 'Занаятчийски Шоколад', description: 'Ръчно изработен тъмен шоколад.' },
      { id: 'candle-aromatic', name: 'Ароматна Свещ', description: 'Натурален соев восък.' }
    ],
    optionalItems: [
      { id: 'honey-organic', name: 'Био Мед', description: 'Натурален мед от български производител.' }
    ]
  },
  {
    id: 'christmas-vip-gifts',
    categoryId: 'christmas-brands',
    title: 'ВИП Коледни подаръци',
    positioning: 'Ексклузивност и лукс за най-важните моменти.',
    description: 'Лимитирани серии и премиум предмети за тези, които заслужават най-доброто. Безкомпромисно качество и внимание към всеки детайл.',
    images: [
      'https://images.unsplash.com/photo-1511177545613-b150046cb47a?auto=format&fit=crop&q=80&w=1000'
    ],
    suitableFor: 'Топ мениджмънт, VIP партньори, борд на директорите',
    occasionType: 'Коледа и Нова Година',
    budget: '125+ €',
    minQuantity: '10 броя',
    leadTime: '4 седмици',
    personalizationType: 'Гравиране, индивидуални монограми, луксозна опаковка',
    boxStyle: 'Дървена кутия или луксозен сет',
    individualDelivery: true,
    defaultItems: [
      { id: 'champagne-premium', name: 'Премиум Шампанско', description: 'Френско шампанско от висок клас.' },
      { id: 'caviar-selection', name: 'Селекция Хайвер', description: 'За истински ценители.' },
      { id: 'luxury-item', name: 'Дизайнерски Предмет', description: 'Лимитиран аксесоар за дома или офиса.' }
    ],
    optionalItems: [
      { id: 'concierge-service', name: 'Консиерж Карта', description: 'Едногодишен достъп до ексклузивни услуги.' }
    ]
  },
  {
    id: 'christmas-zimna-iskra',
    categoryId: 'christmas-brands',
    title: 'Коледна кутия Зимна искра',
    positioning: 'Коледни корпоративни подаръци с персонализация и премиум визия',
    description: `Тази коледна кутия е създадена за компании, които искат да подарят не просто продукт, а впечатление.

„Зимна искра“ комбинира ръчно изработени български продукти и гурме изживяване в стилна подаръчна кутия, подходяща за корпоративни подаръци за служители, клиенти и бизнес партньори.

Създадена е за B2B компании в България, които търсят:
– персонализирани коледни подаръци
– брандирани подаръчни кутии
– стилни и запомнящи се бизнес подаръци

Ръчно изработената дървена дъска носи усещане за традиция и устойчивост, докато шоколадът добавя завършен гурме акцент с висока възприемана стойност.`,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000'
    ],
    suitableFor: 'Компании с 50+ служители, HR и Employer Branding екипи, Маркетинг отдели',
    occasionType: 'Коледа и Нова Година',
    budget: '20 €',
    minQuantity: '50 броя',
    leadTime: '5–15 работни дни',
    personalizationType: 'Гравиране на лого върху дъската, брандиране на шоколада',
    boxStyle: 'Луксозна подаръчна кутия с декоративен пълнеж (с или без персонализация)',
    individualDelivery: true,
    isReadyProposal: true,
    defaultItems: [
      { id: 'walnut-board', name: 'Дъска от орехово дърво', description: 'Ръчно изработена във формата на елха.' },
      { id: 'premium-white-choco', name: 'Премиум бял шоколад', description: 'С горски плодове от занаятчийска шоколатерия.' },
      { id: 'luxury-box-filling', name: 'Луксозна кутия', description: 'С декоративен пълнеж. Може да бъде персонализирана или без персонализация.' }
    ],
    optionalItems: [
      { id: 'logo-engraving', name: 'Гравиране на лого', description: 'Върху дървената дъска.' },
      { id: 'branded-sleeve', name: 'Брандиран ръкав', description: 'За шоколада с фирмен дизайн.' }
    ],
    suitableForList: [
      'Служители на компанията',
      'Бизнес партньори и клиенти',
      'Корпоративни събития и конференции'
    ],
    faqs: [
      { 
        question: 'Предлагате ли доставка до индивидуални адреси?', 
        answer: 'Да, предлагаме D2H (Door to Home) доставка за всички наши кутии.' 
      }
    ]
  },
  {
    id: 'employee-birthday',
    categoryId: 'christmas-employees',
    title: 'Рождени дни на служители',
    positioning: 'Личен жест за най-важния ден на всеки член от екипа.',
    description: 'Превърнете рождения ден на вашия служител в празник с внимателно подбрана кутия, която показва, че цените човека зад професионалиста.',
    images: ['https://picsum.photos/seed/birthday/800/1000'],
    suitableFor: 'Всички служители',
    occasionType: 'Рожден ден',
    budget: '15 - 35 €',
    minQuantity: '10 броя (абонамент)',
    leadTime: '1 седмица',
    personalizationType: 'Име на служителя, картичка с пожелание',
    boxStyle: 'Цветна и празнична кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'cake-mini', name: 'Мини Торта или Кексчета', description: 'Прясно изпечени сладки изкушения.' },
      { id: 'balloon-helium', name: 'Празничен Балон', description: 'За добро настроение.' }
    ],
    optionalItems: []
  },
  {
    id: 'employee-anniversary-event',
    categoryId: 'event-boxes',
    title: 'Годишнини на служители',
    positioning: 'Признание за лоялността и споделения път.',
    description: 'Отпразнувайте годините съвместна работа с подарък, който символизира растежа и успеха, постигнати заедно. Перфектно решение за корпоративни събития и вътрешни празненства.',
    images: ['https://picsum.photos/seed/emp-anniversary-event/800/1000'],
    suitableFor: 'Лоялни служители (1, 3, 5+ години)',
    occasionType: 'Работна годишнина',
    budget: '25 - 80 €',
    minQuantity: '10 броя',
    leadTime: '2 седмици',
    personalizationType: 'Гравиран плакет, персонално писмо, брандирани предмети',
    boxStyle: 'Премиум кутия с изчистен дизайн',
    individualDelivery: true,
    defaultItems: [
      { id: 'watch-or-accessory-event', name: 'Стилен Аксесоар', description: 'Качествен предмет за спомен.' },
      { id: 'certificate-honor-event', name: 'Грамота for Принос', description: 'Луксозно изпълнение.' }
    ],
    optionalItems: []
  },
  {
    id: 'employee-of-month',
    categoryId: 'christmas-employees',
    title: 'Служител на месеца',
    positioning: 'Мотивация и отличие за изключителни постижения.',
    description: 'Наградете усилията и вдъхновете останалите с пакет, създаден за истински победители.',
    images: ['https://picsum.photos/seed/star/800/1000'],
    suitableFor: 'Отличени служители',
    occasionType: 'Месечно признание',
    budget: '20 - 40 €',
    minQuantity: '1 брой (месечен абонамент)',
    leadTime: '1 седмица',
    personalizationType: 'Титла "Служител на месеца", брандирани предмети',
    boxStyle: 'Кутия тип "Награда"',
    individualDelivery: false,
    defaultItems: [
      { id: 'coffee-premium-set', name: 'Премиум Кафе Комплект', description: 'За енергичен старт на деня.' },
      { id: 'voucher-experience', name: 'Ваучер за Преживяване', description: 'Кино, вечеря или релакс.' }
    ],
    optionalItems: []
  },
  {
    id: 'employee-onboarding',
    categoryId: 'christmas-employees',
    title: 'Onboarding на нов служител',
    positioning: 'Топло посрещане в голямото семейство.',
    description: 'Направете първия ден незабравим и помогнете на новия колега да се почувства част от екипа веднага.',
    images: ['https://picsum.photos/seed/onboarding/800/1000'],
    suitableFor: 'Новопостъпили служители',
    occasionType: 'Първи работен ден',
    budget: '23 - 45 €',
    minQuantity: '10 броя',
    leadTime: '2 седмици',
    personalizationType: 'Welcome pack с име, фирмени ценности',
    boxStyle: 'Брандирана Welcome кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'hoodie-branded', name: 'Фирмен Суитшърт', description: 'Удобство и принадлежност.' },
      { id: 'office-essentials', name: 'Офис Комплект', description: 'Бележник, химикалка и стикери.' }
    ],
    optionalItems: []
  },
  {
    id: 'event-project-complete',
    categoryId: 'event-boxes',
    title: 'Завършен важен проект',
    positioning: 'Признание за усилията и постигнатите резултати.',
    description: 'Жест на благодарност към екипа, който превърна визията в реалност.',
    images: ['https://picsum.photos/seed/project/800/1000'],
    suitableFor: 'Проектен екип, мениджъри',
    occasionType: 'Успешно завършване на проект',
    budget: '35 - 60 €',
    minQuantity: '10 броя',
    leadTime: '2 седмици',
    personalizationType: 'Персонализирано писмо, брандирани деликатеси',
    boxStyle: 'Елегантна кутия с панделка',
    individualDelivery: true,
    defaultItems: [
      { id: 'coffee-set', name: 'Комплект за Кафе', description: 'Премиум кафе и стилна чаша.' },
      { id: 'sweets-premium', name: 'Френски Макарони', description: 'Ръчно изработени с натурални съставки.' }
    ],
    optionalItems: []
  },
  {
    id: 'event-award',
    categoryId: 'event-boxes',
    title: 'Спечелена награда',
    positioning: 'Споделена радост от общия успех.',
    description: 'Когато компанията печели, печелят всички. Отпразнувайте високото признание заедно.',
    images: ['https://picsum.photos/seed/award/800/1000'],
    suitableFor: 'Служители, партньори',
    occasionType: 'Корпоративни награди и отличия',
    budget: '25 - 50 €',
    minQuantity: '20 броя',
    leadTime: '2 седмици',
    personalizationType: 'Златно фолио, брандирано шампанско',
    boxStyle: 'Празнична кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'prosecco-mini', name: 'Мини Просеко', description: 'За празнична наздравица.' },
      { id: 'chocolate-gold', name: 'Златни Шоколадови Трюфели', description: 'Луксозна селекция.' }
    ],
    optionalItems: []
  },
  {
    id: 'event-new-office',
    categoryId: 'event-boxes',
    title: 'Откриване на нов офис',
    positioning: 'Ново начало в нова среда.',
    description: 'Подаръци, които правят новото работно място по-уютно и вдъхновяващо от първия ден.',
    images: ['https://picsum.photos/seed/office/800/1000'],
    suitableFor: 'Служители, съседи, партньори',
    occasionType: 'Откриване на офис / Релокация',
    budget: '20 - 45 €',
    minQuantity: '15 броя',
    leadTime: '2 седмици',
    personalizationType: 'Офис аксесоари with лого, Welcome картичка',
    boxStyle: 'Модерна and минималистична кутия',
    individualDelivery: false,
    defaultItems: [
      { id: 'plant-desk', name: 'Офис Растение', description: 'Лесно за поддръжка сукулентно растение.' },
      { id: 'mug-ceramic', name: 'Керамична Чаша', description: 'С ергономичен дизайн и вашето лого.' }
    ],
    optionalItems: []
  },
  {
    id: 'vip-manager-birthday',
    categoryId: 'vip-boxes',
    title: 'Рожден ден на мениджъра',
    positioning: 'Изискан жест за лидерския екип.',
    description: 'Когато поводът изисква класа и персонално отношение към мениджмънта.',
    images: ['https://picsum.photos/seed/manager/800/1000'],
    suitableFor: 'Мениджъри, директори, партньори',
    occasionType: 'Рожден ден',
    budget: '75 - 150 €',
    minQuantity: '1 брой',
    leadTime: '1 седмица',
    personalizationType: 'Гравиране, луксозна опаковка, ръчно изработена картичка',
    boxStyle: 'Премиум дървена или кожена кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'whiskey-premium', name: 'Отлежало Уиски', description: 'Селектирана бутилка от лимитирана серия.' },
      { id: 'cigar-set', name: 'Комплект Пури', description: 'За ценители на фините удоволствия.' }
    ],
    optionalItems: []
  },
  {
    id: 'vip-big-deal',
    categoryId: 'vip-boxes',
    title: 'Затваряне на голяма сделка',
    positioning: 'Победен дух и споделен успех.',
    description: 'Отпразнувайте големите победи с подарък, който подчертава значимостта на постигнатото.',
    images: ['https://picsum.photos/seed/deal/800/1000'],
    suitableFor: 'Ключови партньори, търговски екипи',
    occasionType: 'Успешна сделка',
    budget: '100 - 250 €',
    minQuantity: '1 брой',
    leadTime: '1 седмица',
    personalizationType: 'Юбилеен надпис, брандирано шампанско',
    boxStyle: 'Ексклузивна подаръчна кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'champagne-vintage', name: 'Винтидж Шампанско', description: 'За най-важните наздравици.' },
      { id: 'luxury-chocolates', name: 'Ръчни Шоколадови Бонбони', description: 'От майстор шоколатиер.' }
    ],
    optionalItems: []
  },
  {
    id: 'vip-new-contract',
    categoryId: 'vip-boxes',
    title: 'Подписване на нов договор (клиент)',
    positioning: 'Начало на обещаващо партньорство.',
    description: 'Първото впечатление е най-важно. Посрещнете новия си клиент с жест, който обещава качество и грижа.',
    images: ['https://picsum.photos/seed/contract/800/1000'],
    suitableFor: 'Нови корпоративни клиенти',
    occasionType: 'Ново партньорство',
    budget: '60 - 125 €',
    minQuantity: '5 броя',
    leadTime: '2 седмици',
    personalizationType: 'Welcome писмо, брандирани офис аксесоари',
    boxStyle: 'Стилна корпоративна кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'leather-notebook', name: 'Кожен Бележник', description: 'Ръчна изработка с италианска кожа.' },
      { id: 'fountain-pen', name: 'Писалка Parker', description: 'Символ на професионализъм.' }
    ],
    optionalItems: []
  },
  {
    id: 'vip-client-onboarding',
    categoryId: 'vip-boxes',
    title: 'Onboarding на нов клиент',
    positioning: 'Интеграция and доверие от първия ден.',
    description: 'Помогнете на вашия нов VIP клиент да се почувства специален and добре дошъл във вашата екосистема.',
    images: ['https://picsum.photos/seed/vip-onboarding/800/1000'],
    suitableFor: 'VIP клиенти',
    occasionType: 'Onboarding',
    budget: '50 - 100 €',
    minQuantity: '10 броя',
    leadTime: '2 седмици',
    personalizationType: 'Персонализиран Welcome пакет',
    boxStyle: 'Модерна and елегантна кутия',
    individualDelivery: true,
    defaultItems: [
      { id: 'tech-gadget', name: 'Премиум Power Bank', description: 'С гравирано лого.' },
      { id: 'coffee-specialty-pack', name: 'Спешълти Кафе Селекция', description: 'От най-добрите региони.' }
    ],
    optionalItems: []
  },
  {
    id: 'vip-client-event',
    categoryId: 'vip-boxes',
    title: 'VIP клиентско събитие',
    positioning: 'Незабравимо преживяване and спомен.',
    description: 'Подаръкът като финален акорд на вашето ексклузивно събитие.',
    images: ['https://picsum.photos/seed/vip-event/800/1000'],
    suitableFor: 'Гости на VIP събития',
    occasionType: 'Корпоративно събитие',
    budget: '40 - 90 €',
    minQuantity: '20 броя',
    leadTime: '3 седмици',
    personalizationType: 'Тематично брандиране спрямо събитието',
    boxStyle: 'Дизайнерска кутия',
    individualDelivery: false,
    defaultItems: [
      { id: 'art-piece', name: 'Арт Предмет', description: 'Малка скулптура или репродукция.' },
      { id: 'gourmet-delicacies', name: 'Гурме Деликатеси', description: 'Селекция от трюфели и сирена.' }
    ],
    optionalItems: []
  },
  {
    id: 'ready-anniversary',
    categoryId: 'christmas-employees',
    title: '🎁 Подаръчен комплект „Годишнина“ – Ритуал за тялото и душата',
    positioning: 'Подарък с внимание, смисъл и усещане за ритуал',
    description: `Тази кутия не е просто подарък. Тя е жест на признателност за всеки изминал етап от съвместния път.
    
Независимо дали е първата или двадесетата година на ваш служител в компанията, този комплект е създаден за моменти, в които искаш да кажеш „благодаря“ по начин, който се усеща – не просто се прочита.

Изразете своята признателност по най-елегантния начин с нашия специално подбран подаръчен сет. Поканете своя служител или партньор на заслужена почивка и грижа с ритуал, който ще го накара да се почувства ценен и значим.`,
    images: [
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1582718115502-ba4bc1b82e21?auto=format&fit=crop&q=80&w=1000'
    ],
    suitableFor: 'Служители, екипи, партньори',
    occasionType: 'Работна годишнина / Юбилей',
    budget: 'от 25 €',
    minQuantity: '1 брой',
    leadTime: '5–10 работни дни',
    personalizationType: 'Персонализирана кутия и картичка (дори за 1 бр.)',
    boxStyle: 'Красива крафт кутия с персонално послание, маслинено зелено и натурални земни тонове',
    individualDelivery: true,
    isReadyProposal: true,
    defaultItems: [
      { id: 'matcha-powder-organic', name: 'Органична матча на прах', description: 'Dragon Superfoods – висококачествена органична матча за енергия и фокус.' },
      { id: 'matcha-chocolate-premium', name: 'Матча шоколад', description: 'Benjamíssimo Matcha & Strawberry – занаятчийски шоколад.' },
      { id: 'matcha-balls-bettr', name: 'Натурални матча хапки', description: 'Bett’r Matcha Orange Balls – здравословен десерт.' },
      { id: 'matcha-latte-mix', name: 'Матча лате микс', description: 'За перфектната топла напитка.' },
      { id: 'ceramic-mug-elegant', name: 'Елегантна керамична чаша', description: 'Стилен аксесоар за вашия ритуал.' },
      { id: 'scented-candle-ritual', name: 'Ароматна свещ', description: 'За уютна атмосфера и завършване на личния ритуал.' },
      { id: 'personalized-card-ritual', name: 'Персонализирана картичка', description: 'С вашето индивидуално послание за признателност.' }
    ],
    optionalItems: [
      { id: 'metal-accessory-box', name: 'Стилна метална кутия/аксесоар', description: 'Деликатен детайл за съхранение или декорация.' }
    ],
    suitableForList: [
      'Работни годишнини (без значение от броя години)',
      'Служители и екипи (Employee Anniversary)',
      'Партньори и ключови клиенти',
      'Employer branding жестове'
    ],
    whyChooseList: [
      'Гъвкавост: Без минимално количество – поръчайте дори 1 брой',
      'Персонализация: Възможност за индивидуално послание върху картичката и кутията още от 1-вия брой',
      'Персонализирано съдържание: Възможност за промяна на съдържанието според вашите нужди',
      'Ритуал за тялото и душата: Подарък, който носи спокойствие и грижа'
    ],
    brandingDescription: 'Дори при поръчка на 1 брой, вие получавате:\n– Индивидуално послание върху картичката\n– Персонализирана кутия с име или специален текст\n\nПри поръчка на по-големи количества (над 20 бр.) предлагаме допълнителни възможности за брандиране с лого и корпоративен дизайн.',
    technicalSpecs: [
      { label: 'Цветова гама', value: 'Зелено (Матча), Натурален крафт, Златисто' },
      { label: 'Тип продукти', value: 'Био храни, Ароматерапия, Аксесоари' },
      { label: 'Минимално количество', value: '1 брой' }
    ],
    faqs: [
      { 
        question: 'Може ли да се промени съдържанието?', 
        answer: 'Да, можем да адаптираме селекцията от продукти в кутията спрямо вашите предпочитания, независимо от количеството.' 
      },
      { 
        question: 'Какво мога да персонализирам при поръчка на 1 брой?', 
        answer: 'За всеки отделен комплект можете да персонализирате картичката с лично послание и да добавите специален текст/име върху подаръчната кутия.' 
      }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 'corporate-boxes',
    title: 'Corporate Gift Boxes',
    useCase: 'Празници, годишнини, тиймбилдинг',
    value: 'Пълна персонализация и логистика до всеки служител.',
    description: 'Мащабни решения за големи екипи.',
    budget: '25 - 75 € / box'
  },
  {
    id: 'vip-gifts',
    title: 'VIP Gifts',
    useCase: 'Ключови партньори, борд на директорите',
    value: 'Ексклузивни предмети и лимитирани серии.',
    description: 'Индивидуален подход към всеки детайл.',
    budget: '100+ € / gift'
  },
  {
    id: 'campaigns',
    title: 'Gifting Campaigns',
    useCase: 'Маркетинг активации, лоялност',
    value: 'Стратегическо обвързване с бранд целите.',
    description: 'Креативни концепции, които носят резултат.',
    budget: 'По проект'
  },
  {
    id: 'annual-program',
    title: 'Annual Gifting Program',
    useCase: 'Целогодишно управление',
    value: 'Автоматизация и консистентност на имиджа.',
    description: 'Ние планираме, вие само одобрявате.',
    budget: 'Абонаментен план'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Бриф',
    description: 'Разбираме вашите цели, аудитория и бранд идентичност.'
  },
  {
    number: '02',
    title: 'Концепция',
    description: 'Представяме кураторски предложения с визуализации и мостри.'
  },
  {
    number: '03',
    title: 'Реализация',
    description: 'Поемаме дизайна, персонализацията и опаковането.'
  },
  {
    number: '04',
    title: 'Доставка',
    description: 'Прецизна логистика до офис или личен адрес.'
  }
];

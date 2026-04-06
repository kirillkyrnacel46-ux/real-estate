// ============================================
// ДАННЫЕ: Объекты недвижимости
// ============================================

const DISTRICTS = {
    moscow: [
        { id: 'patriarshie', city: 'moscow', name: 'Патриаршие пруды', count: 47, avg: 75000000, img: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=600&q=80', desc: 'Один из самых престижных районов Москвы. Тихие улочки, бутики, рестораны. Любимое место московской богемы.' },
        { id: 'arbat', city: 'moscow', name: 'Арбат / Хамовники', count: 63, avg: 65000000, img: 'https://images.unsplash.com/photo-1565715101842-a5d40e3d4c2d?auto=format&fit=crop&w=600&q=80', desc: 'Историческое сердце Москвы. Знаковые архитектурные памятники, развитая инфраструктура.' },
        { id: 'city', city: 'moscow', name: 'Москва-Сити', count: 38, avg: 90000000, img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80', desc: 'Деловой центр Москвы. Небоскрёбы, апартаменты с панорамными видами. Максимальная близость к бизнесу.' },
        { id: 'rublevka', city: 'moscow', name: 'Рублёвское шоссе', count: 29, avg: 120000000, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80', desc: 'Самое престижное загородное направление Москвы. Коттеджи, особняки, закрытые посёлки.' },
    ],
    spb: [
        { id: 'krestovsky', city: 'spb', name: 'Крестовский остров', count: 34, avg: 85000000, img: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&w=600&q=80', desc: 'Самый элитный остров Петербурга. Набережные, закрытые ЖК, парки и Газпром Арена.' },
        { id: 'petrogradka', city: 'spb', name: 'Петроградская сторона', count: 52, avg: 55000000, img: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=600&q=80', desc: 'Исторический район с авторской архитектурой. Галереи, кофейни, атмосфера богемной жизни.' },
        { id: 'nevsky', city: 'spb', name: 'Невский проспект', count: 41, avg: 60000000, img: 'https://images.unsplash.com/photo-1545189708-3b0af5c96ef0?auto=format&fit=crop&w=600&q=80', desc: 'В самом центре Северной столицы. Парадная архитектура, рестораны и бесконечная история.' },
        { id: 'vasilevsky', city: 'spb', name: 'Василеостровский район', count: 27, avg: 48000000, img: 'https://images.unsplash.com/photo-1555881400-74d7acaaeca5?auto=format&fit=crop&w=600&q=80', desc: 'Стремительно развивающийся район с выходом к заливу. Новые ЖК и историческая застройка.' },
    ]
};

const PROPERTIES = [
    // МОСКВА
    {
        id: 1, city: 'moscow', district: 'city', districtName: 'Москва-Сити', type: 'penthouse',
        title: 'Пентхаус в башне Федерация',
        address: 'Пресненская набережная, 12',
        price: 155000000, priceM2: 620000,
        area: 250, rooms: 4, floor: 89, totalFloors: 95,
        deal: 'buy', isNew: false, isHot: true, hasParking: true, hasTerrace: true, nearMetro: true, isGated: true,
        img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80',
        desc: 'Уникальный пентхаус на 89-м этаже культовой башни Федерация. Панорамное остекление от пола до потолка открывает 360° вид на Москву. Дизайнерский ремонт премиум-класса, умный дом, система климат-контроля. Два парковочных места и личная кладовая.',
        features: ['Умный дом', 'Парковка ×2', 'Кладовая', 'Консьерж 24/7', 'Личный лифт', 'Высокие потолки 4м', 'Панорамный вид'],
        agent: 'Дм. Морозов'
    },
    {
        id: 2, city: 'moscow', district: 'patriarshie', districtName: 'Патриаршие пруды',
        type: 'apartment',
        title: 'Элитная квартира с видом на пруд',
        address: 'Малая Бронная улица, 15',
        price: 95000000, priceM2: 730000,
        area: 130, rooms: 3, floor: 5, totalFloors: 9,
        deal: 'buy', isNew: false, isHot: true, hasParking: true, hasTerrace: true, nearMetro: true, isGated: false,
        img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
        desc: 'Великолепная квартира в доме начала ХХ века с сохранённой лепниной и высокими потолками 3.2 м. После полного авторского ремонта. Вид на Патриаршие пруды из окон гостиной. В 5 минутах пешком от Белорусской.',
        features: ['Историческое здание', 'Высокие потолки 3.2м', 'Лепнина', 'Авторский ремонт', 'Вид на пруд', 'Паркет дуб'],
        agent: 'Ан. Соколова'
    },
    {
        id: 3, city: 'moscow', district: 'arbat', districtName: 'Арбат / Хамовники',
        type: 'apartment',
        title: 'Квартира в клубном доме «Хамовники»',
        address: 'Бутиковский переулок, 5',
        price: 72000000, priceM2: 560000,
        area: 128, rooms: 3, floor: 3, totalFloors: 8,
        deal: 'buy', isNew: true, isHot: false, hasParking: true, hasTerrace: false, nearMetro: true, isGated: true,
        img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
        desc: 'Квартира в тихом клубном доме в самом heart Хамовников. Закрытый двор, подземный паркинг. Качественные отделочные материалы: дуб, мрамор, матовые поверхности. Рядом Новодевичий монастырь и Фрунзенская набережная.',
        features: ['Закрытый двор', 'Подземный паркинг', 'Консьерж', 'Мрамор и дуб', 'Видеонаблюдение'],
        agent: 'Иг. Петров'
    },
    {
        id: 4, city: 'moscow', district: 'rublevka', districtName: 'Рублёвское шоссе',
        type: 'house',
        title: 'Коттедж в посёлке «Барвихинские аллеи»',
        address: 'Барвихинское шоссе, 14 км',
        price: 180000000, priceM2: 300000,
        area: 600, rooms: 6, floor: 1, totalFloors: 3,
        deal: 'buy', isNew: false, isHot: true, hasParking: true, hasTerrace: true, nearMetro: false, isGated: true,
        img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80',
        desc: 'Представительный коттедж 600 кв.м в охраняемом посёлке прямо у Рублёво-Успенского шоссе. Бассейн 15х5 м, баня, кинотеатр, гараж на 3 машины. Участок 25 соток, собственный сад.',
        features: ['Бассейн 15×5м', 'Баня', 'Гараж ×3', 'Кинотеатр', 'Сад 25 соток', 'Охрана 24/7', 'Умный дом'],
        agent: 'Дм. Морозов'
    },
    {
        id: 5, city: 'moscow', district: 'city', districtName: 'Москва-Сити',
        type: 'apartments',
        title: 'Апартаменты в Capital Towers',
        address: '1-й Красногвардейский проезд, 21с1',
        price: 68000000, priceM2: 520000,
        area: 130, rooms: 2, floor: 52, totalFloors: 75,
        deal: 'buy', isNew: true, isHot: false, hasParking: true, hasTerrace: false, nearMetro: true, isGated: true,
        img: 'https://images.unsplash.com/photo-1628012198051-50e8ad0f208d?auto=format&fit=crop&w=900&q=80',
        desc: 'Современные апартаменты в новом небоскрёбе Capital Towers. Чистовая отделка от застройщика. Открытая планировка, панорамные окна на высоте 52-го этажа. Лобби со стойкой reception, фитнес-центр на 30-м этаже.',
        features: ['Финишная отделка', 'Фитнес-центр', 'Ресторан в здании', 'Высота 52 этаж', '2 лифта', 'Парковка'],
        agent: 'Иг. Петров'
    },
    // САНКТ-ПЕТЕРБУРГ
    {
        id: 6, city: 'spb', district: 'krestovsky', districtName: 'Крестовский остров',
        type: 'house',
        title: 'Особняк с причалом на Крестовском',
        address: 'Морской проспект, 28',
        price: 220000000, priceM2: 489000,
        area: 450, rooms: 7, floor: 1, totalFloors: 3,
        deal: 'buy', isNew: false, isHot: true, hasParking: true, hasTerrace: true, nearMetro: false, isGated: true,
        img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
        desc: 'Уникальный особняк на берегу Малой Невки с личным причалом для яхты. Закрытая охраняемая территория 12 соток. Бассейн, спа, home office. Архитектура в скандинавском стиле. Вид на воду из большинства комнат.',
        features: ['Личный причал', 'Яхтенное место', 'Бассейн', 'СПА зона', 'Охрана 24/7', 'Вид на воду', 'Камин'],
        agent: 'Ан. Соколова'
    },
    {
        id: 7, city: 'spb', district: 'petrogradka', districtName: 'Петроградская сторона',
        type: 'apartment',
        title: 'Апартаменты в реновированном доходном доме',
        address: 'улица Большая Пушкарская, 10',
        price: 58000000, priceM2: 480000,
        area: 120, rooms: 3, floor: 4, totalFloors: 5,
        deal: 'buy', isNew: false, isHot: false, hasParking: false, hasTerrace: true, nearMetro: true, isGated: false,
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
        desc: 'Исторический доходный дом 1910 года, полностью реновированный. Сохранены исторические детали: паркет в ёлочку, каминный зал, лепные потолки 3.6 м. Большой эркер с видом на зелёный двор. В пешей доступности от Кронверкской набережной.',
        features: ['Высокие потолки 3.6м', 'Исторический дом', 'Камин оригинальный', 'Паркет ёлочка', 'Эркер', 'Лепнина'],
        agent: 'Ан. Соколова'
    },
    {
        id: 8, city: 'spb', district: 'nevsky', districtName: 'Невский проспект',
        type: 'penthouse',
        title: 'Пентхаус на Невском с панорамной террасой',
        address: 'Невский проспект, 88',
        price: 145000000, priceM2: 650000,
        area: 223, rooms: 4, floor: 9, totalFloors: 9,
        deal: 'buy', isNew: false, isHot: true, hasParking: true, hasTerrace: true, nearMetro: true, isGated: false,
        img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
        desc: 'Пентхаус на последнем этаже дома в центре Невского проспекта. Частная терраса 80 кв.м с видом на купола и соборы Петербурга. После дизайнерского ремонта. Умный дом, лифт с прямым выходом в квартиру, паркинг.',
        features: ['Терраса 80 кв.м', 'Вид на соборы', 'Умный дом', 'Прямой лифт', 'Паркинг', 'Камин', 'Джакузи'],
        agent: 'Иг. Петров'
    },
    {
        id: 9, city: 'spb', district: 'vasilevsky', districtName: 'Василеостровский район',
        type: 'apartment',
        title: 'Квартира в ЖК «Морской фасад»',
        address: 'Наличная улица, 33к1',
        price: 42000000, priceM2: 350000,
        area: 120, rooms: 3, floor: 8, totalFloors: 22,
        deal: 'buy', isNew: true, isHot: false, hasParking: true, hasTerrace: false, nearMetro: false, isGated: true,
        img: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80',
        desc: 'Квартира в новом жилом комплексе у Финского залива. Прекрасная планировка, видовые окна. Современный двор с детской площадкой и зонами отдыха. Открытие нового станции метро «Морской фасад» запланировано рядом.',
        features: ['Новостройка', 'Вид на залив', 'Закрытый двор', 'Детская площадка', 'Паркинг', 'Рядом метро'],
        agent: 'Ан. Соколова'
    },
    {
        id: 10, city: 'moscow', district: 'patriarshie', districtName: 'Патриаршие пруды',
        type: 'penthouse',
        title: 'Пентхаус с эксплуатируемой кровлей',
        address: 'Спиридоновка улица, 7',
        price: 185000000, priceM2: 710000,
        area: 260, rooms: 5, floor: 7, totalFloors: 7,
        deal: 'buy', isNew: false, isHot: true, hasParking: true, hasTerrace: true, nearMetro: true, isGated: true,
        img: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80',
        desc: 'Великолепный пентхаус с эксплуатируемой кровлей 90 кв.м. Собственная терраса с летней кухней и джакузи. Три парковочных места в подземном гараже. Два уровня с отдельными входами для жильцов и гостей.',
        features: ['Кровля 90 кв.м', 'Летняя кухня', 'Джакузи', 'Паркинг ×3', 'Два уровня', '5 санузлов', 'Умный дом'],
        agent: 'Дм. Морозов'
    },
    {
        id: 11, city: 'moscow', district: 'arbat', districtName: 'Арбат / Хамовники',
        type: 'apartment',
        title: 'Квартира у Нескучного сада',
        address: 'Ленинский проспект, 6',
        price: 54000000, priceM2: 450000,
        area: 120, rooms: 3, floor: 6, totalFloors: 12,
        deal: 'rent', isNew: false, isHot: false, hasParking: true, hasTerrace: false, nearMetro: true, isGated: false,
        img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
        desc: 'Светлая просторная квартира с качественным ремонтом. Балкон с видом на Нескучный сад. Развитая инфраструктура района: школы, рестораны, фитнес. До метро Парк Культуры 7 минут пешком.',
        features: ['Качественный ремонт', 'Балкон', 'Вид на парк', 'Метро 7 мин', 'Паркинг'],
        agent: 'Иг. Петров'
    },
    {
        id: 12, city: 'spb', district: 'krestovsky', districtName: 'Крестовский остров',
        type: 'apartments',
        title: 'Апартаменты в ЖК «Крестовский Де Люкс»',
        address: 'Крестовский остров, 4-й Предпортовый проезд',
        price: 89000000, priceM2: 620000,
        area: 143, rooms: 3, floor: 12, totalFloors: 20,
        deal: 'buy', isNew: true, isHot: false, hasParking: true, hasTerrace: true, nearMetro: false, isGated: true,
        img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
        desc: 'Апартаменты в новом элитном жилом комплексе на Крестовском острове. Панорамные виды на залив и город. Отделка от застройщика: итальянская плитка, паркет из дуба, встроенная кухня Miele.',
        features: ['Отделка от застройщика', 'Кухня Miele', 'Парковка', 'Консьерж', 'Фитнес', 'СПА', 'Вид на залив'],
        agent: 'Ан. Соколова'
    },
];

const NEWBUILDS = [
    { name: 'ЖК «Небо»', district: 'Москва-Сити', priceFrom: 45000000, img: 'https://images.unsplash.com/photo-1597423244036-ef5020e83f3c?auto=format&fit=crop&w=600&q=80', badge: 'Сдача 2026', detail: '38 этажей • Квартиры от 60 м²' },
    { name: 'ЖК «Северная Корона»', district: 'Крестовский остров, СПб', priceFrom: 32000000, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80', badge: 'Сдача 2025', detail: '22 этажа • Апартаменты от 45 м²' },
    { name: 'Клубный дом «Тихий дворик»', district: 'Патриаршие пруды, Мск', priceFrom: 85000000, img: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=600&q=80', badge: 'Сдача 2026', detail: '9 этажей • Только 24 квартиры' },
    { name: 'ЖК «Морской Фасад»', district: 'Васильевский остров, СПб', priceFrom: 18000000, img: 'https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?auto=format&fit=crop&w=600&q=80', badge: 'Сдача 2027', detail: '16 этажей • Вид на залив' },
];

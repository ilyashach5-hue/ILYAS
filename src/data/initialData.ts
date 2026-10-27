import { Product, SiteSettings, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'bag-01',
    name: 'حقيبة ظهر مدرسية فاخرة',
    nameFr: 'Sac à Dos Scolaire Luxueux',
    category: 'مدرسية وجامعية',
    categoryFr: 'Scolaire & Université',
    price: 199,
    originalPrice: 299,
    discountPercent: 33,
    rating: 4.9,
    reviewCount: 142,
    image: '/src/assets/images/backpack_school_luxury_1793111400534.jpg',
    badges: ['الأكثر طلباً', 'تخفيض 33%'],
    badgesFr: ['Plus Demandé', '-33%'],
    specBadge: 'سعة 24L · لابتوب 14" · قماش كانفاس متين',
    specBadgeFr: 'Capacité 24L · Laptop 14" · Toile Premium',
    featureBadge: 'ضمان سنتين · شحن مجاني',
    featureBadgeFr: 'Garantie 2 ans · Livraison Gratuite',
    description: 'حقيبة مدرسية وأكاديمية متقنة الصنع من قماش الكانفاس المقاوم والجلد الطبيعي مع جيوب متعددة لتنظيم الكتب والأجهزة ومقلمة مدمجة.',
    descriptionFr: 'Sac à dos académique d\'élite en toile résistante et finitions cuir véritable, multi-compartiments ergonomiques.',
    stock: 14,
    colors: [
      { name: 'كحلي مع جلد بني', nameFr: 'Bleu Marine & Cuir', hex: '#1E293B', inStock: true },
      { name: 'أسود كلاسيكي', nameFr: 'Noir Classique', hex: '#0F172A', inStock: true },
      { name: 'رمادي غامق', nameFr: 'Gris Anthracite', hex: '#334155', inStock: true }
    ],
    specs: {
      capacity: '24 لتر',
      laptopSize: 'حتى 14.1 بوصة',
      waterproof: true,
      weight: '780 غرام',
      dimensions: '42 × 30 × 14 سم',
      material: 'كانفاس عالي الكثافة + جلد صناعي فاخر'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: 'bag-02',
    name: 'حقيبة ظهر للحاسوب المحمول',
    nameFr: 'Sac à Dos Ordinateur Portable Pro',
    category: 'رجال أعمال وتقنية',
    categoryFr: 'Business & Tech',
    price: 249,
    originalPrice: 360,
    discountPercent: 31,
    rating: 4.95,
    reviewCount: 218,
    image: '/src/assets/images/backpack_executive_laptop_1793111382702.jpg',
    badges: ['اختيار المحترفين', 'حماية صدمات'],
    badgesFr: ['Choix Pro', 'Anti-Choc'],
    specBadge: 'سعة 26L · لابتوب 15.6" · منفذ USB للشحن',
    specBadgeFr: 'Capacité 26L · Laptop 15.6" · Port USB',
    featureBadge: 'مقاومة الماء بالكامل · تصميم خفي ضد السرقة',
    featureBadgeFr: '100% Imperméable · Sécurité Antivol',
    description: 'حقيبة أعمال تنفيذية فائقة الأناقة مصممة خصيصاً لحماية الحواسيب المحمولة والأجهزة اللوحية مع بطانة إسفنجية ثلاثية الأبعاد.',
    descriptionFr: 'Sac d\'affaires exécutif ultra-élégant avec protection antichoc 3D pour laptop 15.6", matériaux déperlants et port USB.',
    stock: 9,
    colors: [
      { name: 'أسود كربوني مع لمسات ذهبية', nameFr: 'Noir Carbone Or', hex: '#111111', inStock: true },
      { name: 'رمادي تيتانيوم', nameFr: 'Gris Titane', hex: '#262626', inStock: true }
    ],
    specs: {
      capacity: '26 لتر',
      laptopSize: 'حتى 15.6 بوصة',
      waterproof: true,
      weight: '890 غرام',
      dimensions: '45 × 32 × 16 سم',
      material: 'نايلون باليستي 1680D مقاوم للخدش'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: 'bag-03',
    name: 'حقيبة ظهر للسفر متعددة الجيوب',
    nameFr: 'Sac à Dos Voyage Multi-Poches Expédition',
    category: 'سفر ومغامرات',
    categoryFr: 'Voyage & Aventure',
    price: 349,
    originalPrice: 490,
    discountPercent: 29,
    rating: 4.88,
    reviewCount: 95,
    image: '/src/assets/images/backpack_travel_adventure_1793111383080.jpg',
    badges: ['مقصورة طائرة معتمدة', 'سعة ضخمة'],
    badgesFr: ['Cabine Avion', 'Grande Capacité'],
    specBadge: 'سعة 40L قابلة للتمدد · جيب للأحذية · أحزمة تثبيت',
    specBadgeFr: 'Capacité 40L Extensible · Compartiment Chaussures',
    featureBadge: 'فتح 180 درجة كحقيبة السفر · مقاومة للأمطار',
    featureBadgeFr: 'Ouverture 180° Valise · Pluie Résistante',
    description: 'رفيق السفر المثالي للرحلات القصيرة والطويلة، تفتح بزاوية 180 درجة كحقائب السفر مع جيب سفلي منفصل للأحذية وأحزمة ضغط لتقليص الحجم.',
    descriptionFr: 'Le compagnon de voyage ultime. Ouverture valise 180°, poche séparée pour chaussures et sangles de compression.',
    stock: 6,
    colors: [
      { name: 'رمادي غرافيت غير لامع', nameFr: 'Gris Graphite Mat', hex: '#27272a', inStock: true },
      { name: 'أسود تكتيكي', nameFr: 'Noir Tactique', hex: '#18181b', inStock: true },
      { name: 'أخضر عسكري زيتي', nameFr: 'Vert Olive Kaki', hex: '#2e382d', inStock: true }
    ],
    specs: {
      capacity: '40 لتر (قابلة للتمدد إلى 45L)',
      laptopSize: 'حتى 17 بوصة',
      waterproof: true,
      weight: '1150 غرام',
      dimensions: '52 × 34 × 20 سم',
      material: 'أكسفورد 900D المقوى والمضاد للتمزق'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: 'bag-04',
    name: 'حقيبة ظهر رياضية عصرية',
    nameFr: 'Sac à Dos Sport Moderne & Fitness',
    category: 'رياضة ولياقة',
    categoryFr: 'Sport & Fitness',
    price: 179,
    originalPrice: 250,
    discountPercent: 28,
    rating: 4.85,
    reviewCount: 88,
    image: '/src/assets/images/backpack_sport_active_1793111400698.jpg',
    badges: ['تهوية مريحة', 'جيب أحذية'],
    badgesFr: ['Aération Dos', 'Poche Baskets'],
    specBadge: 'سعة 28L · جيب مخصص للحذاء · حامل قارورة ماء',
    specBadgeFr: 'Capacité 28L · Emplacement Chaussures · Gourde',
    featureBadge: 'أحزمة مبطنة مريحة للأكتاف · سحابات ذهبية متينة',
    featureBadgeFr: 'Bretelles Aérées · Zips Dorés Robustes',
    description: 'حقيبة رياضية أنيقة تجمع بين العملية والفخامة، مزودة بجيب سفلي مزود بفتحات تهوية لحذاء التدريب وجيوب سريعة لملحقات التمرين.',
    descriptionFr: 'Sac de sport chic et fonctionnel avec compartiment respirant pour baskets et poches d\'accès rapide.',
    stock: 18,
    colors: [
      { name: 'أسود مطفأ مع سحابات ذهبية', nameFr: 'Noir Mat Zips Or', hex: '#1c1917', inStock: true },
      { name: 'كحلي رياضي', nameFr: 'Bleu Sportif', hex: '#1e3a8a', inStock: true }
    ],
    specs: {
      capacity: '28 لتر',
      laptopSize: 'حتى 15 بوصة',
      waterproof: true,
      weight: '690 غرام',
      dimensions: '44 × 31 × 18 سم',
      material: 'بوليستر تقني خفيف الوزن ومقاوم للعرق'
    },
    featured: false,
    bestSeller: false
  },
  {
    id: 'bag-05',
    name: 'حقيبة ظهر للأطفال',
    nameFr: 'Sac à Dos Ergonomique Enfants',
    category: 'أطفال وناشئة',
    categoryFr: 'Enfants & Juniors',
    price: 159,
    originalPrice: 220,
    discountPercent: 28,
    rating: 4.92,
    reviewCount: 110,
    image: '/src/assets/images/backpack_kids_comfort_1793111400957.jpg',
    badges: ['صحي للعمود الفقري', 'خطوط عاكسة'],
    badgesFr: ['Dos Orthopédique', 'Bandes Réfléchissantes'],
    specBadge: 'سعة 18L · حزام تثبيت للصدر · دعم طبي للظهر',
    specBadgeFr: 'Capacité 18L · Sangle Poitrine · Support Dorsal',
    featureBadge: 'خفيفة الوزن 520g · أشرطة أمان ليلية فوسفورية',
    featureBadgeFr: 'Poids Plume 520g · Sécurité Nocturne',
    description: 'صُممت بالتعاون مع أطباء تقويم العظام لتوزيع الوزن بالتساوي على أكتاف وظهور الأطفال مع عواكس ضوئية للسلامة على الطرق.',
    descriptionFr: 'Conception ergonomique protégeant la colonne vertébrale des écoliers avec bandes réfléchissantes de sécurité.',
    stock: 22,
    colors: [
      { name: 'أسود بحدود ذهبية', nameFr: 'Noir Bordures Or', hex: '#18181b', inStock: true },
      { name: 'أزرق كوني', nameFr: 'Bleu Cosmique', hex: '#1e293b', inStock: true }
    ],
    specs: {
      capacity: '18 لتر',
      laptopSize: 'مناسب لتابلت 10 بوصة ودفاتر',
      waterproof: true,
      weight: '520 غرام',
      dimensions: '38 × 28 × 15 سم',
      material: 'قماش صديق للبيئة معالج ضد البقع'
    },
    featured: false,
    bestSeller: false
  },
  {
    id: 'bag-06',
    name: 'حقيبة ظهر مقاومة للماء',
    nameFr: 'Sac à Dos 100% Étanche & All-Weather',
    category: 'مقاومة للماء وتقنية',
    categoryFr: 'Waterproof & Tech',
    price: 299,
    originalPrice: 399,
    discountPercent: 25,
    rating: 4.97,
    reviewCount: 164,
    image: '/src/assets/images/backpack_urban_minimalist_1793111383749.jpg',
    badges: ['حماية قصوى IPX6', 'جلد أسود ناعم'],
    badgesFr: ['Étanchéité IPX6', 'Cuir Doux'],
    specBadge: 'سعة 25L · سحابات حرارية معزولة · جيب ضد التردد RFID',
    specBadgeFr: 'Capacité 25L · Zips Thermosoudés · Poche RFID',
    featureBadge: 'تصميم أوروبي فاخر · حماية الأجهزة من الأمطار الغزيرة',
    featureBadgeFr: 'Style Européen · Protection Totale Pluie',
    description: 'حماية متقدمة ضد الأمطار الغزيرة والأتربة مع سحابات محكمة الغلق وجلد ناعم غير قابل للاختراق، تحافظ على أجهزتك جافة وآمنة في أي طقس.',
    descriptionFr: 'Protection imperméable intégrale avec zips thermocollés étanches et cuir vegan mat ultra-résistant.',
    stock: 11,
    colors: [
      { name: 'أسود مطفأ أونيكس', nameFr: 'Noir Onyx Mat', hex: '#0a0a0a', inStock: true },
      { name: 'كحلي منتصف الليل', nameFr: 'Bleu Nuit Profond', hex: '#0f172a', inStock: true }
    ],
    specs: {
      capacity: '25 لتر',
      laptopSize: 'حتى 16 بوصة (MacBook Pro)',
      waterproof: true,
      weight: '820 غرام',
      dimensions: '44 × 30 × 14 سم',
      material: 'جلد بولي يوريثان ناعم مطلي بـ TPU المانع للتسرب'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: 'bag-07',
    name: 'حقيبة ظهر نسائية أنيقة',
    nameFr: 'Sac à Dos Femme Chic Haute Couture',
    category: 'نسائية وأزياء',
    categoryFr: 'Femmes & Mode',
    price: 229,
    originalPrice: 320,
    discountPercent: 28,
    rating: 4.93,
    reviewCount: 175,
    image: '/src/assets/images/backpack_women_chic_1793111401185.jpg',
    badges: ['تصميم ملكي', 'سلسلة ذهبية'],
    badgesFr: ['Design Royal', 'Chaîne Dorée'],
    specBadge: 'سعة 16L · قفل ذهبي مغناطيسي · جلد بيبي كالف ناعم',
    specBadgeFr: 'Capacité 16L · Fermoir Doré · Cuir Souple',
    featureBadge: 'خفيفة وأنيقة للعمل والخروج · إطلالة راقية',
    featureBadgeFr: 'Légère & Chic · Style Haute Couture',
    description: 'حقيبة نسائية مفعمة بالأنوثة والرقي مع أقفال وحلي معدنية مطلية بالذهب وقوام متماسك يحافظ على رونقه لسنوات عديدة.',
    descriptionFr: 'Élégance féminine et finitions bijouterie dorée haut de gamme. Parfaite pour le quotidien et les sorties chics.',
    stock: 8,
    colors: [
      { name: 'أسود ملكي بقفل ذهبي', nameFr: 'Noir Royal & Or', hex: '#0c0a09', inStock: true },
      { name: 'بني عسلي كلاسيكي', nameFr: 'Miel Caramel', hex: '#78350f', inStock: true },
      { name: 'أبيض لؤلؤي', nameFr: 'Blanc Perle', hex: '#f8fafc', inStock: true }
    ],
    specs: {
      capacity: '16 لتر',
      laptopSize: 'مناسب للآيباد وجهاز 13 بوصة',
      waterproof: true,
      weight: '640 غرام',
      dimensions: '36 × 28 × 13 سم',
      material: 'جلد إيطالي معالج عالي النعومة'
    },
    featured: true,
    bestSeller: true
  },
  {
    id: 'bag-08',
    name: 'حقيبة ظهر متعددة الاستعمالات',
    nameFr: 'Sac à Dos Hybride Multi-Usages',
    category: 'حضرية ومتعددة الاستخدام',
    categoryFr: 'Urbain & Quotidien',
    price: 269,
    originalPrice: 370,
    discountPercent: 27,
    rating: 4.9,
    reviewCount: 133,
    image: '/src/assets/images/hero_luxury_backpack_1793111382060.jpg',
    badges: ['الأكثر تنوعاً', 'شحن لاسلكي'],
    badgesFr: ['Le Plus Polyvalent', 'Pack Complet'],
    specBadge: 'سعة 30L · 12 جيباً ذكياً · إمكانية حملها كحقيبة يد',
    specBadgeFr: 'Capacité 30L · 12 Poches · Porté Main ou Dos',
    featureBadge: 'ملائمة للعمل والرياضة والرحلات الخفيفة · ضمان سنتين',
    featureBadgeFr: 'Idéal Travail, Gym et Weekend · Garanti 2 ans',
    description: 'الحل الشامل لكل يوم: يمكنك التحول بسلاسة بين حقيبة الظهر للدوام وحقيبة اليد للاجتماعات، مع تنظيم ذكي لكل متعلقاتك الشخصية والتقنية.',
    descriptionFr: 'Le sac hybride passe-partout. Se transforme en mallette en rentrant les bretelles. 12 compartiments dédiés.',
    stock: 12,
    colors: [
      { name: 'أسود فحمي فاخر', nameFr: 'Noir Charbon Luxe', hex: '#171717', inStock: true },
      { name: 'أزرق كحلي أكسفورد', nameFr: 'Bleu Oxford', hex: '#1e293b', inStock: true }
    ],
    specs: {
      capacity: '30 لتر',
      laptopSize: 'حتى 15.6 بوصة',
      waterproof: true,
      weight: '920 غرام',
      dimensions: '46 × 32 × 17 سم',
      material: 'نسيج أكسفورد نافر مقاوم للماء والتمزق'
    },
    featured: true,
    bestSeller: false
  }
];

export const MOROCCAN_CITIES = [
  'الدار البيضاء (Casablanca)',
  'الرباط (Rabat)',
  'مراكش (Marrakech)',
  'طنجة (Tanger)',
  'فاس (Fès)',
  'أكادير (Agadir)',
  'القنيطرة (Kénitra)',
  'وجدة (Oujda)',
  'مكناس (Meknès)',
  'تطوان (Tétouan)',
  'تمارة (Témara)',
  'سلا (Salé)',
  'الجديدة (El Jadida)',
  'الناظور (Nador)',
  'بني ملال (Béni Mellal)',
  'خريبكة (Khouribga)',
  'المحمدية (Mohammédia)',
  'آسفي (Safi)',
  'العرائش (Larache)',
  'برشيد (Berrechid)',
  'ورزازات (Ouarzazate)',
  'الداخلة (Dakhla)',
  'العيون (Laâyoune)',
  'تازة (Taza)',
  'كلميم (Guelmim)',
  'الصويرة (Essaouira)'
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'bag-02',
    author: 'أنس المرابط',
    city: 'الدار البيضاء',
    rating: 5,
    date: 'منذ 3 أيام',
    comment: 'صراحة جودة خيالية! السحاب والجلد متقونين بزاف واللابتوب ديالي 15.6 محمّي مزيان مع رغوة الصدمات. التوصيل كان في 24 ساعة للدار البيضاء وتخلصت حتى شفتها وعجباتني.',
    verified: true
  },
  {
    id: 'rev-02',
    productId: 'bag-03',
    author: 'مريم بنجلون',
    city: 'الرباط',
    rating: 5,
    date: 'منذ 5 أيام',
    comment: 'حقيبة السفر هادي حلات ليا مشكل الطيارة، كتهز حوايج ديال 4 أيام بسهولة وفيها بلاصة الصباط معزولة. كنشكر خدمة الزبناء عبر الواتساب على المعاملة الراقية.',
    verified: true
  },
  {
    id: 'rev-03',
    productId: 'bag-01',
    author: 'سعيد التازي',
    city: 'مراكش',
    rating: 5,
    date: 'منذ أسبوع',
    comment: 'شريت الحقيبة المدرسية لولدي في الجامعة، تصمميها كلاسيكي فاخر والكانفاس ديالها قاصح وصحيح. كتحمر الوجه وتستاهل ثمنها بكل صراحة.',
    verified: true
  },
  {
    id: 'rev-04',
    productId: 'bag-06',
    author: 'عمر الودغيري',
    city: 'طنجة',
    rating: 5,
    date: 'منذ أسبوعين',
    comment: 'جربتها في شتاء طنجة الغزير مع المطر، الأجهزة والأوراق الداخل بقات ناشفة 100%. منتج ممتاز وسرعة في التوصيل.',
    verified: true
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  storeName: 'BAGORA',
  storeNameFr: 'BAGORA',
  slogan: 'فخامة الحقائب المغربية بتصاميم استثنائية',
  sloganFr: 'L\'Excellence de la Maroquinerie et Sacs à Dos au Maroc',
  announcementText: 'توصيل مجاني وسريع لكافة مدن المغرب | الدفع عند الاستلام بعد معاينة الحقيبة | ضمان الجودة لمدة سنتين',
  announcementTextFr: 'Livraison gratuite partout au Maroc | Paiement à la livraison après inspection | Garantie 2 ans',
  whatsappNumber: '+212600112233',
  supportEmail: 'contact@bagora.ma',
  freeShippingThreshold: 0,
  heroTitle: 'حقائب ظهر فاخرة صُممت لتدوم مدى الحياة',
  heroTitleFr: 'Des Sacs à Dos d\'Exception Conçus Pour Durer',
  heroSubtitle: 'اكتشف التشكيلة الجديدة الحصرية لعام 2026. مزيج فريد بين الحرفية الراقية، المتانة القصوى، والتقنية الذكية لحماية أجهزتك في كل خطوة.',
  heroSubtitleFr: 'Découvrez la nouvelle collection 2026. L\'alliance parfaite du cuir haut de gamme, de l\'étanchéité totale et de l\'ergonomie professionnelle.',
  visibleSections: {
    announcement: true,
    hero: true,
    categories: true,
    featured: true,
    bestSellers: true,
    promoBanner: true,
    testimonials: true,
    faq: true,
    guarantees: true
  }
};

export const FAQS = [
  {
    q: 'كيف تتم عملية الدفع عند الاستلام (COD)؟',
    qFr: 'Comment fonctionne le Paiement à la Livraison ?',
    a: 'لا تدفع أي سنتيم مسبقاً! عند وصول موزع التوصيل إلى عنوانك بالمدينة المحددة، يمكنك فتح الطرد وفحص جودة الحقيبة والتأكد من مطابقتها لطلبك، ثم تسلم المبلغ للموزع نقداً.',
    aFr: 'Vous ne payez rien à l\'avance ! Vous inspectez le colis à la réception avec le livreur puis payez en espèces en toute sérénité.'
  },
  {
    q: 'كم تستغرق مدة التوصيل إلى مدينتي؟',
    qFr: 'Quels sont les délais de livraison ?',
    a: 'التوصيل سريع جداً: من 24 إلى 48 ساعة فقط للدار البيضاء والرباط ومراكش وطنجة وفاس وأكادير والمدن الكبرى، و48 إلى 72 ساعة كأقصى تقدير لباقي أرجاء المملكة الشريفة.',
    aFr: 'Livraison express en 24h à 48h sur les grandes villes (Casa, Rabat, Marrakech, Tanger, Fès, Agadir) et 48h à 72h max pour les autres régions.'
  },
  {
    q: 'هل الحقائب مقاومة للماء فعلاً؟',
    qFr: 'Les sacs sont-ils réellement imperméables ?',
    a: 'نعم، جميع حقائبنا تستعمل أقمشة معالجة بطبقات عازلة TPU وسحابات محكمة مانعة لتسرب الأمطار ورذاذ الماء، مع حماية فائقة للمقصورة المخصصة للحواسيب المحمولة.',
    aFr: 'Oui, nos sacs utilisent des toiles techniques déperlantes et des zips étanches garantissant la sécurité de vos ordinateurs et documents par tout temps.'
  },
  {
    q: 'ماذا لو أردت استبدال اللون أو إرجاع المنتج؟',
    qFr: 'Puis-je échanger la couleur ou retourner le produit ?',
    a: 'نوفر لك ضمان رضا 100%. لديك مهلة 14 يوماً كاملة لطلب استبدال مجاني للمقاس أو اللون أو حتى استرجاع نقودك إذا لم تطابق الحقيبة توقعاتك.',
    aFr: 'Garantie satisfait ou remboursé sous 14 jours. Échange gratuit de couleur ou modèle sur simple contact WhatsApp.'
  }
];

export const INITIAL_THEME_CONFIG: import('../types').ThemeConfig = {
  primaryGold: '#D4AF37',
  brightGold: '#F4BE16',
  bgMain: '#0D0A08',
  bgCard: '#120E0B',
  textWhite: '#FFFFFF',
  textMuted: '#B5ADA5',
  fontFamily: 'Cairo',
  fontSize: '16px',
  borderRadius: '24px',
  cardStyle: 'bordered-gold',
  gridColumnsDesktop: 4,
  animationSpeed: 'normal',
  mobileSpacing: 'normal'
};

export const INITIAL_BUILDER_SECTIONS: import('../types').BuilderSection[] = [
  {
    id: 'sec-announcement',
    type: 'announcement',
    name: 'شريط الإعلانات العلوي',
    visible: true,
    content: {
      text: 'توصيل مجاني وسريع لكافة مدن المغرب | الدفع عند الاستلام بعد معاينة الحقيبة | ضمان الجودة لمدة سنتين',
      textFr: 'Livraison gratuite partout au Maroc | Paiement à la livraison après inspection | Garantie 2 ans',
      badge: 'عرض خاص 2026',
      badgeFr: 'Offre Spéciale',
      showSupportNumber: true
    },
    styles: {
      paddingY: '8px',
      bgColor: '#17110c',
      textColor: '#E5D2A8',
      accentColor: '#F4BE16'
    }
  },
  {
    id: 'sec-header',
    type: 'header',
    name: 'الهيدر والشعار والقائمة',
    visible: true,
    content: {
      logoText: 'BAGORA',
      logoSubtitle: 'حقائب مغربية فاخرة',
      logoSubtitleFr: 'Maroquinerie De Luxe',
      showSearch: true,
      showAssistantButton: true,
      showCompareButton: true,
      showWishlistButton: true,
      showCartButton: true,
      showThemeToggle: true,
      showLangToggle: true
    },
    styles: {
      bgColor: '#0D0A08',
      textColor: '#FFFFFF',
      accentColor: '#D4AF37'
    }
  },
  {
    id: 'sec-hero',
    type: 'hero',
    name: 'البانر الرئيسي (Hero Section)',
    visible: true,
    content: {
      kickerBadge: 'المجموعة الملكية الجديدة 2026',
      kickerBadgeFr: 'Nouvelle Collection Royale 2026',
      title: 'حقائب ظهر فاخرة صُممت لتدوم مدى الحياة',
      titleFr: 'Des Sacs à Dos d\'Exception Conçus Pour Durer',
      subtitle: 'اكتشف التشكيلة الجديدة الحصرية لعام 2026. مزيج فريد بين الحرفية الراقية، المتانة القصوى، والتقنية الذكية لحماية أجهزتك في كل خطوة.',
      subtitleFr: 'Découvrez la nouvelle collection 2026. L\'alliance parfaite du cuir haut de gamme, de l\'étanchéité totale et de l\'ergonomie professionnelle.',
      primaryButtonLabel: 'تسوق التشكيلة الآن',
      primaryButtonLabelFr: 'Explorer la Collection',
      primaryButtonUrl: '#collection-grid',
      secondaryButtonLabel: 'ساعدني في اختيار حقيبتي',
      secondaryButtonLabelFr: 'Aide-moi à choisir',
      heroImage: '/src/assets/images/hero_luxury_backpack_1793111382060.jpg',
      showGuaranteesPills: true,
      showCustomerCounter: true
    },
    styles: {
      paddingY: '56px',
      bgColor: '#0D0A08',
      textColor: '#FFFFFF',
      accentColor: '#F4BE16',
      borderRadius: '26px'
    }
  },
  {
    id: 'sec-guarantees',
    type: 'guarantees',
    name: 'أعمدة الثقة والضمان بالمغرب',
    visible: true,
    content: {
      item1Title: 'توصيل سريع مجاني بالمغرب',
      item1Desc: 'توصيل من 24 إلى 48 ساعة فقط للدار البيضاء والرباط ومراكش وطنجة وكافة المدن.',
      item2Title: 'الدفع عند الاستلام بعد المعاينة',
      item2Desc: 'افتح الطرد وتأكد من جودة الحقيبة قبل تسليم أي مبلغ للموزع بكل أمان.',
      item3Title: 'ضمان الجودة والمتانة سنتين',
      item3Desc: 'سحابات يابانية متينة وأقمشة معالجة ضد التمزق وتسرّب الأمطار.',
      item4Title: 'استبدال مجاني خلال 14 يوماً',
      item4Desc: 'إمكانية تغيير اللون أو الموديل عبر الواتساب في دقائق معدودة.'
    },
    styles: {
      paddingY: '48px',
      bgColor: '#0A0806',
      textColor: '#FFFFFF',
      accentColor: '#F4BE16',
      borderRadius: '22px'
    }
  },
  {
    id: 'sec-categories',
    type: 'categories',
    name: 'شريط تصنيفات الحقائب',
    visible: true,
    content: {
      title: 'تصفح حسب التصنيف',
      titleFr: 'Parcourir par catégorie'
    },
    styles: {
      paddingY: '16px',
      bgColor: '#0D0A08'
    }
  },
  {
    id: 'sec-grid',
    type: 'grid',
    name: 'شبكة المنتجات (4 بطاقات بالصف)',
    visible: true,
    content: {
      sectionKicker: 'تشكيلة باغورا الفاخرة',
      sectionKickerFr: 'Collection Exclusive BAGORA',
      title: 'اختر حقيبتك المثالية مع الدفع عند الاستلام',
      titleFr: 'Trouvez le Sac Idéal · Paiement à la Livraison',
      subtitle: 'توصيل مجاني خلال 24 إلى 48 ساعة مع إمكانية فتح الطرد والمعاينة قبل الدفع',
      subtitleFr: 'Livraison gratuite 24/48h avec possibilité d\'ouvrir et inspecter avant de payer',
      desktopColumns: 4,
      showQuickView: true,
      showCompare: true,
      showWishlist: true,
      showColorSwatches: true
    },
    styles: {
      paddingY: '48px',
      bgColor: '#0D0A08',
      textColor: '#FFFFFF',
      accentColor: '#F4BE16',
      borderRadius: '24px'
    }
  },
  {
    id: 'sec-banner-duo',
    type: 'banner_duo',
    name: 'بانر عرض الثنائيات (Pack Duo)',
    visible: true,
    content: {
      badge: 'عرض خاص محدود بالمغرب',
      badgeFr: 'Offre Spéciale Limitée',
      title: 'عرض الثنائيات: احصل على حقيبتين واستفد من خصم إضافي 10%!',
      titleFr: 'Pack Duo : Commandez 2 sacs et profitez de -10% de remise immédiate !',
      description: 'وفر أكثر عند طلب حقيبتين (لك ولصديقك أو للدراسة والعمل). التوصيل مجاني 100% لجميع المدن المغربية والدفع عند الاستلام بعد فحص الحقائب.',
      descriptionFr: 'Économisez sur votre commande groupée. Livraison 100% offerte partout au Maroc avec paiement à la réception.',
      buttonText: 'اختر حقائبك الآن',
      buttonTextFr: 'Choisir mes 2 sacs',
      image: '/src/assets/images/backpack_executive_laptop_1793111382702.jpg',
      discountTag: 'خصم 10% فوري'
    },
    styles: {
      paddingY: '40px',
      bgColor: '#17110c',
      textColor: '#FFFFFF',
      accentColor: '#F4BE16',
      borderRadius: '28px'
    }
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    name: 'آراء وتقييمات الزبائن',
    visible: true,
    content: {
      badge: 'تجارب الزبائن بالمغرب',
      badgeFr: 'Témoignages Vérifiés',
      title: 'ماذا يقول زبناؤنا الكرام في مختلف المدن المغربية؟',
      titleFr: 'Avis de nos clients à travers le Maroc',
      subtitle: 'تقييمات حقيقية من زبائن استلموا وفحصوا حقائبهم ودفعوا عند الاستلام',
      subtitleFr: 'Commentaires authentiques de clients livrés à domicile'
    },
    styles: {
      paddingY: '56px',
      bgColor: '#0D0A08',
      textColor: '#FFFFFF',
      accentColor: '#F4BE16'
    }
  },
  {
    id: 'sec-faq',
    type: 'faq',
    name: 'قسم الأسئلة الشائعة (FAQ)',
    visible: true,
    content: {
      badge: 'كل ما تحتاج معرفته',
      badgeFr: 'Questions Fréquentes',
      title: 'الأسئلة الشائعة حول الطلب والتوصيل',
      titleFr: 'Foire Aux Questions',
      subtitle: 'إجابات واضحة حول طريقة الدفع عند الاستلام، مدة الشحن، وفحص الطرد'
    },
    styles: {
      paddingY: '56px',
      bgColor: '#0A0806',
      textColor: '#FFFFFF',
      accentColor: '#F4BE16'
    }
  },
  {
    id: 'sec-footer',
    type: 'footer',
    name: 'الفوتر وحقوق النشر',
    visible: true,
    content: {
      brandName: 'BAGORA',
      slogan: 'فخامة الحقائب المغربية بتصاميم استثنائية',
      cityAddress: 'الدار البيضاء، المملكة المغربية',
      showLogisticsLogos: true,
      copyrightText: 'جميع الحقوق محفوظة © 2026 BAGORA المملكة المغربية'
    },
    styles: {
      bgColor: '#080605',
      textColor: '#B5ADA5',
      accentColor: '#D4AF37'
    }
  }
];

export const INITIAL_DISCOUNTS: import('../types').Discount[] = [
  {
    id: 'disc-01',
    code: 'BAGORA10',
    type: 'percentage',
    value: 10,
    minSpend: 200,
    active: true,
    usageCount: 48
  },
  {
    id: 'disc-02',
    code: 'MAROC',
    type: 'percentage',
    value: 15,
    minSpend: 400,
    active: true,
    usageCount: 19
  },
  {
    id: 'disc-03',
    code: 'RAMADAN30',
    type: 'fixed',
    value: 30,
    minSpend: 300,
    active: true,
    usageCount: 12
  }
];

export const INITIAL_CUSTOMERS: import('../types').Customer[] = [
  {
    id: 'cust-01',
    name: 'محمد الإدريسي',
    phone: '0661234567',
    city: 'الدار البيضاء (Casablanca)',
    address: 'حي المعاريف، شارع المسيرة الخضراء',
    ordersCount: 2,
    totalSpent: 498,
    lastOrderDate: '2026-10-27'
  },
  {
    id: 'cust-02',
    name: 'فاطمة الزهراء بنسودة',
    phone: '0678901234',
    city: 'الرباط (Rabat)',
    address: 'حي أكدال، زنقة واد فاس إقامة الأندلس',
    ordersCount: 1,
    totalSpent: 229,
    lastOrderDate: '2026-10-26'
  },
  {
    id: 'cust-03',
    name: 'حمزة بناني',
    phone: '0650998877',
    city: 'مراكش (Marrakech)',
    address: 'شارع محمد السادس، جليز',
    ordersCount: 3,
    totalSpent: 797,
    lastOrderDate: '2026-10-24'
  },
  {
    id: 'cust-04',
    name: 'سارة العلمي',
    phone: '0663445566',
    city: 'طنجة (Tanger)',
    address: 'إقامة مالاباطا فيو، كورنيش طنجة',
    ordersCount: 1,
    totalSpent: 349,
    lastOrderDate: '2026-10-22'
  }
];

export const INITIAL_MEDIA: import('../types').MediaItem[] = [
  {
    id: 'med-01',
    title: 'حقيبة BAGORA الرئيسية الملكية',
    url: '/src/assets/images/hero_luxury_backpack_1793111382060.jpg',
    category: 'backpacks',
    size: '1.4 MB',
    createdAt: '2026-10-27'
  },
  {
    id: 'med-02',
    title: 'حقيبة الحاسوب المحمول التنفيذية',
    url: '/src/assets/images/backpack_executive_laptop_1793111382702.jpg',
    category: 'backpacks',
    size: '1.1 MB',
    createdAt: '2026-10-27'
  },
  {
    id: 'med-03',
    title: 'حقيبة السفر والمقصورة 40L',
    url: '/src/assets/images/backpack_travel_adventure_1793111383080.jpg',
    category: 'backpacks',
    size: '1.3 MB',
    createdAt: '2026-10-27'
  },
  {
    id: 'med-04',
    title: 'حقيبة ظهر مدرسية وأكاديمية',
    url: '/src/assets/images/backpack_school_luxury_1793111400534.jpg',
    category: 'backpacks',
    size: '1.2 MB',
    createdAt: '2026-10-27'
  },
  {
    id: 'med-05',
    title: 'حقيبة ظهر رياضية ولياقة',
    url: '/src/assets/images/backpack_sport_active_1793111400698.jpg',
    category: 'backpacks',
    size: '1.0 MB',
    createdAt: '2026-10-27'
  },
  {
    id: 'med-06',
    title: 'حقيبة الأطفال المريحة',
    url: '/src/assets/images/backpack_kids_comfort_1793111400957.jpg',
    category: 'backpacks',
    size: '1.1 MB',
    createdAt: '2026-10-27'
  },
  {
    id: 'med-07',
    title: 'حقيبة نسائية أنيقة Haute Couture',
    url: '/src/assets/images/backpack_women_chic_1793111401185.jpg',
    category: 'backpacks',
    size: '1.3 MB',
    createdAt: '2026-10-27'
  },
  {
    id: 'med-08',
    title: 'حقيبة مقاومة للماء 100% جلد مطفي',
    url: '/src/assets/images/backpack_urban_minimalist_1793111383749.jpg',
    category: 'backpacks',
    size: '1.2 MB',
    createdAt: '2026-10-27'
  }
];

export const INITIAL_PAGES: import('../types').CustomPage[] = [
  {
    id: 'page-01',
    slug: 'about-us',
    title: 'قصة علامة BAGORA',
    titleFr: 'À Propos de BAGORA',
    content: 'تأسست BAGORA بهدف تقديم حقائب ظهر فاخرة تجمع بين الأناقة الملكية والعملية التقنية العالية لرجال الأعمال والمسافرين والطلاب في المغرب.',
    isPublished: true,
    updatedAt: '2026-10-27'
  },
  {
    id: 'page-02',
    slug: 'shipping-returns',
    title: 'سياسة التوصيل والاسترجاع',
    titleFr: 'Livraison & Retours',
    content: 'التوصيل مجاني 100% لجميع مدن المغرب خلال 24-48 ساعة. يحق للزبون فحص الطرد قبل الدفع والاستبدال مجاني خلال 14 يوماً.',
    isPublished: true,
    updatedAt: '2026-10-27'
  },
  {
    id: 'page-03',
    slug: 'terms',
    title: 'الشروط والأحكام',
    titleFr: 'Conditions Générales',
    content: 'جميع المنتجات أصلية ومضمونة لسنتين كاملتين ضد عيوب الصناعة.',
    isPublished: true,
    updatedAt: '2026-10-27'
  }
];

export const INITIAL_NAVIGATION: import('../types').NavigationMenus = {
  headerMenu: [
    { id: 'nav-01', label: 'الرئيسية', labelFr: 'Accueil', url: '#' },
    { id: 'nav-02', label: 'كل الحقائب', labelFr: 'Boutique', url: '#collection-grid' },
    { id: 'nav-03', label: 'حقائب اللابتوب', labelFr: 'Business', url: '#collection-grid' },
    { id: 'nav-04', label: 'حقائب السفر', labelFr: 'Voyage', url: '#collection-grid' },
    { id: 'nav-05', label: 'الأسئلة الشائعة', labelFr: 'FAQ', url: '#faq' }
  ],
  footerMenu: [
    { id: 'fnav-01', label: 'قصتنا', url: '#about' },
    { id: 'fnav-02', label: 'سياسة الاسترجاع', url: '#shipping' },
    { id: 'fnav-03', label: 'شروط الخدمة', url: '#terms' },
    { id: 'fnav-04', label: 'تواصل معنا', url: '#contact' }
  ]
};

export const INITIAL_SEO: import('../types').SeoSettings = {
  metaTitle: 'BAGORA | المتجر المغربي الأول للحقائب الفاخرة والدفع عند الاستلام',
  metaDescription: 'حقائب ظهر فاخرة للحاسوب المحمول، السفر، والمدرسة مع التوصيل المجاني لكافة مدن المغرب والدفع نقداً عند الاستلام بعد المعاينة.',
  keywords: 'حقائب ظهر المغرب, sacs à dos maroc, cartables casablanca, sac pc portable rabat, bagora',
  ogTitle: 'BAGORA Maroc | حقائب ظهر استثنائية 2026',
  ogDescription: 'تسوق أفضل حقائب الظهر الفاخرة بالمغرب مع ضمان سنتين وتوصيل مجاني 24-48 ساعة.',
  ogImage: '/src/assets/images/hero_luxury_backpack_1793111382060.jpg'
};

export const INITIAL_SHIPPING: import('../types').ShippingSettings = {
  freeShippingThreshold: 0,
  defaultFee: 0,
  deliveryEstimateMajor: '24 إلى 48 ساعة',
  deliveryEstimateOther: '48 إلى 72 ساعة',
  cities: [
    { name: 'الدار البيضاء', fee: 0, enabled: true },
    { name: 'الرباط', fee: 0, enabled: true },
    { name: 'مراكش', fee: 0, enabled: true },
    { name: 'طنجة', fee: 0, enabled: true },
    { name: 'فاس', fee: 0, enabled: true },
    { name: 'أكادير', fee: 0, enabled: true }
  ]
};

export const INITIAL_PAYMENT: import('../types').PaymentSettings = {
  codEnabled: true,
  codTitle: 'الدفع عند الاستلام بعد المعاينة (Cash on Delivery)',
  codInstructions: 'تدفع نقداً للموزع بعد فتح الطرد وفحص جودة الحقيبة بنفسك.',
  whatsappOrdersEnabled: true,
  bankTransferEnabled: false,
  ribBankDetails: 'Attijariwafa Bank - RIB: 007 780 0001234567890123 45'
};

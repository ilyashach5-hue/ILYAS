import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Database storage file
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial DB template
function getInitialData() {
  return {
    products: [],
    orders: [
      {
        id: 'BG-2026-1042',
        customerName: 'محمد الإدريسي',
        phone: '0661234567',
        city: 'الدار البيضاء (Casablanca)',
        address: 'حي المعاريف، شارع المسيرة الخضراء عمارة 14',
        items: [
          {
            productId: 'bag-02',
            productName: 'حقيبة ظهر للحاسوب المحمول',
            quantity: 1,
            color: 'أسود كربوني مع لمسات ذهبية',
            price: 249,
            image: '/src/assets/images/backpack_executive_laptop_1793111382702.jpg'
          }
        ],
        subtotal: 249,
        shippingFee: 0,
        total: 249,
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'BG-2026-1041',
        customerName: 'فاطمة الزهراء بنسودة',
        phone: '0678901234',
        city: 'الرباط (Rabat)',
        address: 'حي أكدال، زنقة واد فاس إقامة الأندلس',
        items: [
          {
            productId: 'bag-07',
            productName: 'حقيبة ظهر نسائية أنيقة',
            quantity: 1,
            color: 'أسود ملكي بقفل ذهبي',
            price: 229,
            image: '/src/assets/images/backpack_women_chic_1793111401185.jpg'
          }
        ],
        subtotal: 229,
        shippingFee: 0,
        total: 229,
        status: 'shipped',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ],
    settings: null,
    reviews: []
  };
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return getInitialData();
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// REST API Endpoints
app.get('/api/orders', (req, res) => {
  const db = readDb();
  res.json({ success: true, orders: db.orders || [] });
});

app.post('/api/orders', (req, res) => {
  try {
    const { customerName, phone, city, address, items, subtotal, shippingFee, total, notes } = req.body;

    if (!customerName || !phone || !city || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'المرجو ملء جميع الحقول المطلوبة' });
    }

    const db = readDb();
    const newOrderId = `BG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: newOrderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address ? address.trim() : '',
      items,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee || 0),
      total: Number(total),
      status: 'new',
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    db.orders = [newOrder, ...(db.orders || [])];

    // Auto record or update customer
    if (!db.customers) db.customers = [];
    const existingCustIdx = db.customers.findIndex((c: any) => c.phone === phone.trim());
    if (existingCustIdx >= 0) {
      db.customers[existingCustIdx].ordersCount = (db.customers[existingCustIdx].ordersCount || 1) + 1;
      db.customers[existingCustIdx].totalSpent = (db.customers[existingCustIdx].totalSpent || 0) + Number(total);
      db.customers[existingCustIdx].lastOrderDate = new Date().toISOString().slice(0, 10);
    } else {
      db.customers.push({
        id: `cust-${Date.now()}`,
        name: customerName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address ? address.trim() : '',
        ordersCount: 1,
        totalSpent: Number(total),
        lastOrderDate: new Date().toISOString().slice(0, 10)
      });
    }

    writeDb(db);
    res.status(201).json({ success: true, order: newOrder });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء حفظ الطلب' });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDb();

  const orderIndex = db.orders.findIndex((o: any) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
  }

  db.orders[orderIndex].status = status;
  writeDb(db);
  res.json({ success: true, order: db.orders[orderIndex] });
});

app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.orders = (db.orders || []).filter((o: any) => o.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'تم حذف الطلب' });
});

// Theme & Visual Website Builder Endpoints
app.get('/api/theme/live', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    theme: db.themePublished || null
  });
});

app.post('/api/theme/live', (req, res) => {
  const db = readDb();
  db.themePublished = req.body;
  writeDb(db);
  res.json({ success: true, message: 'Live theme updated' });
});

app.get('/api/theme/draft', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    draft: db.themeDraft || db.themePublished || null
  });
});

app.post('/api/theme/draft', (req, res) => {
  const db = readDb();
  db.themeDraft = req.body;
  writeDb(db);
  res.json({ success: true, message: 'Draft saved' });
});

app.post('/api/theme/publish', (req, res) => {
  const db = readDb();
  const draft = req.body.draft || db.themeDraft;
  if (!draft) {
    return res.status(400).json({ success: false, error: 'No draft provided' });
  }
  db.themePublished = draft;
  db.themeDraft = draft;
  writeDb(db);
  res.json({ success: true, message: 'Theme published successfully' });
});

// Customers
app.get('/api/customers', (req, res) => {
  const db = readDb();
  res.json({ success: true, customers: db.customers || [] });
});

// Discounts
app.get('/api/discounts', (req, res) => {
  const db = readDb();
  res.json({ success: true, discounts: db.discounts || [] });
});

app.post('/api/discounts', (req, res) => {
  const db = readDb();
  const discount = req.body;
  if (!db.discounts) db.discounts = [];
  const idx = db.discounts.findIndex((d: any) => d.id === discount.id);
  if (idx >= 0) {
    db.discounts[idx] = discount;
  } else {
    db.discounts.push(discount);
  }
  writeDb(db);
  res.json({ success: true, discount });
});

app.delete('/api/discounts/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.discounts = (db.discounts || []).filter((d: any) => d.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Media Library
app.get('/api/media', (req, res) => {
  const db = readDb();
  res.json({ success: true, media: db.media || [] });
});

app.post('/api/media', (req, res) => {
  const db = readDb();
  const item = req.body;
  if (!db.media) db.media = [];
  db.media.unshift(item);
  writeDb(db);
  res.json({ success: true, item });
});

// Pages
app.get('/api/pages', (req, res) => {
  const db = readDb();
  res.json({ success: true, pages: db.pages || [] });
});

app.post('/api/pages', (req, res) => {
  const db = readDb();
  const page = req.body;
  if (!db.pages) db.pages = [];
  const idx = db.pages.findIndex((p: any) => p.id === page.id);
  if (idx >= 0) {
    db.pages[idx] = page;
  } else {
    db.pages.push(page);
  }
  writeDb(db);
  res.json({ success: true, page });
});

app.delete('/api/pages/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.pages = (db.pages || []).filter((p: any) => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Full Settings Sync
app.get('/api/settings/all', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    settings: db.settings,
    seo: db.seoSettings,
    shipping: db.shippingSettings,
    payment: db.paymentSettings,
    navigation: db.navigation
  });
});

app.post('/api/settings/all', (req, res) => {
  const db = readDb();
  if (req.body.settings) db.settings = req.body.settings;
  if (req.body.seo) db.seoSettings = req.body.seo;
  if (req.body.shipping) db.shippingSettings = req.body.shipping;
  if (req.body.payment) db.paymentSettings = req.body.payment;
  if (req.body.navigation) db.navigation = req.body.navigation;
  writeDb(db);
  res.json({ success: true, message: 'Settings saved' });
});


// AI Recommendation Assistant Endpoint
app.post('/api/ai/recommend', async (req, res) => {
  const { usage, laptopSize, waterproofNeeded, budget, preference } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `أنت مستشار مبيعات خبير في متجر الحقائب المغربي الفاخر BAGORA.
الزبون يبحث عن حقيبة ظهر بالمواصفات التالية:
- الاستعمال الرئيسي: ${usage || 'عام / يومي'}
- حجم الحاسوب المحمول: ${laptopSize || 'غير محدد'}
- هل يحتاج مقاومة ماء عالية: ${waterproofNeeded ? 'نعم' : 'عادي'}
- الميزانية المفضلة: ${budget || 'مرنة'}
- تفضيلات إضافية: ${preference || 'لا يوجد'}

قم بتقديم نصيحة قصيرة وراقية بالدارجة المغربية المهذبة أو العربية الفصحى (لا تتجاوز 3 فقرات قصيرة)، واقترح أي من حقائب BAGORA الثمانية (مدرسية فاخرة، للحاسوب المحمول، سفر متعددة الجيوب، رياضية عصرية، للأطفال، مقاومة للماء، نسائية أنيقة، متعددة الاستعمالات) هي الأنسب له مع ذكر السبب، وأنه سيستفيد من الدفع عند الاستلام بعد معاينة الحقيبة.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return res.json({ success: true, text: response.text });
    } catch (err: any) {
      console.warn('Gemini recommendation fallback:', err.message);
    }
  }

  // Fallback smart recommendation
  let suggestion = 'حقيبة ظهر للحاسوب المحمول (249 درهم)';
  let advice = 'بناءً على اختياراتك، ننصحك باختيار حقيبة ظهر للحاسوب المحمول المقاومة للصدمات والماء، حيث توفر حماية فائقة لأجهزتك مع مظهر تنفيذي راقٍ. التوصيل مجاني لمدينتك والدفع عند الاستلام!';

  if (usage === 'travel' || usage === 'سفر') {
    suggestion = 'حقيبة ظهر للسفر متعددة الجيوب (349 درهم)';
    advice = 'حقيبة السفر المتعددة الجيوب بسعة 40 لتر ومقصورة الأحذية المنفصلة هي خيارك المثالي للتنقل والرحلات الجوية بدون عناء.';
  } else if (usage === 'school' || usage === 'دراسة') {
    suggestion = 'حقيبة ظهر مدرسية فاخرة (199 درهم)';
    advice = 'حقيبة الظهر المدرسية المصنوعة من الكانفاس المتين والجلد هي الأكثر تحملاً للكتب والدفاتر مع مظهر أكاديمي متميز.';
  } else if (usage === 'women' || usage === 'نسائي') {
    suggestion = 'حقيبة ظهر نسائية أنيقة (229 درهم)';
    advice = 'حقيبة الظهر النسائية بحليها الذهبية وجلدها الناعم تجمع بين الأناقة الملكية والعملية اليومية.';
  }

  res.json({
    success: true,
    text: advice,
    recommendedProduct: suggestion
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`BAGORA luxury store server listening on port ${PORT}`);
  });
}

startServer();

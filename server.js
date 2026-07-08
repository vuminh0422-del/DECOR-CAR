'use strict';

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const compression = require('compression');

const cartMiddleware = require('./src/middleware/cart');
const { currentUser } = require('./src/middleware/auth');
const {
  formatVND, ORDER_STATUS, starString, couponLabel, CAR_BRANDS, brandName,
  BLOG_CATEGORIES, blogCategoryName, blogCategoryForProduct,
} = require('./src/util');
const { renderPlaceholder } = require('./src/placeholder');
const { POLICIES } = require('./src/content/policies');
const db = require('./src/db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Phiên bản tài nguyên tĩnh (theo mtime file) để "cache-busting":
// cache dài hạn nhưng khi CSS/JS đổi thì ?v= đổi -> trình duyệt tải bản mới ngay.
function assetMtime(rel) {
  try {
    return String(Math.floor(fs.statSync(path.join(__dirname, 'public', rel)).mtimeMs));
  } catch (e) {
    return '1';
  }
}
const ASSET_VER = { css: assetMtime('css/styles.css'), js: assetMtime('js/main.js') };

// ----- View engine -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// ----- Core middleware -----
app.use(compression()); // nén gzip/br cho HTML/CSS/JS -> giảm ~70% dung lượng truyền
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
// Phục vụ file tĩnh kèm cache trình duyệt: CSS/JS 7 ngày, ảnh 30 ngày.
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      if (/[\\/]img[\\/]/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000'); // ảnh: 30 ngày
      }
    },
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'decor-car-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 ngày
      secure: process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY === '1',
    },
  })
);

if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

// ----- Locals dùng chung cho mọi view -----
app.use(currentUser);
app.use(cartMiddleware);
app.use((req, res, next) => {
  res.locals.store = {
    name: 'DECOR CAR',
    phone: process.env.STORE_PHONE || '0900 000 000',
    zalo: process.env.STORE_ZALO || '0900000000',
    email: process.env.STORE_EMAIL || 'lienhe@decorcar.vn',
    address: process.env.STORE_ADDRESS || 'TP. Hồ Chí Minh',
    bankName: process.env.BANK_NAME || 'Vietcombank',
    bankAccount: process.env.BANK_ACCOUNT || '0123456789',
    bankHolder: process.env.BANK_HOLDER || 'CUA HANG DECOR CAR',
  };
  res.locals.currentPath = req.path;
  // ----- SEO: URL gốc + canonical + mô tả + ảnh OG (mặc định, trang có thể ghi đè) -----
  const base = (process.env.SITE_URL && process.env.SITE_URL.replace(/\/+$/, '')) ||
    req.protocol + '://' + req.get('host');
  res.locals.siteUrl = base;
  res.locals.canonical = base + req.path; // bỏ query để tránh trùng lặp nội dung
  res.locals.metaDescription =
    'DECOR CAR — nội thất, đồ trang trí và phụ kiện xe hơi cao cấp. Bọc ghế da, ốp nội thất, thảm lót sàn, đèn ambient, camera và phụ kiện, tuyển chọn theo chất liệu thật.';
  res.locals.ogImage = '/img/products/leather-3.jpg';
  res.locals.gaId = process.env.GA_MEASUREMENT_ID || ''; // Google Analytics 4 (để trống = tắt)
  res.locals.fbPixelId = process.env.FB_PIXEL_ID || ''; // Meta (Facebook) Pixel (để trống = tắt)
  res.locals.assetVer = ASSET_VER; // cache-busting cho CSS/JS
  res.locals.categories = db.categories(); // dùng ở header/footer mọi trang
  res.locals.carBrands = CAR_BRANDS; // bộ chọn "Tìm đồ theo dòng xe"
  res.locals.brandName = brandName;
  res.locals.blogCategories = BLOG_CATEGORIES; // chuyên mục blog (footer, nav)
  res.locals.blogCategoryName = blogCategoryName;
  res.locals.blogCategoryForProduct = blogCategoryForProduct;
  res.locals.ratingFor = db.ratingFor; // để card sản phẩm hiển thị sao + số đánh giá
  res.locals.formatVND = formatVND;
  res.locals.starString = starString;
  res.locals.couponLabel = couponLabel;
  res.locals.ORDER_STATUS = ORDER_STATUS;
  res.locals.query = req.query;
  // flash message đơn giản qua session
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// ----- Route sinh ảnh placeholder SVG (sang trọng, theo tông màu) -----
app.get('/img/ph/:label', (req, res) => {
  const label = decodeURIComponent(req.params.label || 'DECOR CAR');
  const tone = String(req.query.tone || 'walnut');
  res.type('image/svg+xml');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(renderPlaceholder(label, tone));
});

// ----- SEO: robots.txt -----
app.get('/robots.txt', (req, res) => {
  const base = (process.env.SITE_URL && process.env.SITE_URL.replace(/\/+$/, '')) ||
    req.protocol + '://' + req.get('host');
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /quan-tri',
      'Disallow: /tai-khoan',
      'Disallow: /gio-hang',
      'Disallow: /thanh-toan',
      '',
      'Sitemap: ' + base + '/sitemap.xml',
      '',
    ].join('\n')
  );
});

// ----- SEO: sitemap.xml (sinh động từ dữ liệu) -----
app.get('/sitemap.xml', (req, res) => {
  const base = (process.env.SITE_URL && process.env.SITE_URL.replace(/\/+$/, '')) ||
    req.protocol + '://' + req.get('host');
  const esc = (s) => String(s).replace(/&/g, '&amp;');
  const url = (loc, lastmod, priority) =>
    '  <url><loc>' + esc(base + loc) + '</loc>' +
    (lastmod ? '<lastmod>' + String(lastmod).slice(0, 10) + '</lastmod>' : '') +
    (priority ? '<priority>' + priority + '</priority>' : '') +
    '</url>';

  const urls = [];
  urls.push(url('/', null, '1.0'));
  urls.push(url('/cua-hang', null, '0.9'));
  urls.push(url('/blog', null, '0.7'));
  urls.push(url('/gioi-thieu', null, '0.5'));
  urls.push(url('/lien-he', null, '0.5'));
  urls.push(url('/cau-hoi-thuong-gap', null, '0.5'));
  db.categories().forEach((c) => urls.push(url('/danh-muc/' + c.slug, null, '0.8')));
  db.products().forEach((p) => urls.push(url('/san-pham/' + p.slug, p.createdAt, '0.8')));
  BLOG_CATEGORIES.forEach((c) => urls.push(url('/blog/chuyen-muc/' + c.slug, null, '0.5')));
  db.blogPosts().forEach((p) => urls.push(url('/blog/' + p.slug, p.date, '0.6')));
  POLICIES.forEach((p) => urls.push(url('/chinh-sach/' + p.slug, p.updated, '0.3')));

  res.type('application/xml').send(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.join('\n') +
      '\n</urlset>\n'
  );
});

// ----- Mount routes -----
app.use('/', require('./src/routes/shop'));
app.use('/blog', require('./src/routes/blog'));
app.use('/gio-hang', require('./src/routes/cart'));
app.use('/thanh-toan', require('./src/routes/checkout'));
app.use('/tai-khoan', require('./src/routes/account'));
app.use('/quan-tri', require('./src/routes/admin'));

// ----- 404 -----
app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'Không tìm thấy trang',
    message: 'Trang bạn tìm không tồn tại hoặc đã được chuyển đi.',
  });
});

// ----- Error handler -----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('pages/error', {
    title: 'Có lỗi xảy ra',
    message: 'Hệ thống gặp sự cố. Vui lòng thử lại sau ít phút.',
  });
});

app.listen(PORT, () => {
  console.log(`DECOR CAR đang chạy tại http://localhost:${PORT}`);
});

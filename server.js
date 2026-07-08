'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const cartMiddleware = require('./src/middleware/cart');
const { currentUser } = require('./src/middleware/auth');
const { formatVND, ORDER_STATUS, starString, couponLabel, CAR_BRANDS, brandName } = require('./src/util');
const { renderPlaceholder } = require('./src/placeholder');
const db = require('./src/db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ----- View engine -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// ----- Core middleware -----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

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
  res.locals.categories = db.categories(); // dùng ở header/footer mọi trang
  res.locals.carBrands = CAR_BRANDS; // bộ chọn "Tìm đồ theo dòng xe"
  res.locals.brandName = brandName;
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

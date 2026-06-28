'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const { slugify, ORDER_STATUS } = require('../util');

// Khu vực quản trị dùng layout riêng, không có header/footer cửa hàng.
router.use(requireAdmin);
router.use((req, res, next) => {
  res.locals.layout = 'admin/layout';
  next();
});

// ----- Cấu hình upload ảnh -----
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'public', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = slugify(path.basename(file.originalname, ext)) || 'anh';
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpe?g|png|webp|avif|gif)/.test(file.mimetype);
    cb(ok ? null : new Error('Chỉ chấp nhận file ảnh.'), ok);
  },
});

// ----- Dashboard -----
router.get('/', (req, res) => {
  const orders = db.orders();
  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pending = orders.filter((o) => o.status === 'pending').length;
  const recent = [...orders].sort((a, b) => b.id - a.id).slice(0, 6);
  res.render('admin/dashboard', {
    title: 'Tổng quan — Quản trị DECOR CAR',
    stats: {
      products: db.products().length,
      orders: orders.length,
      pending,
      revenue,
    },
    recent,
  });
});

// ----- Sản phẩm -----
router.get('/san-pham', (req, res) => {
  res.render('admin/products', {
    title: 'Quản lý sản phẩm — DECOR CAR',
    products: [...db.products()].sort((a, b) => b.id - a.id),
    categories: db.categories(),
  });
});

router.get('/san-pham/moi', (req, res) => {
  res.render('admin/product-form', {
    title: 'Thêm sản phẩm — DECOR CAR',
    product: null,
    categories: db.categories(),
    errors: {},
  });
});

router.post('/san-pham', upload.array('images', 6), (req, res) => {
  const data = parseProductForm(req);
  if (Object.keys(data.errors).length > 0) {
    return res.status(422).render('admin/product-form', {
      title: 'Thêm sản phẩm — DECOR CAR',
      product: data.values,
      categories: db.categories(),
      errors: data.errors,
    });
  }
  const images = (req.files || []).map((f) => '/uploads/' + f.filename);
  const cat = db.categoryBySlug(data.values.categorySlug);
  db.addProduct({
    slug: uniqueSlug(slugify(data.values.name)),
    name: data.values.name,
    categorySlug: data.values.categorySlug,
    price: data.values.price,
    compareAt: data.values.compareAt,
    tone: cat ? cat.tone : 'walnut',
    featured: data.values.featured,
    description: data.values.description,
    stock: data.values.stock,
    sku: data.values.sku || 'DC-' + Date.now(),
    images: images.length
      ? images
      : [`/img/ph/${encodeURIComponent(data.values.name)}?tone=${cat ? cat.tone : 'walnut'}`],
    createdAt: new Date().toISOString(),
  });
  req.session.flash = { type: 'success', message: 'Đã thêm sản phẩm.' };
  res.redirect('/quan-tri/san-pham');
});

router.get('/san-pham/:id/sua', (req, res) => {
  const product = db.productById(req.params.id);
  if (!product) return res.redirect('/quan-tri/san-pham');
  res.render('admin/product-form', {
    title: 'Sửa sản phẩm — DECOR CAR',
    product,
    categories: db.categories(),
    errors: {},
  });
});

router.post('/san-pham/:id', upload.array('images', 6), (req, res) => {
  const product = db.productById(req.params.id);
  if (!product) return res.redirect('/quan-tri/san-pham');
  const data = parseProductForm(req);
  if (Object.keys(data.errors).length > 0) {
    return res.status(422).render('admin/product-form', {
      title: 'Sửa sản phẩm — DECOR CAR',
      product: Object.assign({}, product, data.values),
      categories: db.categories(),
      errors: data.errors,
    });
  }
  const patch = {
    name: data.values.name,
    categorySlug: data.values.categorySlug,
    price: data.values.price,
    compareAt: data.values.compareAt,
    featured: data.values.featured,
    description: data.values.description,
    stock: data.values.stock,
    sku: data.values.sku,
  };
  const newImages = (req.files || []).map((f) => '/uploads/' + f.filename);
  if (newImages.length) patch.images = newImages;
  db.updateProduct(product.id, patch);
  req.session.flash = { type: 'success', message: 'Đã cập nhật sản phẩm.' };
  res.redirect('/quan-tri/san-pham');
});

router.delete('/san-pham/:id', (req, res) => {
  db.deleteProduct(req.params.id);
  req.session.flash = { type: 'success', message: 'Đã xoá sản phẩm.' };
  res.redirect('/quan-tri/san-pham');
});

// ----- Đơn hàng -----
router.get('/don-hang', (req, res) => {
  res.render('admin/orders', {
    title: 'Quản lý đơn hàng — DECOR CAR',
    orders: [...db.orders()].sort((a, b) => b.id - a.id),
  });
});

router.get('/don-hang/:code', (req, res) => {
  const order = db.orderByCode(req.params.code);
  if (!order) return res.redirect('/quan-tri/don-hang');
  res.render('admin/order-detail', {
    title: 'Đơn ' + order.code + ' — DECOR CAR',
    order,
    statuses: ORDER_STATUS,
  });
});

router.post('/don-hang/:id/trang-thai', (req, res) => {
  const status = req.body.status;
  if (ORDER_STATUS[status]) {
    db.updateOrder(req.params.id, { status });
    req.session.flash = { type: 'success', message: 'Đã cập nhật trạng thái đơn.' };
  }
  const order = db.orders().find((o) => o.id === Number(req.params.id));
  res.redirect(order ? '/quan-tri/don-hang/' + order.code : '/quan-tri/don-hang');
});

// ----- Mã giảm giá -----
router.get('/khuyen-mai', (req, res) => {
  res.render('admin/coupons', {
    title: 'Mã giảm giá — DECOR CAR',
    coupons: db.coupons(),
    errors: {},
    form: {},
  });
});

router.post('/khuyen-mai', (req, res) => {
  const form = {
    code: (req.body.code || '').trim().toUpperCase(),
    type: req.body.type === 'fixed' ? 'fixed' : 'percent',
    value: Math.max(0, parseInt(req.body.value, 10) || 0),
    minSubtotal: Math.max(0, parseInt(req.body.minSubtotal, 10) || 0),
    description: (req.body.description || '').trim(),
  };
  const errors = {};
  if (!/^[A-Z0-9]{3,20}$/.test(form.code)) errors.code = 'Mã gồm 3–20 ký tự chữ/số in hoa.';
  if (form.value <= 0) errors.value = 'Giá trị giảm phải lớn hơn 0.';
  if (form.type === 'percent' && form.value > 100) errors.value = 'Phần trăm không vượt quá 100.';
  if (!errors.code && db.couponByCode(form.code)) errors.code = 'Mã này đã tồn tại.';

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('admin/coupons', {
      title: 'Mã giảm giá — DECOR CAR',
      coupons: db.coupons(),
      errors,
      form,
    });
  }
  db.addCoupon({ ...form, active: true });
  req.session.flash = { type: 'success', message: 'Đã thêm mã giảm giá ' + form.code + '.' };
  res.redirect('/quan-tri/khuyen-mai');
});

router.delete('/khuyen-mai/:code', (req, res) => {
  db.deleteCoupon(req.params.code);
  req.session.flash = { type: 'success', message: 'Đã xoá mã giảm giá.' };
  res.redirect('/quan-tri/khuyen-mai');
});

// ----- Đánh giá (xem) -----
router.get('/danh-gia', (req, res) => {
  const reviews = [...db.data.reviews]
    .sort((a, b) => b.id - a.id)
    .map((r) => ({ ...r, product: db.productById(r.productId) }));
  res.render('admin/reviews', { title: 'Đánh giá sản phẩm — DECOR CAR', reviews });
});

// ----- Helpers -----
function parseProductForm(req) {
  const values = {
    name: (req.body.name || '').trim(),
    categorySlug: req.body.categorySlug || '',
    price: Math.max(0, parseInt(req.body.price, 10) || 0),
    compareAt: req.body.compareAt ? Math.max(0, parseInt(req.body.compareAt, 10) || 0) : null,
    stock: Math.max(0, parseInt(req.body.stock, 10) || 0),
    sku: (req.body.sku || '').trim(),
    description: (req.body.description || '').trim(),
    featured: req.body.featured === 'on' || req.body.featured === 'true',
  };
  const errors = {};
  if (!values.name) errors.name = 'Vui lòng nhập tên sản phẩm.';
  if (!db.categoryBySlug(values.categorySlug)) errors.categorySlug = 'Vui lòng chọn danh mục.';
  if (values.price <= 0) errors.price = 'Giá phải lớn hơn 0.';
  return { values, errors };
}

function uniqueSlug(base) {
  let slug = base || 'san-pham';
  let i = 2;
  while (db.productBySlug(slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Trang chủ
router.get('/', (req, res) => {
  const products = db.products();
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const newest = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
  res.render('pages/home', {
    title: 'DECOR CAR — Nội thất, decor & trang trí xe hơi cao cấp',
    categories: db.categories(),
    featured,
    newest,
  });
});

// Danh sách sản phẩm (toàn bộ hoặc theo danh mục) + tìm kiếm + sắp xếp
router.get('/cua-hang', (req, res) => {
  renderCatalog(req, res, null);
});

router.get('/danh-muc/:slug', (req, res) => {
  const category = db.categoryBySlug(req.params.slug);
  if (!category) {
    return res.status(404).render('pages/error', {
      title: 'Không tìm thấy danh mục',
      message: 'Danh mục bạn tìm không tồn tại.',
    });
  }
  renderCatalog(req, res, category);
});

function renderCatalog(req, res, category) {
  let list = db.products();
  if (category) list = list.filter((p) => p.categorySlug === category.slug);

  const q = (req.query.q || '').trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  }

  // Lọc theo dòng xe: món dùng chung (universalFit) luôn hiện, kèm món hợp hãng đã chọn.
  const brand = (req.query.brand || '').trim().toLowerCase();
  if (brand) {
    list = list.filter((p) => p.universalFit || (p.brands || []).includes(brand));
  }

  // Chỉ hiển thị sản phẩm còn hàng
  const instock = req.query.instock === '1';
  if (instock) list = list.filter((p) => (p.stock || 0) > 0);

  // Lọc theo khoảng giá
  const min = parseInt(req.query.min, 10);
  const max = parseInt(req.query.max, 10);
  if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
  if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);

  const sort = req.query.sort || 'moi-nhat';
  const sorters = {
    'moi-nhat': (a, b) => b.id - a.id,
    'gia-tang': (a, b) => a.price - b.price,
    'gia-giam': (a, b) => b.price - a.price,
    'ten-az': (a, b) => a.name.localeCompare(b.name, 'vi'),
  };
  list = [...list].sort(sorters[sort] || sorters['moi-nhat']);

  res.render('pages/catalog', {
    title: category ? category.name + ' — DECOR CAR' : 'Cửa hàng — DECOR CAR',
    category,
    categories: db.categories(),
    products: list,
    q: req.query.q || '',
    sort,
    min: req.query.min || '',
    max: req.query.max || '',
    brand,
    instock,
  });
}

// Chi tiết sản phẩm
router.get('/san-pham/:slug', (req, res) => {
  const product = db.productBySlug(req.params.slug);
  if (!product) {
    return res.status(404).render('pages/error', {
      title: 'Không tìm thấy sản phẩm',
      message: 'Sản phẩm bạn tìm không tồn tại hoặc đã ngừng kinh doanh.',
    });
  }
  const category = db.categoryBySlug(product.categorySlug);
  const related = db
    .products()
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  // Gợi ý mua kèm: ưu tiên phụ kiện dùng chung ở danh mục KHÁC (bổ trợ, không trùng nhóm).
  const addOns = db
    .products()
    .filter((p) => p.id !== product.id && p.categorySlug !== product.categorySlug && p.universalFit)
    .sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1))
    .slice(0, 3);

  res.render('pages/product', {
    title: product.name + ' — DECOR CAR',
    product,
    category,
    related,
    addOns,
    reviews: db.reviewsByProduct(product.id),
    rating: db.ratingFor(product.id),
    reviewSent: req.query.danhgia === 'ok',
  });
});

// Đăng ký nhận ưu đãi — trả về mã giảm giá lần đầu (WELCOME10 đã seed sẵn).
router.post('/dang-ky-nhan-tin', (req, res) => {
  const email = (req.body.email || '').trim();
  const ok = /.+@.+\..+/.test(email);
  const welcome = db.couponByCode('WELCOME10');
  const code = welcome && welcome.active ? welcome.code : null;
  req.session.flash = ok
    ? {
        type: 'success',
        message: code
          ? `Cảm ơn bạn! Dùng mã ${code} để giảm 10% cho đơn đầu tiên (đơn từ 500.000₫).`
          : 'Cảm ơn bạn đã đăng ký nhận ưu đãi từ DECOR CAR!',
      }
    : { type: 'error', message: 'Email chưa hợp lệ, vui lòng kiểm tra lại.' };
  res.redirect(req.get('referer') || '/');
});

// Gửi đánh giá sản phẩm
router.post('/san-pham/:slug/danh-gia', (req, res) => {
  const product = db.productBySlug(req.params.slug);
  if (!product) return res.redirect('/cua-hang');
  const name = (req.body.name || '').trim() || 'Khách hàng';
  let rating = parseInt(req.body.rating, 10);
  if (Number.isNaN(rating) || rating < 1 || rating > 5) rating = 5;
  const comment = (req.body.comment || '').trim().slice(0, 600);
  if (comment) {
    db.addReview({
      productId: product.id,
      name: name.slice(0, 60),
      rating,
      comment,
      createdAt: new Date().toISOString(),
    });
  }
  res.redirect('/san-pham/' + product.slug + '?danhgia=ok#danh-gia');
});

// Giới thiệu
router.get('/gioi-thieu', (req, res) => {
  res.render('pages/about', { title: 'Về DECOR CAR' });
});

// Liên hệ
router.get('/lien-he', (req, res) => {
  res.render('pages/contact', { title: 'Liên hệ — DECOR CAR', sent: false });
});

router.post('/lien-he', (req, res) => {
  // Demo: chỉ ghi log. Khi triển khai thật, gửi email hoặc lưu vào DB.
  console.log('[Liên hệ mới]', {
    name: req.body.name,
    phone: req.body.phone,
    message: req.body.message,
  });
  res.render('pages/contact', { title: 'Liên hệ — DECOR CAR', sent: true });
});

module.exports = router;

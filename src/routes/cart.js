'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { lineKey: makeLineKey } = require('../util');

// Quay lại trang trước (thay cho res.redirect('back') đã deprecated ở Express 5).
function back(req, res) {
  res.redirect(req.get('Referrer') || '/cua-hang');
}

// Xem giỏ hàng
router.get('/', (req, res) => {
  res.render('pages/cart', { title: 'Giỏ hàng — DECOR CAR' });
});

// Thêm vào giỏ
router.post('/them', (req, res) => {
  const id = Number(req.body.productId);
  const qty = Math.max(1, Number(req.body.quantity) || 1);
  const product = db.productById(id);
  if (!product) {
    req.session.flash = { type: 'error', message: 'Sản phẩm không tồn tại.' };
    return back(req, res);
  }

  // Dựng biến thể từ các tuỳ chọn của sản phẩm (opt[Tên tuỳ chọn] = giá trị)
  let variant = null;
  if (Array.isArray(product.options) && product.options.length) {
    const picked = req.body.opt || {};
    variant = {};
    product.options.forEach((o) => {
      const chosen = picked[o.name];
      variant[o.name] = o.values.includes(chosen) ? chosen : o.values[0];
    });
  }

  const key = makeLineKey(id, variant);
  const cart = req.session.cart || (req.session.cart = {});
  const existing = cart[key];
  const prevQty = existing && typeof existing === 'object' ? Number(existing.quantity) || 0 : Number(existing) || 0;
  cart[key] = { productId: id, quantity: prevQty + qty, variant };

  req.session.flash = { type: 'success', message: `Đã thêm “${product.name}” vào giỏ.` };

  // Nếu bấm "Mua ngay" thì sang thẳng giỏ hàng
  if (req.body.buyNow) return res.redirect('/gio-hang');
  back(req, res);
});

// Cập nhật số lượng
router.post('/cap-nhat', (req, res) => {
  const cart = req.session.cart || {};
  const key = req.body.lineKey;
  const qty = Number(req.body.quantity);
  if (!cart[key]) return res.redirect('/gio-hang');
  if (qty <= 0) {
    delete cart[key];
  } else if (typeof cart[key] === 'object') {
    cart[key].quantity = qty;
  } else {
    cart[key] = qty;
  }
  res.redirect('/gio-hang');
});

// Xoá khỏi giỏ
router.post('/xoa', (req, res) => {
  const cart = req.session.cart || {};
  delete cart[req.body.lineKey];
  res.redirect('/gio-hang');
});

// Áp dụng mã giảm giá
router.post('/ma-giam-gia', (req, res) => {
  const code = (req.body.code || '').trim().toUpperCase();
  const coupon = db.couponByCode(code);
  const { computeDiscount } = require('../util');
  const result = computeDiscount(coupon, res.locals.cart.subtotal);
  if (result.ok) {
    req.session.coupon = code;
    req.session.flash = { type: 'success', message: result.message };
  } else {
    delete req.session.coupon;
    req.session.flash = { type: 'error', message: result.message };
  }
  res.redirect('/gio-hang');
});

// Gỡ mã giảm giá
router.post('/go-ma', (req, res) => {
  delete req.session.coupon;
  res.redirect('/gio-hang');
});

module.exports = router;

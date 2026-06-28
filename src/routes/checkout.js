'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db/database');

const SHIP_FEE = 50000;
const FREE_SHIP_THRESHOLD = 3000000;

function computeTotals(cart) {
  const subtotal = cart.subtotal;
  const discount = cart.discount || 0;
  const shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : SHIP_FEE;
  return {
    subtotal,
    discount,
    coupon: cart.coupon,
    shipping,
    total: Math.max(0, subtotal - discount) + shipping,
  };
}

// Trang thanh toán
router.get('/', (req, res) => {
  if (res.locals.cart.count === 0) {
    return res.redirect('/gio-hang');
  }
  const totals = computeTotals(res.locals.cart);
  res.render('pages/checkout', {
    title: 'Thanh toán — DECOR CAR',
    totals,
    errors: {},
    form: {},
  });
});

// Đặt hàng
router.post('/', (req, res) => {
  const cart = res.locals.cart;
  if (cart.count === 0) return res.redirect('/gio-hang');

  const form = {
    name: (req.body.name || '').trim(),
    phone: (req.body.phone || '').trim(),
    email: (req.body.email || '').trim(),
    address: (req.body.address || '').trim(),
    note: (req.body.note || '').trim(),
    payment: req.body.payment === 'bank' ? 'bank' : 'cod',
  };

  const errors = {};
  if (!form.name) errors.name = 'Vui lòng nhập họ tên.';
  if (!/^[0-9\s+]{8,15}$/.test(form.phone)) errors.phone = 'Số điện thoại chưa hợp lệ.';
  if (!form.address) errors.address = 'Vui lòng nhập địa chỉ nhận hàng.';

  const totals = computeTotals(cart);

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('pages/checkout', {
      title: 'Thanh toán — DECOR CAR',
      totals,
      errors,
      form,
    });
  }

  const order = db.addOrder({
    userId: res.locals.user ? res.locals.user.id : null,
    customer: { name: form.name, phone: form.phone, email: form.email, address: form.address },
    note: form.note,
    payment: form.payment,
    status: 'pending',
    items: cart.items.map((it) => ({
      productId: it.product.id,
      name: it.product.name,
      slug: it.product.slug,
      price: it.product.price,
      quantity: it.quantity,
      lineTotal: it.lineTotal,
    })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    coupon: totals.coupon ? totals.coupon.code : null,
    shipping: totals.shipping,
    total: totals.total,
    createdAt: new Date().toISOString(),
  });

  // ----- ĐIỂM TÍCH HỢP CỔNG THANH TOÁN -----
  // Khi cần VNPay/Momo: với form.payment === 'online', tạo URL thanh toán tại đây
  // rồi res.redirect(paymentUrl). Sau khi cổng callback thành công thì cập nhật
  // order.status và xoá giỏ hàng. Hiện hỗ trợ COD và chuyển khoản thủ công.

  req.session.cart = {}; // xoá giỏ sau khi đặt
  delete req.session.coupon; // gỡ mã giảm giá đã dùng
  req.session.lastOrderCode = order.code;
  res.redirect('/thanh-toan/hoan-tat/' + order.code);
});

// Trang xác nhận đặt hàng thành công
router.get('/hoan-tat/:code', (req, res) => {
  const order = db.orderByCode(req.params.code);
  if (!order) {
    return res.status(404).render('pages/error', {
      title: 'Không tìm thấy đơn hàng',
      message: 'Mã đơn hàng không hợp lệ.',
    });
  }
  res.render('pages/order-success', { title: 'Đặt hàng thành công — DECOR CAR', order });
});

module.exports = router;

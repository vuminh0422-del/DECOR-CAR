'use strict';

const db = require('../db/database');
const { formatVND, computeDiscount, couponLabel } = require('../util');

/**
 * Tính toán giỏ hàng từ session và gắn vào res.locals để mọi view dùng được.
 * Giỏ hàng lưu trong session dưới dạng: { [productId]: quantity }
 * Mã giảm giá (nếu có) lưu ở session.coupon = "WELCOME10".
 */
function cartMiddleware(req, res, next) {
  if (!req.session.cart) req.session.cart = {};
  const cart = req.session.cart;

  const items = [];
  let subtotal = 0;
  let count = 0;

  for (const [pid, qty] of Object.entries(cart)) {
    const product = db.productById(pid);
    if (!product) {
      delete cart[pid]; // sản phẩm đã bị xoá -> dọn khỏi giỏ
      continue;
    }
    const quantity = Math.max(1, Number(qty) || 1);
    const lineTotal = product.price * quantity;
    subtotal += lineTotal;
    count += quantity;
    items.push({ product, quantity, lineTotal });
  }

  // Áp dụng mã giảm giá nếu còn hợp lệ
  let discount = 0;
  let coupon = null;
  if (req.session.coupon) {
    const found = db.couponByCode(req.session.coupon);
    const result = computeDiscount(found, subtotal);
    if (result.ok) {
      discount = result.discount;
      coupon = { code: found.code, label: couponLabel(found), discount };
    } else {
      // Mã không còn hợp lệ (vd: giỏ giảm dưới mức tối thiểu) -> gỡ bỏ
      delete req.session.coupon;
    }
  }

  res.locals.cart = {
    items,
    count,
    subtotal,
    discount,
    coupon,
    total: Math.max(0, subtotal - discount),
    subtotalLabel: formatVND(subtotal),
  };
  next();
}

module.exports = cartMiddleware;

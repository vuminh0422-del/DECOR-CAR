'use strict';

const db = require('../db/database');
const { formatVND, computeDiscount, couponLabel, variantLabel } = require('../util');

/**
 * Tính toán giỏ hàng từ session và gắn vào res.locals để mọi view dùng được.
 * Giỏ hàng lưu dạng: { [lineKey]: { productId, quantity, variant } }
 *   - lineKey = productId (không biến thể) hoặc productId::key (có biến thể)
 *   - Tương thích ngược: giỏ cũ lưu số (quantity) trực tiếp -> vẫn đọc được.
 * Mã giảm giá (nếu có) lưu ở session.coupon = "WELCOME10".
 */
function cartMiddleware(req, res, next) {
  if (!req.session.cart) req.session.cart = {};
  const cart = req.session.cart;

  const items = [];
  let subtotal = 0;
  let count = 0;

  for (const [key, val] of Object.entries(cart)) {
    // Chuẩn hoá cả định dạng cũ (số) lẫn mới (object)
    const line = typeof val === 'number'
      ? { productId: Number(key), quantity: val, variant: null }
      : val;
    const product = db.productById(line.productId);
    if (!product) {
      delete cart[key]; // sản phẩm đã bị xoá -> dọn khỏi giỏ
      continue;
    }
    const quantity = Math.max(1, Number(line.quantity) || 1);
    const lineTotal = product.price * quantity;
    subtotal += lineTotal;
    count += quantity;
    items.push({
      lineKey: key,
      product,
      quantity,
      lineTotal,
      variant: line.variant || null,
      variantLabel: line.variant ? variantLabel(line.variant) : '',
    });
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

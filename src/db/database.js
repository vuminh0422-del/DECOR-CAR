'use strict';

/**
 * Lớp lưu trữ dữ liệu đơn giản dựa trên JSON.
 *
 * Vì sao không dùng SQLite/MySQL ở đây?
 *  - better-sqlite3 cần biên dịch native (dễ lỗi trên Windows nếu thiếu build tools).
 *  - Với một cửa hàng nội thất/decor quy mô vừa, JSON store đủ nhanh và ổn định,
 *    đồng thời `npm install` chạy được ngay trên mọi máy mà không cần công cụ build.
 *
 * Khi nào nên nâng cấp lên MySQL (Hostinger có sẵn)?
 *  - Khi lượng đơn/sản phẩm lớn hoặc cần truy vấn phức tạp, đồng thời nhiều tiến trình.
 *  - Toàn bộ truy cập dữ liệu đi qua module này, nên việc thay thế về sau rất gọn.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

const DEFAULT_DATA = {
  categories: [],
  products: [],
  users: [],
  orders: [],
  reviews: [],
  coupons: [],
  blogPosts: [],
  counters: { product: 0, user: 0, order: 0, review: 0 },
};

let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    cache = JSON.parse(raw);
    // Bảo đảm đủ các collection nếu file cũ thiếu khoá
    for (const key of Object.keys(DEFAULT_DATA)) {
      if (cache[key] === undefined) cache[key] = structuredCloneSafe(DEFAULT_DATA[key]);
    }
  } catch (err) {
    cache = structuredCloneSafe(DEFAULT_DATA);
    persist();
  }
  return cache;
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

// Ghi đồng bộ, đơn giản và an toàn cho tải nhỏ/vừa.
// Ghi ra file tạm rồi đổi tên để tránh hỏng file khi ghi dở.
function persist() {
  if (!cache) return;
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2), 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

function nextId(name) {
  const data = load();
  data.counters[name] = (data.counters[name] || 0) + 1;
  return data.counters[name];
}

const db = {
  get data() {
    return load();
  },
  save: persist,
  nextId,

  // ----- Categories -----
  categories() {
    return load().categories;
  },
  categoryBySlug(slug) {
    return load().categories.find((c) => c.slug === slug) || null;
  },

  // ----- Products -----
  products() {
    return load().products;
  },
  productById(id) {
    return load().products.find((p) => p.id === Number(id)) || null;
  },
  productBySlug(slug) {
    return load().products.find((p) => p.slug === slug) || null;
  },
  addProduct(product) {
    const data = load();
    product.id = nextId('product');
    data.products.push(product);
    persist();
    return product;
  },
  updateProduct(id, patch) {
    const data = load();
    const p = data.products.find((x) => x.id === Number(id));
    if (!p) return null;
    Object.assign(p, patch);
    persist();
    return p;
  },
  deleteProduct(id) {
    const data = load();
    const i = data.products.findIndex((x) => x.id === Number(id));
    if (i === -1) return false;
    data.products.splice(i, 1);
    persist();
    return true;
  },

  // ----- Users -----
  userByEmail(email) {
    return load().users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
  },
  userById(id) {
    return load().users.find((u) => u.id === Number(id)) || null;
  },
  addUser(user) {
    const data = load();
    user.id = nextId('user');
    data.users.push(user);
    persist();
    return user;
  },

  // ----- Orders -----
  orders() {
    return load().orders;
  },
  orderByCode(code) {
    return load().orders.find((o) => o.code === code) || null;
  },
  ordersByUser(userId) {
    return load().orders.filter((o) => o.userId === Number(userId));
  },
  addOrder(order) {
    const data = load();
    const seq = nextId('order');
    order.id = seq;
    order.code = 'DC' + String(100000 + seq);
    data.orders.push(order);
    persist();
    return order;
  },
  updateOrder(id, patch) {
    const data = load();
    const o = data.orders.find((x) => x.id === Number(id));
    if (!o) return null;
    Object.assign(o, patch);
    persist();
    return o;
  },

  // ----- Reviews (đánh giá sản phẩm) -----
  reviewsByProduct(productId) {
    return load()
      .reviews.filter((r) => r.productId === Number(productId))
      .sort((a, b) => b.id - a.id);
  },
  addReview(review) {
    const data = load();
    review.id = nextId('review');
    data.reviews.push(review);
    persist();
    return review;
  },
  // Trả về { average, count } cho một sản phẩm
  ratingFor(productId) {
    const list = load().reviews.filter((r) => r.productId === Number(productId));
    if (list.length === 0) return { average: 0, count: 0 };
    const sum = list.reduce((s, r) => s + r.rating, 0);
    return { average: Math.round((sum / list.length) * 10) / 10, count: list.length };
  },

  // ----- Coupons (mã giảm giá) -----
  coupons() {
    return load().coupons;
  },
  couponByCode(code) {
    const c = String(code || '').trim().toUpperCase();
    return load().coupons.find((x) => x.code.toUpperCase() === c) || null;
  },
  addCoupon(coupon) {
    const data = load();
    data.coupons.push(coupon);
    persist();
    return coupon;
  },
  deleteCoupon(code) {
    const data = load();
    const i = data.coupons.findIndex((x) => x.code.toUpperCase() === String(code).toUpperCase());
    if (i === -1) return false;
    data.coupons.splice(i, 1);
    persist();
    return true;
  },

  // ----- Blog -----
  blogPosts() {
    return [...load().blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  blogPostBySlug(slug) {
    return load().blogPosts.find((p) => p.slug === slug) || null;
  },
};

module.exports = db;

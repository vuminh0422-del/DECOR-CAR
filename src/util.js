'use strict';

// Chuyển chuỗi tiếng Việt có dấu thành slug an toàn cho URL.
function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // bỏ dấu tổ hợp
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Định dạng tiền tệ VND: 6800000 -> "6.800.000₫"
function formatVND(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString('vi-VN') + '₫';
}

// Bảng nhãn trạng thái đơn hàng (slug -> nhãn hiển thị)
const ORDER_STATUS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
};

// Tính số tiền giảm từ một coupon cho một mức tạm tính.
// Trả về { ok, discount, message }
function computeDiscount(coupon, subtotal) {
  if (!coupon) return { ok: false, discount: 0, message: 'Mã không tồn tại.' };
  if (coupon.active === false) return { ok: false, discount: 0, message: 'Mã đã ngừng áp dụng.' };
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      discount: 0,
      message: 'Đơn tối thiểu ' + formatVND(coupon.minSubtotal) + ' để dùng mã này.',
    };
  }
  let discount =
    coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  discount = Math.min(discount, subtotal); // không vượt quá tạm tính
  return { ok: true, discount, message: 'Áp dụng mã thành công.' };
}

// Mô tả ngắn gọn một coupon: "Giảm 10%" / "Giảm 200.000₫"
function couponLabel(coupon) {
  if (!coupon) return '';
  return coupon.type === 'percent' ? `Giảm ${coupon.value}%` : `Giảm ${formatVND(coupon.value)}`;
}

// Tạo chuỗi sao đặc/rỗng cho điểm đánh giá (dùng ở view).
function starString(rating) {
  const full = Math.round(rating);
  return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
}

// Danh sách hãng xe phổ biến tại VN — dùng cho bộ chọn "Tìm đồ theo dòng xe".
// Đây là taxonomy tĩnh (không đổi thường xuyên) nên đặt ở util thay vì DB.
const CAR_BRANDS = [
  { slug: 'toyota', name: 'Toyota' },
  { slug: 'honda', name: 'Honda' },
  { slug: 'mazda', name: 'Mazda' },
  { slug: 'hyundai', name: 'Hyundai' },
  { slug: 'kia', name: 'Kia' },
  { slug: 'ford', name: 'Ford' },
  { slug: 'mercedes', name: 'Mercedes-Benz' },
  { slug: 'vinfast', name: 'VinFast' },
  { slug: 'mitsubishi', name: 'Mitsubishi' },
];

function brandName(slug) {
  const b = CAR_BRANDS.find((x) => x.slug === slug);
  return b ? b.name : '';
}

module.exports = {
  slugify,
  formatVND,
  ORDER_STATUS,
  computeDiscount,
  couponLabel,
  starString,
  CAR_BRANDS,
  brandName,
};

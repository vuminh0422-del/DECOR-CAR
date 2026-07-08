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

// Chuyên mục blog — chia theo từng NHÓM SẢN PHẨM, ánh xạ sang danh mục sản phẩm tương ứng
// để liên kết nội bộ hai chiều (blog <-> cửa hàng).
const BLOG_CATEGORIES = [
  {
    slug: 'noi-that',
    name: 'Nội thất xe',
    productCat: 'noi-that-xe',
    desc: 'Bọc ghế da, ốp nội thất, vô lăng — kinh nghiệm chọn và nâng cấp khoang lái.',
  },
  {
    slug: 'tham-lot',
    name: 'Thảm lót sàn & cốp',
    productCat: 'tham-lot-san',
    desc: 'Chọn và bảo dưỡng thảm lót sàn, cốp và taplo vừa khít theo từng dòng xe.',
  },
  {
    slug: 'den-cong-nghe',
    name: 'Đèn & công nghệ',
    productCat: 'den-phu-kien',
    desc: 'Đèn ambient, camera hành trình, màn hình và sạc — mẹo chọn và lắp đặt.',
  },
  {
    slug: 'cham-soc',
    name: 'Chăm sóc & trang trí',
    productCat: 'cham-soc-trang-tri',
    desc: 'Vệ sinh nội thất, nước hoa, gối tựa và các phụ kiện tạo điểm nhấn.',
  },
];

function blogCategoryBySlug(slug) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug) || null;
}
// Tìm chuyên mục blog theo slug danh mục SẢN PHẨM (để catalog trỏ sang blog liên quan)
function blogCategoryForProduct(productCatSlug) {
  return BLOG_CATEGORIES.find((c) => c.productCat === productCatSlug) || null;
}
function blogCategoryName(slug) {
  const c = blogCategoryBySlug(slug);
  return c ? c.name : '';
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
  BLOG_CATEGORIES,
  blogCategoryBySlug,
  blogCategoryForProduct,
  blogCategoryName,
};

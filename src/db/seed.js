'use strict';

/**
 * Khởi tạo dữ liệu mẫu cho DECOR CAR — tập trung vào NỘI THẤT & PHỤ KIỆN XE Ô TÔ.
 * Chạy: npm run seed
 * Lưu ý: thao tác này GHI ĐÈ toàn bộ data.json về dữ liệu mẫu.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { slugify } = require('../util');

const DATA_FILE = path.join(__dirname, 'data.json');

const categories = [
  {
    id: 1,
    slug: 'noi-that-xe',
    name: 'Nội thất xe',
    tagline: 'Khoang lái xứng tầm chủ nhân',
    description: 'Bọc ghế da, ốp nội thất vân gỗ/carbon, bọc vô lăng và tựa đầu — nâng tầm không gian bên trong xe.',
    tone: 'ink',
  },
  {
    id: 2,
    slug: 'tham-lot-san',
    name: 'Thảm lót sàn & cốp',
    tagline: 'Sạch sẽ, vừa khít, bền bỉ',
    description: 'Thảm lót sàn 6D, thảm lót cốp định hình theo từng dòng xe, chống nước và bám bụi.',
    tone: 'walnut',
  },
  {
    id: 3,
    slug: 'den-phu-kien',
    name: 'Đèn & phụ kiện điện',
    tagline: 'Ánh sáng và công nghệ cho khoang lái',
    description: 'LED ambient, đèn cửa logo, camera hành trình, tẩu sạc và phụ kiện điện tử tiện ích.',
    tone: 'brass',
  },
  {
    id: 4,
    slug: 'cham-soc-trang-tri',
    name: 'Chăm sóc & trang trí',
    tagline: 'Chi tiết nhỏ tạo nên đẳng cấp',
    description: 'Nước hoa, gối tựa, móc treo, phụ kiện trang trí taplo và bộ chăm sóc nội thất xe.',
    tone: 'brass',
  },
];

// [name, catSlug, price, compareAt, tone, featured, description]
const rawProducts = [
  // Nội thất xe
  ['Bọc ghế da Nappa Premium', 'noi-that-xe', 4500000, 5200000, 'ink', true,
    'Da Nappa cao cấp, may ôm form theo từng dòng xe, thoáng khí, chống thấm và bền màu theo thời gian.'],
  ['Ốp nội thất vân gỗ Veneer', 'noi-that-xe', 2200000, 2600000, 'walnut', true,
    'Bộ ốp taplo và cánh cửa vân gỗ thật, nâng tầm khoang lái chỉ trong một buổi lắp đặt.'],
  ['Ốp nội thất vân carbon', 'noi-that-xe', 1950000, null, 'ink', false,
    'Bộ ốp vân carbon thể thao, phủ bóng chống xước, mang lại cảm giác mạnh mẽ cho nội thất.'],
  ['Bọc vô lăng da khâu tay', 'noi-that-xe', 650000, 780000, 'ink', true,
    'Da thật khâu tay, ôm chắc vô lăng, tăng độ bám và cảm giác lái cao cấp.'],
  ['Tựa đầu da memory foam', 'noi-that-xe', 680000, null, 'ink', false,
    'Gối tựa đầu foam hoạt tính bọc da, nâng đỡ cổ vai gáy trên những hành trình dài.'],
  ['Bọc cần số & bao tay phanh', 'noi-that-xe', 420000, null, 'walnut', false,
    'Bộ bọc cần số và bao tay phanh đồng bộ da thật, hoàn thiện chi tiết khoang lái.'],
  // Thảm lót sàn & cốp
  ['Thảm lót sàn 6D Carbon', 'tham-lot-san', 1850000, null, 'ink', true,
    'Thảm lót định hình 6D vân carbon, chống nước và bám bụi, viền may chắc chắn, dễ vệ sinh.'],
  ['Thảm lót sàn da PU cao cấp', 'tham-lot-san', 2400000, 2900000, 'walnut', true,
    'Thảm da PU phối chỉ tương phản, ôm khít sàn xe, cách âm và sang trọng.'],
  ['Thảm lót cốp định hình', 'tham-lot-san', 950000, null, 'ink', false,
    'Thảm lót cốp định hình theo dòng xe, thành cao chống tràn, bảo vệ khoang hành lý.'],
  ['Thảm taplo chống nắng', 'tham-lot-san', 380000, 450000, 'walnut', false,
    'Thảm phủ taplo chống chói và chống nứt do nắng, ôm sát đường nét bảng điều khiển.'],
  // Đèn & phụ kiện điện
  ['Đèn LED ambient nội thất 64 màu', 'den-phu-kien', 950000, 1180000, 'brass', true,
    'Dải LED ambient 64 màu cho khoang xe, điều khiển qua app, lắp đặt ẩn tinh tế.'],
  ['Đèn cửa chiếu logo', 'den-phu-kien', 320000, null, 'brass', false,
    'Đèn LED chiếu logo xuống mặt đất khi mở cửa, lắp đặt nhanh, tạo điểm nhấn đẳng cấp.'],
  ['Camera hành trình 2K Wifi', 'den-phu-kien', 1750000, 2100000, 'ink', true,
    'Camera hành trình độ phân giải 2K, kết nối Wifi, ghi hình trước/sau, cảnh báo va chạm.'],
  ['Tẩu sạc nhanh 3 cổng', 'den-phu-kien', 280000, null, 'brass', false,
    'Tẩu sạc đa cổng USB-A/USB-C công suất cao, sạc nhanh nhiều thiết bị, có vôn kế.'],
  ['Màn hình android box 9 inch', 'den-phu-kien', 3200000, 3800000, 'ink', false,
    'Màn hình giải trí Android tích hợp dẫn đường, camera 360 tuỳ chọn, kết nối CarPlay.'],
  // Chăm sóc & trang trí
  ['Nước hoa ô tô hương gỗ trầm', 'cham-soc-trang-tri', 250000, null, 'brass', true,
    'Nước hoa khoang xe hương gỗ trầm ấm áp, lưu hương lâu, kẹp cửa gió gọn gàng.'],
  ['Gối tựa lưng da cao cấp', 'cham-soc-trang-tri', 520000, 650000, 'walnut', false,
    'Gối tựa lưng bọc da, đỡ cột sống êm ái, đồng bộ phong cách nội thất xe.'],
  ['Bộ dung dịch vệ sinh nội thất', 'cham-soc-trang-tri', 390000, null, 'brass', false,
    'Bộ dưỡng và làm sạch da, nhựa, taplo — trả lại vẻ như mới cho nội thất xe.'],
];

const products = rawProducts.map((row, i) => {
  const [name, catSlug, price, compareAt, tone, featured, description] = row;
  return {
    id: i + 1,
    slug: slugify(name),
    name,
    categorySlug: catSlug,
    price,
    compareAt: compareAt || null,
    tone,
    featured: !!featured,
    description,
    images: [
      `/img/ph/${encodeURIComponent(name)}?tone=${tone}&v=1`,
      `/img/ph/${encodeURIComponent(name + ' · chi tiết')}?tone=${tone}&v=2`,
      `/img/ph/${encodeURIComponent(name + ' · góc khác')}?tone=${tone}&v=3`,
    ],
    stock: 30,
    sku: 'DC-' + String(1000 + i + 1),
    createdAt: new Date('2026-01-15T00:00:00Z').toISOString(),
  };
});

const coupons = [
  { code: 'WELCOME10', type: 'percent', value: 10, minSubtotal: 500000, active: true,
    description: 'Giảm 10% cho khách mới, đơn từ 500.000₫.' },
  { code: 'GIAM200K', type: 'fixed', value: 200000, minSubtotal: 2000000, active: true,
    description: 'Giảm ngay 200.000₫ cho đơn từ 2.000.000₫.' },
  { code: 'VIP15', type: 'percent', value: 15, minSubtotal: 3000000, active: true,
    description: 'Ưu đãi 15% cho đơn từ 3.000.000₫.' },
];

const blogPosts = [
  {
    slug: '5-mon-nang-cap-noi-that-xe-dang-tien',
    title: '5 món nâng cấp nội thất xe đáng tiền nhất',
    excerpt: 'Không cần chi quá nhiều, 5 hạng mục dưới đây thay đổi hoàn toàn cảm giác ngồi trong xe của bạn.',
    cover: 'ink',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-05-20',
    tag: 'Hướng dẫn',
    readMinutes: 6,
    body: [
      'Nâng cấp nội thất xe không nhất thiết phải tốn kém. Điều quan trọng là chọn đúng món mang lại khác biệt rõ rệt về cảm giác sử dụng hằng ngày.',
      'Đầu tiên là bọc ghế da. Một bộ ghế da vừa vặn, đường may sắc nét lập tức nâng tầm khoang lái và bảo vệ ghế nguyên bản. Tiếp theo, bọc vô lăng da khâu tay cải thiện độ bám và cảm giác lái mỗi ngày.',
      'Thứ ba, thảm lót sàn 6D giữ sàn xe luôn sạch và dễ vệ sinh. Thứ tư, đèn ambient tạo chiều sâu cho không gian buổi tối. Cuối cùng, một chai nước hoa hương gỗ trầm khép lại trải nghiệm tinh tế.',
      'Lời khuyên: hãy ưu tiên chất liệu thật và lắp đặt đúng kỹ thuật. Một món đồ tốt lắp ẩu vẫn hỏng trải nghiệm.',
    ],
  },
  {
    slug: 'boc-ghe-da-xe-hoi-chon-loai-da-nao',
    title: 'Bọc ghế da xe hơi: chọn loại da nào?',
    excerpt: 'Da Nappa, da PU hay da công nghiệp? Phân biệt nhanh để không trả tiền oan.',
    cover: 'walnut',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-05-08',
    tag: 'Kinh nghiệm',
    readMinutes: 5,
    body: [
      'Thị trường bọc ghế da rất đa dạng, và mức giá phản ánh khá rõ chất lượng da cũng như tay nghề may.',
      'Da Nappa là lựa chọn cao cấp: mềm, thoáng, bền màu và giữ form tốt. Da PU cao cấp có giá hợp lý hơn, vẻ ngoài đẹp nhưng cần chăm sóc đúng cách để giữ độ bền.',
      'Quan trọng không kém là kỹ thuật may ôm form theo đúng dòng xe. Đường may đều, ôm sát đệm ghế mới cho cảm giác liền khối và sang trọng.',
      'Tại DECOR CAR, mỗi bộ ghế được đo và may theo từng mẫu xe, kèm bảo hành và hỗ trợ lắp đặt.',
    ],
  },
  {
    slug: 'den-ambient-noi-that-tinh-te-hay-loe-loet',
    title: 'Đèn ambient nội thất: tinh tế hay loè loẹt?',
    excerpt: 'Bí quyết dùng đèn ambient sao cho sang, không biến khoang xe thành sàn disco.',
    cover: 'brass',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-04-22',
    tag: 'Mẹo nhỏ',
    readMinutes: 4,
    body: [
      'Đèn ambient là cách nhanh nhất để khoang xe có chiều sâu vào buổi tối. Nhưng dùng sai lại phản tác dụng.',
      'Nguyên tắc đầu tiên: chọn một đến hai tông màu chủ đạo, tránh nhấp nháy đổi màu liên tục khi đang lái. Ánh sáng nên hắt gián tiếp, ẩn theo đường viền taplo và cửa.',
      'Cường độ vừa phải, đủ tạo điểm nhấn mà không gây chói. Một dải LED chất lượng, lắp ẩn gọn gàng luôn sang hơn nhiều dải lắp lộ.',
    ],
  },
  {
    slug: 'tham-lot-san-6d-co-thuc-su-can-thiet',
    title: 'Thảm lót sàn 6D có thực sự cần thiết?',
    excerpt: 'Câu trả lời ngắn: có. Và đây là lý do cùng cách chọn thảm vừa khít.',
    cover: 'ink',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-04-05',
    tag: 'Hướng dẫn',
    readMinutes: 5,
    body: [
      'Sàn xe là nơi bám bụi, nước và bùn đất nhiều nhất. Một bộ thảm lót tốt giúp giữ sàn nguyên bản luôn sạch và bảo vệ giá trị xe khi bán lại.',
      'Thảm 6D định hình ôm khít từng hốc sàn, thành cao chống tràn nước, bề mặt dễ lau. Quan trọng là chọn đúng khuôn theo dòng xe để không xê dịch khi sử dụng.',
      'Hãy kiểm tra phần chân ga và phanh: thảm tốt không bao giờ vướng vào bàn đạp. An toàn luôn đặt trên thẩm mỹ.',
    ],
  },
];

async function run() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@decorcar.vn';
  const adminPassword = process.env.ADMIN_PASSWORD || 'DecorCar@2026';
  const hash = await bcrypt.hash(adminPassword, 10);

  // Vài đánh giá mẫu để trang sản phẩm sinh động
  const reviews = [
    { id: 1, productId: 1, name: 'Anh Minh', rating: 5, comment: 'Da đẹp, may ôm ghế, lắp nhanh. Rất hài lòng!', createdAt: '2026-05-25T00:00:00Z' },
    { id: 2, productId: 1, name: 'Chị Lan', rating: 4, comment: 'Chất lượng tốt, giao hơi chậm chút nhưng ổn.', createdAt: '2026-05-28T00:00:00Z' },
    { id: 3, productId: 7, name: 'Hoàng', rating: 5, comment: 'Thảm khít, chống nước tốt, dễ vệ sinh.', createdAt: '2026-06-01T00:00:00Z' },
    { id: 4, productId: 11, name: 'Tú Anh', rating: 5, comment: 'Đèn ambient lắp lên sang hẳn, app dễ dùng.', createdAt: '2026-06-10T00:00:00Z' },
  ];

  const data = {
    categories,
    products,
    users: [
      {
        id: 1,
        name: 'Quản trị viên',
        email: adminEmail,
        passwordHash: hash,
        role: 'admin',
        createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
      },
    ],
    orders: [],
    reviews,
    coupons,
    blogPosts,
    counters: {
      product: products.length,
      user: 1,
      order: 0,
      review: reviews.length,
    },
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log('✓ Đã tạo dữ liệu mẫu tại', DATA_FILE);
  console.log('  - Danh mục:', categories.length, '| Sản phẩm:', products.length);
  console.log('  - Blog:', blogPosts.length, '| Mã giảm giá:', coupons.length, '| Đánh giá:', reviews.length);
  console.log('  - Admin:', adminEmail, '/', adminPassword);
}

run().catch((err) => {
  console.error('Lỗi seed:', err);
  process.exit(1);
});

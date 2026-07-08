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

// Tương thích dòng xe.
//  - Món "đo ni theo xe" (bọc ghế, ốp nội thất, thảm định hình) → gắn danh sách hãng cụ thể.
//  - Phụ kiện dùng chung mọi xe (đèn, camera, tẩu sạc, nước hoa, gối…) → universalFit = true.
// Nhờ vậy bộ lọc "Tìm đồ theo dòng xe" cho kết quả có ý nghĩa (vừa món riêng, vừa món dùng chung).
const fitBySlug = {
  'boc-ghe-da-nappa-premium': ['toyota', 'honda', 'mazda', 'mercedes', 'vinfast'],
  'op-noi-that-van-go-veneer': ['toyota', 'honda', 'kia', 'mercedes'],
  'op-noi-that-van-carbon': ['ford', 'mazda', 'hyundai', 'vinfast'],
  'tham-lot-san-6d-carbon': ['toyota', 'honda', 'hyundai', 'kia', 'ford', 'mazda', 'vinfast', 'mercedes', 'mitsubishi'],
  'tham-lot-san-da-pu-cao-cap': ['toyota', 'mazda', 'kia', 'mercedes', 'vinfast'],
  'tham-lot-cop-dinh-hinh': ['toyota', 'honda', 'hyundai', 'ford'],
  'tham-taplo-chong-nang': ['toyota', 'honda', 'kia', 'hyundai'],
};
// Món đo ni nhưng bán cho mọi xe (bọc vô lăng, tựa đầu, bọc cần số) vẫn coi là dùng chung.
const universalSlugs = new Set([
  'boc-vo-lang-da-khau-tay',
  'tua-dau-da-memory-foam',
  'boc-can-so-bao-tay-phanh',
]);

// Ảnh thật (stock miễn phí bản quyền — Unsplash) đặt tại public/img/products/.
// Mỗi slug → danh sách file ảnh theo thứ tự hiển thị (ảnh đầu là ảnh chính).
const IMG = (n) => `/img/products/${n}.jpg`;
const realImages = {
  'boc-ghe-da-nappa-premium': ['leather-1', 'leather-2', 'cushion-1'],
  'op-noi-that-van-go-veneer': ['wood-1', 'wood-2', 'carbon-1'],
  'op-noi-that-van-carbon': ['carbon-1', 'carbon-2', 'dashboard-2'],
  'boc-vo-lang-da-khau-tay': ['steering-1', 'steering-2'],
  'tua-dau-da-memory-foam': ['cushion-1', 'cushion-3'],
  'boc-can-so-bao-tay-phanh': ['carbon-2', 'steering-2'],
  'tham-lot-san-6d-carbon': ['floormat-1', 'floormat-3'],
  'tham-lot-san-da-pu-cao-cap': ['floormat-2', 'floormat-1'],
  'tham-lot-cop-dinh-hinh': ['trunk-1', 'trunk-2'],
  'tham-taplo-chong-nang': ['dashboard-1', 'dashboard-2'],
  'den-led-ambient-noi-that-64-mau': ['ambient-1', 'ambient-3', 'ambient-2'],
  'den-cua-chieu-logo': ['ambient-2', 'ambient-1'],
  'camera-hanh-trinh-2k-wifi': ['dashcam-1', 'dashcam-2'],
  'tau-sac-nhanh-3-cong': ['charger-1', 'charger-2'],
  'man-hinh-android-box-9-inch': ['screen-1', 'screen-2'],
  'nuoc-hoa-o-to-huong-go-tram': ['freshener-1', 'freshener-2'],
  'goi-tua-lung-da-cao-cap': ['cushion-2', 'cushion-1'],
  'bo-dung-dich-ve-sinh-noi-that': ['cleaning-1', 'cleaning-2'],
};

const products = rawProducts.map((row, i) => {
  const [name, catSlug, price, compareAt, tone, featured, description] = row;
  const slug = slugify(name);
  const fittedBrands = fitBySlug[slug] || null;
  const universalFit = !fittedBrands && (universalSlugs.has(slug)
    || catSlug === 'den-phu-kien' || catSlug === 'cham-soc-trang-tri');
  const imgs = realImages[slug]
    ? realImages[slug].map(IMG)
    : [`/img/ph/${encodeURIComponent(name)}?tone=${tone}&v=1`];
  return {
    id: i + 1,
    slug,
    name,
    categorySlug: catSlug,
    price,
    compareAt: compareAt || null,
    tone,
    featured: !!featured,
    description,
    brands: fittedBrands || [],
    universalFit,
    images: imgs,
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

// Link nội bộ dùng trong bài (SEO + điều hướng): trỏ tới trang sản phẩm/danh mục.
const L = {
  gheDa: '<a href="/san-pham/boc-ghe-da-nappa-premium">bọc ghế da Nappa</a>',
  voLang: '<a href="/san-pham/boc-vo-lang-da-khau-tay">bọc vô lăng da khâu tay</a>',
  canSo: '<a href="/san-pham/boc-can-so-bao-tay-phanh">bộ bọc cần số</a>',
  opGo: '<a href="/san-pham/op-noi-that-van-go-veneer">ốp nội thất vân gỗ</a>',
  opCarbon: '<a href="/san-pham/op-noi-that-van-carbon">ốp nội thất vân carbon</a>',
  tham6D: '<a href="/san-pham/tham-lot-san-6d-carbon">thảm lót sàn 6D</a>',
  thamPU: '<a href="/san-pham/tham-lot-san-da-pu-cao-cap">thảm lót sàn da PU</a>',
  thamCop: '<a href="/san-pham/tham-lot-cop-dinh-hinh">thảm lót cốp định hình</a>',
  thamTaplo: '<a href="/san-pham/tham-taplo-chong-nang">thảm taplo chống nắng</a>',
  ambient: '<a href="/san-pham/den-led-ambient-noi-that-64-mau">đèn LED ambient 64 màu</a>',
  denCua: '<a href="/san-pham/den-cua-chieu-logo">đèn cửa chiếu logo</a>',
  camera: '<a href="/san-pham/camera-hanh-trinh-2k-wifi">camera hành trình 2K</a>',
  tauSac: '<a href="/san-pham/tau-sac-nhanh-3-cong">tẩu sạc nhanh 3 cổng</a>',
  manHinh: '<a href="/san-pham/man-hinh-android-box-9-inch">màn hình Android box 9 inch</a>',
  nuocHoa: '<a href="/san-pham/nuoc-hoa-o-to-huong-go-tram">nước hoa ô tô hương gỗ trầm</a>',
  tuaDau: '<a href="/san-pham/tua-dau-da-memory-foam">tựa đầu da memory foam</a>',
  goiLung: '<a href="/san-pham/goi-tua-lung-da-cao-cap">gối tựa lưng da</a>',
  veSinh: '<a href="/san-pham/bo-dung-dich-ve-sinh-noi-that">bộ dung dịch vệ sinh nội thất</a>',
  catNoiThat: '<a href="/danh-muc/noi-that-xe">nội thất xe</a>',
  catTham: '<a href="/danh-muc/tham-lot-san">thảm lót sàn & cốp</a>',
  catDen: '<a href="/danh-muc/den-phu-kien">đèn & phụ kiện điện</a>',
  catCham: '<a href="/danh-muc/cham-soc-trang-tri">chăm sóc & trang trí</a>',
  cuaHang: '<a href="/cua-hang">cửa hàng</a>',
};

const blogPosts = [
  {
    slug: '5-mon-nang-cap-noi-that-xe-dang-tien',
    title: '5 món nâng cấp nội thất xe đáng tiền nhất',
    excerpt: 'Không cần chi quá nhiều, 5 hạng mục dưới đây thay đổi hoàn toàn cảm giác ngồi trong xe của bạn.',
    cover: 'ink',
    coverImg: '/img/products/leather-3.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-03-10',
    tag: 'Hướng dẫn',
    readMinutes: 6,
    related: ['boc-ghe-da-nappa-premium', 'boc-vo-lang-da-khau-tay', 'tham-lot-san-6d-carbon', 'den-led-ambient-noi-that-64-mau', 'nuoc-hoa-o-to-huong-go-tram'],
    body: [
      'Nâng cấp nội thất xe không nhất thiết phải tốn kém. Điều quan trọng là chọn đúng món mang lại khác biệt rõ rệt về cảm giác sử dụng hằng ngày, thay vì chạy theo số lượng phụ kiện.',
      'Đầu tiên là ' + L.gheDa + '. Một bộ ghế da vừa vặn, đường may sắc nét lập tức nâng tầm khoang lái và bảo vệ ghế nguyên bản. Tiếp theo, ' + L.voLang + ' cải thiện độ bám và cảm giác lái mỗi ngày.',
      'Thứ ba, ' + L.tham6D + ' giữ sàn xe luôn sạch và dễ vệ sinh. Thứ tư, ' + L.ambient + ' tạo chiều sâu cho không gian buổi tối. Cuối cùng, ' + L.nuocHoa + ' khép lại trải nghiệm tinh tế bằng một mùi hương dễ chịu.',
      'Lời khuyên: hãy ưu tiên chất liệu thật và lắp đặt đúng kỹ thuật. Một món đồ tốt nhưng lắp ẩu vẫn hỏng trải nghiệm. Xem toàn bộ hạng mục ' + L.catNoiThat + ' để lên kế hoạch nâng cấp phù hợp ngân sách.',
    ],
  },
  {
    slug: 'boc-ghe-da-xe-hoi-chon-loai-da-nao',
    title: 'Bọc ghế da xe hơi: chọn loại da nào?',
    excerpt: 'Da Nappa, da PU hay da công nghiệp? Phân biệt nhanh để không trả tiền oan.',
    cover: 'walnut',
    coverImg: '/img/products/leather-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-02-18',
    tag: 'Kinh nghiệm',
    readMinutes: 5,
    related: ['boc-ghe-da-nappa-premium', 'tham-lot-san-da-pu-cao-cap', 'bo-dung-dich-ve-sinh-noi-that'],
    body: [
      'Thị trường bọc ghế da rất đa dạng, và mức giá phản ánh khá rõ chất lượng da cũng như tay nghề may. Hiểu đúng vài loại da phổ biến giúp bạn chọn được sản phẩm bền đẹp với đúng ngân sách.',
      'Da Nappa là lựa chọn cao cấp: mềm, thoáng, bền màu và giữ form tốt — đây là chất liệu của ' + L.gheDa + ' tại DECOR CAR. Da PU cao cấp (như trên ' + L.thamPU + ') có giá hợp lý hơn, vẻ ngoài đẹp nhưng cần chăm sóc đúng cách để giữ độ bền.',
      'Quan trọng không kém là kỹ thuật may ôm form theo đúng dòng xe. Đường may đều, ôm sát đệm ghế mới cho cảm giác liền khối và sang trọng, đồng thời không bị xô lệch khi sử dụng lâu dài.',
      'Sau khi bọc, nên dưỡng da định kỳ bằng ' + L.veSinh + ' để da luôn mềm và bền màu. Mỗi bộ ghế tại cửa hàng đều được đo và may theo từng mẫu xe, kèm bảo hành và hỗ trợ lắp đặt.',
    ],
  },
  {
    slug: 'op-noi-that-van-go-hay-van-carbon',
    title: 'Ốp nội thất vân gỗ hay vân carbon: chọn phong cách nào?',
    excerpt: 'Sang trọng ấm áp hay thể thao mạnh mẽ? So sánh hai chất liệu ốp nội thất được ưa chuộng nhất.',
    cover: 'walnut',
    coverImg: '/img/products/wood-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-06-25',
    tag: 'Kinh nghiệm',
    readMinutes: 5,
    related: ['op-noi-that-van-go-veneer', 'op-noi-that-van-carbon', 'boc-can-so-bao-tay-phanh'],
    body: [
      'Ốp nội thất là cách đổi hoàn toàn "khí chất" khoang lái mà không cần thay đồ nội thất lớn. Hai lựa chọn phổ biến nhất là vân gỗ và vân carbon, mỗi loại mang một cá tính riêng.',
      L.opGo.charAt(0).toUpperCase() + L.opGo.slice(1) + ' mang lại cảm giác ấm áp, cổ điển và sang trọng — hợp với dòng sedan gia đình hoặc người thích sự lịch lãm. Vân gỗ thật (veneer) có chiều sâu và độ chân thực mà loại in giả khó sánh được.',
      'Ngược lại, ' + L.opCarbon + ' cho vẻ thể thao, hiện đại và trẻ trung, hợp gu người mê xe hiệu suất. Bề mặt phủ bóng chống xước giúp giữ nét lâu dài. Bạn có thể đồng bộ thêm ' + L.canSo + ' để hoàn thiện chi tiết.',
      'Lời khuyên: chọn chất liệu ăn nhập với tông ghế và bảng taplo sẵn có. Xem thêm các lựa chọn trong danh mục ' + L.catNoiThat + ' để phối hợp hài hoà.',
    ],
  },
  {
    slug: 'den-ambient-noi-that-tinh-te-hay-loe-loet',
    title: 'Đèn ambient nội thất: tinh tế hay loè loẹt?',
    excerpt: 'Bí quyết dùng đèn ambient sao cho sang, không biến khoang xe thành sàn disco.',
    cover: 'brass',
    coverImg: '/img/products/ambient-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-04-22',
    tag: 'Mẹo nhỏ',
    readMinutes: 4,
    related: ['den-led-ambient-noi-that-64-mau', 'den-cua-chieu-logo'],
    body: [
      'Đèn ambient là cách nhanh nhất để khoang xe có chiều sâu vào buổi tối. Nhưng dùng sai lại phản tác dụng, khiến nội thất rối và mất sang.',
      'Nguyên tắc đầu tiên: chọn một đến hai tông màu chủ đạo, tránh nhấp nháy đổi màu liên tục khi đang lái. Ánh sáng nên hắt gián tiếp, ẩn theo đường viền taplo và cửa — đây là ưu điểm của ' + L.ambient + ' khi lắp đặt đúng kỹ thuật.',
      'Cường độ vừa phải, đủ tạo điểm nhấn mà không gây chói. Một dải LED chất lượng, lắp ẩn gọn gàng luôn sang hơn nhiều dải lắp lộ. Kết hợp thêm ' + L.denCua + ' tạo điểm nhấn đẳng cấp mỗi khi mở cửa.',
      'Xem thêm các lựa chọn ánh sáng trong danh mục ' + L.catDen + ' để chọn giải pháp phù hợp cho xe của bạn.',
    ],
  },
  {
    slug: 'tham-lot-san-6d-co-thuc-su-can-thiet',
    title: 'Thảm lót sàn 6D có thực sự cần thiết?',
    excerpt: 'Câu trả lời ngắn: có. Và đây là lý do cùng cách chọn thảm vừa khít.',
    cover: 'ink',
    coverImg: '/img/products/floormat-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-04-05',
    tag: 'Hướng dẫn',
    readMinutes: 5,
    related: ['tham-lot-san-6d-carbon', 'tham-lot-san-da-pu-cao-cap', 'tham-lot-cop-dinh-hinh'],
    body: [
      'Sàn xe là nơi bám bụi, nước và bùn đất nhiều nhất. Một bộ thảm lót tốt giúp giữ sàn nguyên bản luôn sạch và bảo vệ giá trị xe khi bán lại.',
      L.tham6D.charAt(0).toUpperCase() + L.tham6D.slice(1) + ' định hình ôm khít từng hốc sàn, thành cao chống tràn nước, bề mặt dễ lau. Nếu thích cảm giác cao cấp và êm hơn, ' + L.thamPU + ' là lựa chọn đáng cân nhắc.',
      'Quan trọng là chọn đúng khuôn theo dòng xe để thảm không xê dịch khi sử dụng. Hãy kiểm tra phần chân ga và phanh: thảm tốt không bao giờ vướng vào bàn đạp. An toàn luôn đặt trên thẩm mỹ.',
      'Đừng quên khoang hành lý: một bộ ' + L.thamCop + ' giúp chống tràn và bảo vệ cốp khỏi vết bẩn. Xem đầy đủ trong danh mục ' + L.catTham + '.',
    ],
  },
  {
    slug: 'camera-hanh-trinh-vi-sao-moi-xe-nen-co',
    title: 'Camera hành trình: vì sao mọi xe nên có?',
    excerpt: 'Bằng chứng khi va chạm, chống gian lận và an tâm mỗi chuyến đi — cùng cách chọn camera 2K.',
    cover: 'ink',
    coverImg: '/img/products/dashcam-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-06-15',
    tag: 'Công nghệ',
    readMinutes: 6,
    related: ['camera-hanh-trinh-2k-wifi', 'tau-sac-nhanh-3-cong', 'man-hinh-android-box-9-inch'],
    body: [
      'Camera hành trình đã chuyển từ "phụ kiện xa xỉ" thành trang bị gần như bắt buộc. Lý do đơn giản: nó ghi lại bằng chứng khách quan khi xảy ra va chạm hay tranh chấp giao thông.',
      'Khi chọn mua, hãy ưu tiên độ phân giải và góc quay. ' + L.camera.charAt(0).toUpperCase() + L.camera.slice(1) + ' cho hình sắc nét, đọc rõ biển số ngay cả trong điều kiện thiếu sáng, kèm kết nối Wifi để xem lại nhanh trên điện thoại.',
      'Tính năng ghi hình trước/sau và cảnh báo va chạm giúp bạn an tâm hơn khi đỗ xe qua đêm. Nên đi dây gọn gàng, giấu khéo theo trần và trụ A để không ảnh hưởng tầm nhìn.',
      'Kết hợp một ' + L.tauSac + ' chất lượng để cấp nguồn ổn định cho các thiết bị. Khám phá thêm phụ kiện điện tử trong danh mục ' + L.catDen + '.',
    ],
  },
  {
    slug: 'boc-vo-lang-da-khau-tay-co-dang-tien',
    title: 'Bọc vô lăng da khâu tay có đáng tiền?',
    excerpt: 'Chi tiết nhỏ bạn chạm vào nhiều nhất mỗi ngày — và vì sao nó xứng đáng được nâng cấp.',
    cover: 'walnut',
    coverImg: '/img/products/steering-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-05-30',
    tag: 'Kinh nghiệm',
    readMinutes: 4,
    related: ['boc-vo-lang-da-khau-tay', 'boc-can-so-bao-tay-phanh', 'boc-ghe-da-nappa-premium'],
    body: [
      'Vô lăng là chi tiết đôi tay bạn tiếp xúc nhiều nhất. Sau vài năm, lớp da nguyên bản dễ bị bóng mòn, trơn tay hoặc bong tróc — ảnh hưởng cả thẩm mỹ lẫn độ an toàn.',
      L.voLang.charAt(0).toUpperCase() + L.voLang.slice(1) + ' giải quyết trọn vẹn điều đó: da thật khâu tay ôm chắc, tăng độ bám và cảm giác lái chắc chắn hơn hẳn. Đường chỉ khâu tay còn tạo điểm nhấn thủ công tinh tế.',
      'Để đồng bộ, nhiều khách chọn thêm ' + L.canSo + ' cùng tông da. Chi tiết nhỏ nhưng khi phối hợp sẽ tạo cảm giác khoang lái được "may đo" liền khối.',
      'Nếu bạn đang cân nhắc nâng cấp lớn hơn, hãy tham khảo cả ' + L.gheDa + ' để đồng bộ toàn bộ chất liệu da trong xe.',
    ],
  },
  {
    slug: 'chon-tham-lot-cop-bao-ve-khoang-hanh-ly',
    title: 'Chọn thảm lót cốp: bảo vệ khoang hành lý đúng cách',
    excerpt: 'Cốp xe là nơi dễ bẩn và ẩm nhất. Một tấm thảm định hình tốt giúp bạn tiết kiệm rất nhiều công vệ sinh.',
    cover: 'ink',
    coverImg: '/img/products/trunk-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-05-12',
    tag: 'Hướng dẫn',
    readMinutes: 4,
    related: ['tham-lot-cop-dinh-hinh', 'tham-taplo-chong-nang', 'tham-lot-san-6d-carbon'],
    body: [
      'Khoang hành lý thường xuyên chứa đồ ẩm, thực phẩm, giày dép hay đồ thể thao — những thứ dễ để lại vết bẩn và mùi khó chịu trên nỉ nguyên bản.',
      L.thamCop.charAt(0).toUpperCase() + L.thamCop.slice(1) + ' ôm khít theo dòng xe, thành cao chống tràn nước, giúp bạn chỉ cần nhấc thảm ra lau là sạch. Đây là khoản đầu tư nhỏ nhưng bảo vệ giá trị xe rất hiệu quả.',
      'Đừng bỏ quên bảng taplo: ' + L.thamTaplo + ' chống chói và chống nứt do nắng gắt, đặc biệt hữu ích với khí hậu nắng nóng. Kết hợp cùng ' + L.tham6D + ' cho sàn để bảo vệ toàn diện.',
      'Xem trọn bộ giải pháp bảo vệ trong danh mục ' + L.catTham + '.',
    ],
  },
  {
    slug: 'nuoc-hoa-o-to-chon-huong-va-khu-mui',
    title: 'Nước hoa ô tô: chọn hương và khử mùi khoang xe',
    excerpt: 'Mùi hương định hình cảm xúc chuyến đi. Chọn đúng và khử mùi đúng cách để xe luôn dễ chịu.',
    cover: 'brass',
    coverImg: '/img/products/freshener-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-03-28',
    tag: 'Mẹo nhỏ',
    readMinutes: 4,
    related: ['nuoc-hoa-o-to-huong-go-tram', 'bo-dung-dich-ve-sinh-noi-that'],
    body: [
      'Một khoang xe thơm dễ chịu giúp mỗi chuyến đi thư thái hơn, đặc biệt khi kẹt xe hay đi đường dài. Nhưng chọn hương và cách dùng cũng cần một chút tinh tế.',
      'Với xe hơi, các hương trầm ấm thường được ưa chuộng vì tạo cảm giác sang trọng, thư giãn mà không gắt. ' + L.nuocHoa.charAt(0).toUpperCase() + L.nuocHoa.slice(1) + ' lưu hương lâu, kẹp gọn ở cửa gió nên toả đều mà không chiếm chỗ.',
      'Lưu ý quan trọng: nước hoa chỉ nên dùng sau khi đã khử sạch mùi gốc. Nếu khoang xe còn ám mùi ẩm mốc hay thức ăn, hãy vệ sinh trước bằng ' + L.veSinh + ' rồi mới dùng hương — nếu không, hai mùi trộn vào nhau sẽ càng khó chịu.',
      'Thay đổi hương theo mùa cũng là một mẹo hay để không bị "chai" khứu giác. Khám phá thêm trong danh mục ' + L.catCham + '.',
    ],
  },
  {
    slug: 'cham-soc-noi-that-da-o-to-dung-cach',
    title: 'Chăm sóc nội thất da ô tô đúng cách',
    excerpt: 'Da đẹp bền hay nhanh nứt phụ thuộc phần lớn vào cách bạn vệ sinh và dưỡng hằng ngày.',
    cover: 'walnut',
    coverImg: '/img/products/cleaning-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-07-01',
    tag: 'Chăm sóc xe',
    readMinutes: 5,
    related: ['bo-dung-dich-ve-sinh-noi-that', 'boc-ghe-da-nappa-premium', 'goi-tua-lung-da-cao-cap'],
    body: [
      'Da là chất liệu đẹp nhưng "khó tính": nắng nóng, mồ hôi và bụi bẩn khiến da khô, bạc màu và nứt theo thời gian nếu không chăm sóc đúng.',
      'Nguyên tắc là làm sạch nhẹ nhàng rồi dưỡng ẩm định kỳ. Dùng ' + L.veSinh + ' để làm sạch bụi, dầu và dưỡng lại độ mềm — tránh dùng hoá chất mạnh hay bàn chải cứng làm trầy bề mặt da.',
      'Với xe có ' + L.gheDa + ' hay ' + L.goiLung + ', nên lau khô sau khi vệ sinh và tránh phơi nắng trực tiếp quá lâu. Một tấm che nắng khi đỗ xe ngoài trời cũng giúp da bền màu hơn nhiều.',
      'Chăm sóc đều đặn mỗi 1–2 tháng sẽ giữ nội thất như mới trong nhiều năm. Xem thêm bộ sản phẩm trong danh mục ' + L.catCham + '.',
    ],
  },
  {
    slug: 'man-hinh-android-o-to-co-nen-lap',
    title: 'Màn hình Android cho ô tô: có nên lắp?',
    excerpt: 'CarPlay, dẫn đường, camera 360 và giải trí — khi nào một chiếc màn hình Android là đáng tiền.',
    cover: 'ink',
    coverImg: '/img/products/screen-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-06-08',
    tag: 'Công nghệ',
    readMinutes: 6,
    related: ['man-hinh-android-box-9-inch', 'camera-hanh-trinh-2k-wifi', 'tau-sac-nhanh-3-cong'],
    body: [
      'Nhiều xe đời cũ chỉ có màn hình nhỏ hoặc đầu CD lỗi thời. Nâng cấp lên màn hình Android mở ra cả một hệ sinh thái giải trí và tiện ích hiện đại.',
      L.manHinh.charAt(0).toUpperCase() + L.manHinh.slice(1) + ' tích hợp dẫn đường, kết nối CarPlay/Android Auto, và tuỳ chọn camera 360 giúp lùi đỗ an toàn. Giao diện lớn, cảm ứng mượt, thao tác trực quan hơn hẳn màn zin.',
      'Trước khi lắp, hãy kiểm tra kích thước hốc màn hình và giắc kết nối theo dòng xe để đảm bảo lắp "zin" gọn gàng, không phải cắt gọt taplo. Việc này nên do kỹ thuật viên có kinh nghiệm thực hiện.',
      'Kết hợp cùng ' + L.camera + ' để có giải pháp an toàn trọn vẹn. Xem thêm phụ kiện công nghệ trong danh mục ' + L.catDen + '.',
    ],
  },
  {
    slug: 'sac-dien-thoai-tren-o-to-an-toan',
    title: 'Sạc điện thoại trên ô tô sao cho nhanh và an toàn',
    excerpt: 'Không phải tẩu sạc nào cũng giống nhau. Chọn đúng để sạc nhanh mà không hại thiết bị.',
    cover: 'brass',
    coverImg: '/img/products/charger-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-05-05',
    tag: 'Công nghệ',
    readMinutes: 4,
    related: ['tau-sac-nhanh-3-cong', 'man-hinh-android-box-9-inch', 'camera-hanh-trinh-2k-wifi'],
    body: [
      'Điện thoại vừa dẫn đường vừa sạc trên xe rất dễ bị nóng và tụt pin thay vì đầy. Nguyên nhân thường nằm ở chiếc tẩu sạc công suất thấp hoặc kém chất lượng.',
      'Một ' + L.tauSac + ' tốt hỗ trợ sạc nhanh chuẩn USB-C PD/QC, có nhiều cổng để sạc đồng thời điện thoại, camera và các thiết bị khác. Vôn kế hiển thị giúp bạn theo dõi điện áp bình để tránh sự cố.',
      'Hãy chọn sản phẩm có mạch bảo vệ quá dòng, quá nhiệt để an toàn cho cả thiết bị lẫn hệ điện của xe. Tránh các loại trôi nổi không rõ nguồn gốc vì rủi ro chập cháy.',
      'Nếu xe bạn dùng nhiều thiết bị điện (' + L.manHinh + ', ' + L.camera + '…), một nguồn cấp ổn định là điều bắt buộc. Xem thêm trong danh mục ' + L.catDen + '.',
    ],
  },
  {
    slug: 'goi-tua-dau-tua-lung-di-xa-khong-moi',
    title: 'Gối tựa đầu & tựa lưng: đi xa không mỏi',
    excerpt: 'Chi tiết nhỏ tạo khác biệt lớn cho cột sống và cổ vai gáy trên những hành trình dài.',
    cover: 'walnut',
    coverImg: '/img/products/cushion-1.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-04-15',
    tag: 'Mẹo nhỏ',
    readMinutes: 4,
    related: ['tua-dau-da-memory-foam', 'goi-tua-lung-da-cao-cap', 'boc-ghe-da-nappa-premium'],
    body: [
      'Ngồi lái nhiều giờ liền dễ gây mỏi cổ, vai và thắt lưng — nhất là khi ghế zin chưa nâng đỡ tốt đường cong tự nhiên của cơ thể.',
      L.tuaDau.charAt(0).toUpperCase() + L.tuaDau.slice(1) + ' ôm vừa vùng cổ gáy, giảm căng cơ khi phải dừng đèn đỏ hay kẹt xe liên tục. Chất liệu memory foam định hình theo dáng người nên rất êm.',
      'Kết hợp với ' + L.goiLung + ', bạn sẽ giữ được tư thế ngồi chuẩn hơn, đỡ đau lưng sau những chuyến đi dài. Cả hai đều bọc da đồng bộ với nội thất, không phá tông thẩm mỹ.',
      'Đây là nâng cấp chi phí thấp nhưng hiệu quả rõ rệt về sức khoẻ. Xem thêm trong danh mục ' + L.catCham + '.',
    ],
  },
  {
    slug: 'nang-cap-anh-sang-khoang-lai',
    title: 'Nâng cấp ánh sáng khoang lái: từ đèn cửa tới ambient',
    excerpt: 'Ánh sáng đúng cách biến khoang xe bình thường thành không gian có chiều sâu và đẳng cấp.',
    cover: 'brass',
    coverImg: '/img/products/ambient-2.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-07-04',
    tag: 'Hướng dẫn',
    readMinutes: 5,
    related: ['den-cua-chieu-logo', 'den-led-ambient-noi-that-64-mau', 'op-noi-that-van-carbon'],
    body: [
      'Ánh sáng là yếu tố dễ bị bỏ qua nhưng lại thay đổi cảm nhận về khoang xe nhiều nhất, đặc biệt vào buổi tối.',
      'Bắt đầu đơn giản với ' + L.denCua + ': mỗi khi mở cửa, logo chiếu xuống mặt đất tạo điểm nhấn đẳng cấp, lắp đặt nhanh và không đục khoét. Đây là bước "khởi động" nhẹ nhàng cho ai mới nâng cấp ánh sáng.',
      'Muốn nâng tầm hơn, ' + L.ambient + ' cho phép tuỳ biến màu và cường độ theo tâm trạng, hắt sáng gián tiếp theo viền taplo và cửa. Bí quyết là tiết chế — một đến hai tông màu là đủ sang.',
      'Phối ánh sáng với chất liệu ốp phù hợp (ví dụ ' + L.opCarbon + ') sẽ tạo tổng thể liền mạch. Xem thêm giải pháp trong danh mục ' + L.catDen + '.',
    ],
  },
  {
    slug: 'checklist-nang-cap-noi-that-theo-dong-xe',
    title: 'Checklist nâng cấp nội thất theo từng dòng xe',
    excerpt: 'Toyota, Honda, VinFast hay Mercedes — đây là cách lên danh sách nâng cấp hợp xe và hợp túi tiền.',
    cover: 'ink',
    coverImg: '/img/products/leather-2.jpg',
    author: 'Đội ngũ DECOR CAR',
    date: '2026-06-30',
    tag: 'Hướng dẫn',
    readMinutes: 6,
    related: ['boc-ghe-da-nappa-premium', 'tham-lot-san-6d-carbon', 'op-noi-that-van-go-veneer'],
    body: [
      'Mỗi dòng xe có kích thước khoang, kiểu ghế và taplo khác nhau, nên đồ nội thất cần "đo ni" theo đúng xe để vừa khít và đẹp. Đó là lý do bạn nên lọc sản phẩm theo hãng trước khi mua.',
      'Tại DECOR CAR, bạn có thể dùng bộ chọn "Tìm đồ theo dòng xe" ngay ở trang chủ hoặc trong ' + L.cuaHang + ' để lọc nhanh sản phẩm hợp xe mình. Các món đo ni như ' + L.gheDa + ', ' + L.tham6D + ' và ' + L.opGo + ' sẽ hiển thị đúng hãng tương thích.',
      'Gợi ý lộ trình: ưu tiên món dùng hằng ngày trước (thảm sàn, bọc vô lăng), sau đó tới hạng mục thẩm mỹ (ốp nội thất, ambient), rồi phụ kiện công nghệ (camera, màn hình). Cách chia giai đoạn giúp bạn kiểm soát ngân sách tốt hơn.',
      'Cuối cùng, đừng quên phần chăm sóc để giữ mọi thứ luôn như mới. Nếu chưa chắc món nào hợp xe, hãy nhắn hotline kèm dòng xe để được tư vấn — hoặc bắt đầu ngay tại ' + L.cuaHang + '.',
    ],
  },
];

// Gán chuyên mục blog (theo nhóm sản phẩm) cho từng bài.
const blogCatMap = {
  '5-mon-nang-cap-noi-that-xe-dang-tien': 'noi-that',
  'boc-ghe-da-xe-hoi-chon-loai-da-nao': 'noi-that',
  'op-noi-that-van-go-hay-van-carbon': 'noi-that',
  'boc-vo-lang-da-khau-tay-co-dang-tien': 'noi-that',
  'checklist-nang-cap-noi-that-theo-dong-xe': 'noi-that',
  'tham-lot-san-6d-co-thuc-su-can-thiet': 'tham-lot',
  'chon-tham-lot-cop-bao-ve-khoang-hanh-ly': 'tham-lot',
  'den-ambient-noi-that-tinh-te-hay-loe-loet': 'den-cong-nghe',
  'camera-hanh-trinh-vi-sao-moi-xe-nen-co': 'den-cong-nghe',
  'man-hinh-android-o-to-co-nen-lap': 'den-cong-nghe',
  'sac-dien-thoai-tren-o-to-an-toan': 'den-cong-nghe',
  'nang-cap-anh-sang-khoang-lai': 'den-cong-nghe',
  'nuoc-hoa-o-to-chon-huong-va-khu-mui': 'cham-soc',
  'cham-soc-noi-that-da-o-to-dung-cach': 'cham-soc',
  'goi-tua-dau-tua-lung-di-xa-khong-moi': 'cham-soc',
};
blogPosts.forEach((p) => {
  p.category = blogCatMap[p.slug] || 'noi-that';
});

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

# CLAUDE.md — Ngữ cảnh dự án & hướng dẫn tiếp tục

> File này để **bất kỳ phiên Claude Code nào (kể cả trên tài khoản khác)** đọc và tiếp tục
> công việc. Bộ nhớ riêng của Claude **không** theo tài khoản — mọi ngữ cảnh cần biết đều
> nằm trong file này + repo. Đọc hết trước khi làm.

## 1. Dự án là gì

**DECOR CAR** — website thương mại điện tử bán **nội thất & phụ kiện trang trí xe ô tô** cao cấp
(bọc ghế da, ốp nội thất gỗ/carbon, thảm lót sàn, đèn ambient, camera, nước hoa…).
Phong cách thiết kế: **sang trọng tối giản** (gỗ óc chó · da · đồng thau).

- **Stack:** Node.js + Express + **EJS (server-side rendering)**, JSON store thuần (không cần DB).
- **Không dùng** framework CSS/JS — CSS thủ công (`public/css/styles.css`), JS vanilla (`public/js/main.js`).
- **GitHub:** `https://github.com/vuminh0422-del/DECOR-CAR.git` — nhánh `main`.

## 2. Tiếp tục trên máy / tài khoản mới  ⭐

```bash
git clone https://github.com/vuminh0422-del/DECOR-CAR.git
cd DECOR-CAR
npm install
cp .env.example .env      # sửa nếu cần
npm run seed              # BẮT BUỘC: tạo src/db/data.json (bị gitignore, không có trong repo)
npm start                 # hoặc: npm run dev  (tự reload)
# Mở http://localhost:3000  —  Admin: /quan-tri  (admin@decorcar.vn / DecorCar@2026)
```

## 3. Trạng thái hiện tại (cập nhật 2026-07-08)

Website **hoàn thành & test pass**, không lỗi console. Toàn bộ đã **commit & push** lên GitHub.
**Việc đang chờ user:** *deploy Hostinger VPS* (làm sau — xem README mục "Deploy lên Hostinger VPS").

Thông tin cửa hàng (SĐT, địa chỉ, số tài khoản) hiện là **mẫu** trong `.env`; ảnh sản phẩm là
**ảnh stock miễn phí (Unsplash)** — thay bằng dữ liệu/ảnh thật khi cửa hàng cung cấp.

## 4. Quy ước & kiến trúc

- **View:** `express-ejs-layouts`, layout gốc `views/layout.ejs`; partials trong `views/partials/`
  (`header`, `footer`, `product-card`, `trust-strip`); trang trong `views/pages/`; admin trong `views/admin/`.
- **Dữ liệu:** mọi truy cập qua `src/db/database.js` (JSON store, cache trong RAM). Có thể thay bằng
  MySQL sau này mà không đụng route/view.
- **Design tokens:** khai báo ở `:root` trong `styles.css` (màu `--brass #bc8a3c`, font Marcellus/Manrope,
  chữ ký khung `.frame` với góc tick đồng). Giữ đúng hệ này khi thêm UI mới.
- **URL tiếng Việt có dấu** → slug qua `slugify()` trong `src/util.js`.
- **Locals dùng chung** set ở `server.js` (`store`, `categories`, `carBrands`, `brandName`,
  `ratingFor`, `formatVND`, `starString`…).

## 5. Data model (các trường quan trọng)

`products[]`: `{ id, slug, name, categorySlug, price, compareAt, tone, featured, description,`
`brands[], universalFit, images[], stock, sku, createdAt }`
- **`brands[]` + `universalFit`**: tương thích dòng xe. Taxonomy hãng xe tĩnh = `CAR_BRANDS` trong
  `src/util.js`. Món `universalFit:true` hợp mọi xe; món có `brands` chỉ hợp hãng liệt kê.
- **`images[]`**: đường dẫn ảnh (vd `/img/products/leather-1.jpg`).

Khác: `categories[]`, `users[]`, `orders[]`, `reviews[]`, `coupons[]`, `blogPosts[]` (có `coverImg`).

## 6. Tính năng đã có

**Cơ bản:** trang chủ, danh mục + tìm kiếm + lọc giá + sắp xếp, chi tiết sản phẩm + thư viện ảnh,
đánh giá sao, giỏ hàng + mã giảm giá, thanh toán COD/CK, tài khoản + lịch sử đơn, blog,
giới thiệu/liên hệ. Admin: dashboard, CRUD sản phẩm (upload ảnh), đơn hàng, coupon, review.

**Nâng cấp theo chuẩn ngành phụ kiện xe (2026-07-08):**
1. **Chọn đồ theo dòng xe** — bộ chọn hãng ở trang chủ (`.finder`) + lọc `?brand=` & `?instock=1`
   ở cửa hàng (`src/routes/shop.js` → `renderCatalog`).
2. **Dải cam kết** `views/partials/trust-strip.ejs` (giao/lắp, bảo hành, đổi trả, freeship).
3. **Card sản phẩm** hiển thị sao + số đánh giá, badge tồn kho, hover đổi ảnh 2.
4. **Cross-sell** "mua kèm" + thông số "Tương thích" trên trang sản phẩm.
5. **Đăng ký nhận ưu đãi** (POST `/dang-ky-nhan-tin` → mã WELCOME10) + link mạng xã hội ở footer.
6. **JSON-LD SEO** (Product/AggregateRating/Review ở product.ejs; Store ở layout; FAQPage ở faq).
7. **Thanh mua dính đáy** trên mobile (`.buybar` + IntersectionObserver).
8. **Ảnh thật** — 32 ảnh stock trong `public/img/products/` (map `realImages` trong `seed.js`).
9. **Trang chính sách & FAQ** — data-driven từ `src/content/policies.js`:
   - 6 chính sách: `/chinh-sach/{giao-hang-lap-dat|bao-hanh|doi-tra|huong-dan-mua-hang|bao-mat|dieu-khoan}`
     (1 template `views/pages/policy.ejs`, có mục lục sticky).
   - FAQ: `/cau-hoi-thuong-gap` (accordion `<details>`, `views/pages/faq.ejs`).
10. **Blog 15 bài** gắn sản phẩm — `blogPosts` trong `seed.js`. Body chứa **link nội bộ HTML**
    (render bằng `<%- %>` trong `blog-post.ejs`) + trường `related` (slug sản phẩm) → khối
    "Sản phẩm liên quan"; helper link `L` khai báo đầu mảng `blogPosts`.
    - **Chuyên mục blog** = `BLOG_CATEGORIES` (util.js), ánh xạ 1-1 sang danh mục sản phẩm
      (`productCat`): noi-that, tham-lot, den-cong-nghe, cham-soc. Mỗi bài có field `category`
      (gán qua `blogCatMap` cuối mảng blogPosts). Trang `/blog` chia mục con; `/blog/chuyen-muc/:slug`
      là trang chuyên mục (route đặt TRƯỚC `/:slug`). Partial dùng chung: `blog-nav`, `blog-card`.
      Liên kết 2 chiều: catalog danh mục → chuyên mục blog, và ngược lại.
11. **SEO 2026:** `sitemap.xml` + `robots.txt` (route động trong `server.js`), **canonical +
    meta description + Open Graph/Twitter** động (locals ở `server.js`, dùng ở `layout.ejs`;
    route product/category/blog/policy truyền `metaDescription`/`ogImage`). BreadcrumbList JSON-LD
    ở product. `SITE_URL` trong `.env` để canonical/sitemap đúng khi deploy. Admin đã `noindex`.

## 7. Bản đồ file hay sửa

| Cần làm gì | Sửa ở đâu |
|---|---|
| Thêm/đổi sản phẩm, ảnh, hãng tương thích | `src/db/seed.js` (map `realImages`, `fitBySlug`) → `npm run seed` |
| Danh sách hãng xe | `src/util.js` → `CAR_BRANDS` |
| Nội dung chính sách / FAQ | `src/content/policies.js` |
| Route cửa hàng, lọc, chính sách | `src/routes/shop.js` |
| Giao diện / màu / layout | `public/css/styles.css` |
| Header / footer / card | `views/partials/` |
| Deploy | `README.md`, `ecosystem.config.js`, `deploy/nginx.conf.example` |

## 8. GOTCHAS — đọc kỹ để khỏi mất dữ liệu / bối rối

- ⚠️ **`src/db/data.json` bị `.gitignore`** → sau khi clone hoặc deploy **PHẢI chạy `npm run seed`**,
  nếu không sẽ không có sản phẩm. `npm run seed` **GHI ĐÈ** toàn bộ (mất orders/users tạo lúc chạy thật).
- ⚠️ **Ảnh site thật ở `public/img/products/`** (được commit). Còn **`public/uploads/` bị gitignore**
  (dành cho ảnh admin upload lúc chạy) — đừng để ảnh cần commit vào đó.
- ⚠️ **Server cache `data.json` trong RAM** khi khởi động → sửa `data.json`/seed xong phải **khởi động lại**
  server mới thấy thay đổi (`npm run dev` tự reload code nhưng vẫn cần reseed cho dữ liệu).
- Windows: cảnh báo `LF will be replaced by CRLF` khi commit là **vô hại**.
- Cổng thanh toán VNPay/Momo mới có **điểm móc sẵn** trong `src/routes/checkout.js`, chưa tích hợp thật.

## 9. Việc tiếp theo gợi ý (theo ưu tiên user)

1. **Deploy Hostinger VPS** (PM2 + Nginx + SSL) — quy trình đầy đủ trong `README.md`.
   Nhớ: đổi `SESSION_SECRET`, `ADMIN_PASSWORD`, đặt `NODE_ENV=production`, `TRUST_PROXY=1`, rồi `npm run seed`.
2. **Tích hợp VNPay/Momo thật** (móc ở `src/routes/checkout.js`).
3. **Thay ảnh & thông tin thật** của cửa hàng (ảnh vào `public/img/products/` hoặc sửa map trong `seed.js`;
   thông tin vào `.env`).
4. Ý tưởng khác: review kèm ảnh, tích điểm/loyalty, đa ngôn ngữ, sitemap.xml.

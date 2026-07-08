# DECOR CAR — Website thương mại điện tử

Website bán hàng cho cửa hàng **DECOR CAR** — chuyên **nội thất và phụ kiện trang trí xe ô tô** cao cấp (bọc ghế da, ốp nội thất, thảm lót sàn, đèn ambient, phụ kiện điện tử & chăm sóc xe).

Xây dựng bằng **Node.js + Express + EJS** (server-side rendering, tốt cho SEO), phong cách thiết kế **sang trọng tối giản** (gỗ óc chó · da · đồng thau).

![DECOR CAR](public/favicon.svg)

---

## ✨ Tính năng

**Cửa hàng (khách hàng)**
- Trang chủ với hero, danh mục, sản phẩm nổi bật & mới nhất
- **Tìm đồ theo dòng xe** (chọn hãng) + tìm kiếm + lọc giá / còn hàng + sắp xếp
- Card sản phẩm: sao đánh giá, tình trạng tồn kho, hover đổi ảnh
- Trang chi tiết: thư viện ảnh, thông số tương thích xe, **gợi ý mua kèm**, sản phẩm liên quan
- **Đánh giá sản phẩm**: chấm sao + viết nhận xét, hiển thị điểm trung bình
- Giỏ hàng (cập nhật số lượng, xoá) + **áp mã giảm giá**, lưu theo phiên
- Thanh toán: **COD** + **chuyển khoản**, có sẵn điểm tích hợp **VNPay/Momo**
- Tài khoản: đăng ký / đăng nhập, xem lịch sử đơn hàng
- **Blog** + **trang chính sách** (giao hàng, bảo hành, đổi trả, bảo mật, điều khoản) + **FAQ**
- Đăng ký nhận ưu đãi, link mạng xã hội, **SEO JSON-LD** (Product/Review/FAQ)
- Trang giới thiệu, liên hệ; thanh mua nhanh dính đáy trên mobile

**Quản trị (admin)**
- Bảng tổng quan: doanh thu, số đơn, sản phẩm
- Quản lý sản phẩm: thêm / sửa / xoá, **upload nhiều ảnh**
- Quản lý đơn hàng: xem chi tiết, cập nhật trạng thái
- **Quản lý mã giảm giá**: thêm / xoá (theo % hoặc số tiền, đơn tối thiểu)
- **Xem đánh giá** khách hàng theo sản phẩm

---

## 🚀 Chạy trên máy của bạn (local)

> Yêu cầu: **Node.js ≥ 18**

```bash
# 1. Cài thư viện
npm install

# 2. Tạo file cấu hình từ mẫu rồi chỉnh sửa
cp .env.example .env

# 3. Tạo dữ liệu mẫu (18 sản phẩm + tài khoản admin)  — BẮT BUỘC, vì data.json bị gitignore
npm run seed

# 4. Chạy
npm start          # hoặc: npm run dev  (tự reload khi sửa code)
```

Mở http://localhost:3000

**Tài khoản admin mặc định** (đổi trong `.env` trước khi seed):
- Email: `admin@decorcar.vn`
- Mật khẩu: `DecorCar@2026`
- Trang quản trị: http://localhost:3000/quan-tri

---

## ⚙️ Cấu hình (`.env`)

| Biến | Ý nghĩa |
|------|---------|
| `PORT` | Cổng chạy server (mặc định 3000) |
| `SESSION_SECRET` | Chuỗi bí mật ký cookie — **đổi khi deploy** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Tài khoản admin khởi tạo khi seed |
| `STORE_*` | Thông tin cửa hàng (SĐT, Zalo, email, địa chỉ) |
| `BANK_*` | Thông tin chuyển khoản hiển thị ở bước thanh toán |

> Dữ liệu lưu ở `src/db/data.json` (JSON store, không cần cài database). Ảnh upload lưu ở `public/uploads/`. Cả hai được `.gitignore` bỏ qua.

---

## 📦 Đẩy code lên GitHub

```bash
cd decor-car
git init
git add .
git commit -m "Khởi tạo website DECOR CAR"
git branch -M main

# Tạo repo trống trên GitHub trước, rồi:
git remote add origin https://github.com/<tên-bạn>/decor-car.git
git push -u origin main
```

> File `.env`, `node_modules/`, `data.json` và ảnh upload **không** được đẩy lên (đã cấu hình trong `.gitignore`).

---

## 🌐 Deploy lên Hostinger VPS

> Áp dụng cho gói **VPS / Cloud Hosting** (có toàn quyền chạy Node.js). Đăng nhập VPS qua SSH.

### 1. Cài môi trường trên VPS

```bash
# Cài Node.js 20 (qua NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Cài PM2 để giữ app chạy nền
sudo npm install -g pm2
```

### 2. Lấy code & cài đặt

```bash
cd /var/www
git clone https://github.com/<tên-bạn>/decor-car.git
cd decor-car
npm install --omit=dev
cp .env.example .env
nano .env          # đổi SESSION_SECRET, ADMIN_PASSWORD, thông tin cửa hàng
npm run seed       # tạo dữ liệu lần đầu (chỉ chạy 1 lần)
```

### 3. Khởi động bằng PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # chạy dòng lệnh PM2 in ra để tự khởi động khi reboot
```

App giờ chạy ở `http://127.0.0.1:3000` trong VPS.

### 4. Cấu hình Nginx (reverse proxy + domain)

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/decorcar
sudo nano /etc/nginx/sites-available/decorcar     # đổi decorcar.vn -> domain của bạn
sudo ln -s /etc/nginx/sites-available/decorcar /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Trỏ tên miền (bản ghi A) về **IP của VPS** trong phần quản lý DNS của Hostinger.

### 5. Cài SSL miễn phí (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d decorcar.vn -d www.decorcar.vn
```

Sau đó mở `.env` đặt `NODE_ENV=production`, rồi `pm2 restart decor-car`.

### Cập nhật code về sau

```bash
cd /var/www/decor-car
git pull
npm install --omit=dev
pm2 restart decor-car
```

---

## 🔌 Tích hợp cổng thanh toán (khi cần)

Điểm tích hợp đã đặt sẵn trong `src/routes/checkout.js` (đoạn `ĐIỂM TÍCH HỢP CỔNG THANH TOÁN`).
Khi đăng ký được VNPay/Momo, thêm một lựa chọn `payment = 'online'`, tạo URL thanh toán
và `res.redirect(paymentUrl)`; xử lý callback để cập nhật `order.status`.

## 🗄️ Nâng cấp lên cơ sở dữ liệu thật (tuỳ chọn)

Toàn bộ truy cập dữ liệu đi qua `src/db/database.js`. Khi lượng đơn lớn, có thể thay
lớp này bằng MySQL (Hostinger có sẵn) mà không phải sửa route hay view.

---

## 📁 Cấu trúc thư mục

```
decor-car/
├── server.js              # Khởi tạo Express, middleware, mount routes
├── ecosystem.config.js    # Cấu hình PM2
├── deploy/nginx.conf.example
├── src/
│   ├── util.js            # slugify, định dạng tiền, CAR_BRANDS (hãng xe)
│   ├── placeholder.js     # Sinh ảnh SVG khi sản phẩm chưa có ảnh
│   ├── content/           # policies.js — nội dung trang chính sách & FAQ
│   ├── db/                # database.js (JSON store) + seed.js
│   ├── middleware/        # cart.js, auth.js
│   └── routes/            # shop, blog, cart, checkout, account, admin
├── views/                 # EJS: layout, partials, pages, admin
└── public/                # css, js, favicon
    ├── img/products/      # Ảnh sản phẩm thật (được commit)
    └── uploads/           # Ảnh admin upload lúc chạy (gitignore)
```

> 📄 Xem **`CLAUDE.md`** ở thư mục gốc để nắm nhanh ngữ cảnh, quy ước và các lưu ý quan trọng
> khi tiếp tục phát triển (đặc biệt: `data.json` bị gitignore nên phải `npm run seed`).

---

© 2026 DECOR CAR.

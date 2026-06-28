'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { requireLogin } = require('../middleware/auth');

// ----- Đăng ký -----
router.get('/dang-ky', (req, res) => {
  if (res.locals.user) return res.redirect('/tai-khoan');
  res.render('pages/register', { title: 'Đăng ký — DECOR CAR', errors: {}, form: {} });
});

router.post('/dang-ky', async (req, res) => {
  const form = {
    name: (req.body.name || '').trim(),
    email: (req.body.email || '').trim().toLowerCase(),
    password: req.body.password || '',
  };
  const errors = {};
  if (!form.name) errors.name = 'Vui lòng nhập họ tên.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errors.email = 'Email chưa hợp lệ.';
  if (form.password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự.';
  if (!errors.email && db.userByEmail(form.email)) errors.email = 'Email này đã được đăng ký.';

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('pages/register', {
      title: 'Đăng ký — DECOR CAR',
      errors,
      form,
    });
  }

  const passwordHash = await bcrypt.hash(form.password, 10);
  const user = db.addUser({
    name: form.name,
    email: form.email,
    passwordHash,
    role: 'customer',
    createdAt: new Date().toISOString(),
  });
  req.session.userId = user.id;
  req.session.flash = { type: 'success', message: 'Tạo tài khoản thành công. Chào mừng bạn!' };
  res.redirect('/tai-khoan');
});

// ----- Đăng nhập -----
router.get('/dang-nhap', (req, res) => {
  if (res.locals.user) return res.redirect('/tai-khoan');
  res.render('pages/login', { title: 'Đăng nhập — DECOR CAR', error: null, form: {} });
});

router.post('/dang-nhap', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const user = db.userByEmail(email);
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return res.status(401).render('pages/login', {
      title: 'Đăng nhập — DECOR CAR',
      error: 'Email hoặc mật khẩu không đúng.',
      form: { email },
    });
  }
  req.session.userId = user.id;
  const returnTo = req.session.returnTo;
  delete req.session.returnTo;
  req.session.flash = { type: 'success', message: 'Đăng nhập thành công.' };
  res.redirect(returnTo || (user.role === 'admin' ? '/quan-tri' : '/tai-khoan'));
});

// ----- Đăng xuất -----
router.post('/dang-xuat', (req, res) => {
  req.session.userId = null;
  req.session.flash = { type: 'success', message: 'Bạn đã đăng xuất.' };
  res.redirect('/');
});

// ----- Trang tài khoản + lịch sử đơn -----
router.get('/', requireLogin, (req, res) => {
  const orders = db
    .ordersByUser(res.locals.user.id)
    .sort((a, b) => b.id - a.id);
  res.render('pages/account', { title: 'Tài khoản của tôi — DECOR CAR', orders });
});

module.exports = router;

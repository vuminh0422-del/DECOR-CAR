'use strict';

const db = require('../db/database');

// Gắn thông tin người dùng hiện tại (nếu đã đăng nhập) vào res.locals.
function currentUser(req, res, next) {
  res.locals.user = null;
  if (req.session.userId) {
    const u = db.userById(req.session.userId);
    if (u) {
      res.locals.user = { id: u.id, name: u.name, email: u.email, role: u.role };
    } else {
      req.session.userId = null;
    }
  }
  next();
}

// Yêu cầu đã đăng nhập (khách hàng).
function requireLogin(req, res, next) {
  if (!res.locals.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/tai-khoan/dang-nhap');
  }
  next();
}

// Yêu cầu quyền quản trị.
function requireAdmin(req, res, next) {
  if (!res.locals.user || res.locals.user.role !== 'admin') {
    return res.status(403).render('pages/error', {
      title: 'Không có quyền truy cập',
      message: 'Bạn cần đăng nhập bằng tài khoản quản trị để vào khu vực này.',
    });
  }
  next();
}

module.exports = { currentUser, requireLogin, requireAdmin };

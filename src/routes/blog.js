'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Danh sách bài viết
router.get('/', (req, res) => {
  res.render('pages/blog', {
    title: 'Blog — Kinh nghiệm độ & chăm sóc nội thất xe | DECOR CAR',
    posts: db.blogPosts(),
  });
});

// Chi tiết bài viết
router.get('/:slug', (req, res) => {
  const post = db.blogPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).render('pages/error', {
      title: 'Không tìm thấy bài viết',
      message: 'Bài viết bạn tìm không tồn tại hoặc đã được gỡ.',
    });
  }
  const related = db.blogPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  // Sản phẩm được nhắc trong bài (internal link blog -> product)
  const mentioned = (post.related || [])
    .map((slug) => db.productBySlug(slug))
    .filter(Boolean);
  res.render('pages/blog-post', {
    title: post.title + ' — DECOR CAR',
    metaDescription: post.excerpt,
    ogImage: post.coverImg,
    post,
    related,
    mentioned,
  });
});

module.exports = router;

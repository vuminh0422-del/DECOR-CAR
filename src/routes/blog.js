'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { BLOG_CATEGORIES, blogCategoryBySlug } = require('../util');

// Trang blog: chia thành các chuyên mục con theo nhóm sản phẩm
router.get('/', (req, res) => {
  const posts = db.blogPosts();
  const groups = BLOG_CATEGORIES.map((cat) => ({
    cat,
    posts: posts.filter((p) => p.category === cat.slug),
  })).filter((g) => g.posts.length > 0);

  res.render('pages/blog', {
    title: 'Blog — Kinh nghiệm độ & chăm sóc nội thất xe | DECOR CAR',
    metaDescription:
      'Blog DECOR CAR: mẹo chọn nội thất, thảm lót, đèn & công nghệ, chăm sóc và trang trí xe hơi — phân theo từng nhóm sản phẩm.',
    blogCategories: BLOG_CATEGORIES,
    groups,
    activeCat: null,
  });
});

// Trang chuyên mục blog (đặt TRƯỚC route /:slug để không bị nuốt)
router.get('/chuyen-muc/:slug', (req, res) => {
  const cat = blogCategoryBySlug(req.params.slug);
  if (!cat) {
    return res.status(404).render('pages/error', {
      title: 'Không tìm thấy chuyên mục',
      message: 'Chuyên mục blog bạn tìm không tồn tại.',
    });
  }
  const posts = db.blogPosts().filter((p) => p.category === cat.slug);
  const productCat = db.categoryBySlug(cat.productCat);

  res.render('pages/blog-category', {
    title: 'Blog · ' + cat.name + ' — DECOR CAR',
    metaDescription: cat.desc,
    blogCategories: BLOG_CATEGORIES,
    cat,
    productCat,
    posts,
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
  const cat = blogCategoryBySlug(post.category);
  // Bài cùng chuyên mục trước, thiếu thì bù bằng bài mới khác
  const sameCat = db.blogPosts().filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = db.blogPosts().filter((p) => p.slug !== post.slug && p.category !== post.category);
  const related = sameCat.concat(others).slice(0, 3);
  // Sản phẩm được nhắc trong bài (internal link blog -> product)
  const mentioned = (post.related || [])
    .map((slug) => db.productBySlug(slug))
    .filter(Boolean);

  res.render('pages/blog-post', {
    title: post.title + ' — DECOR CAR',
    metaDescription: post.excerpt,
    ogImage: post.coverImg,
    post,
    cat,
    related,
    mentioned,
  });
});

module.exports = router;

'use strict';

// Tương tác phía client cho DECOR CAR — nhẹ, không phụ thuộc thư viện.
(function () {
  // ----- Menu di động -----
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Đóng menu khi bấm ra ngoài
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- Bộ tăng/giảm số lượng -----
  document.querySelectorAll('[data-qty]').forEach(function (box) {
    const input = box.querySelector('input[type="number"]');
    if (!input) return;
    box.querySelectorAll('[data-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const step = Number(btn.dataset.step);
        const min = input.min !== '' ? Number(input.min) : 0;
        const next = Math.max(min, (Number(input.value) || 0) + step);
        input.value = next;
        // Tự gửi form khi ở trong giỏ hàng
        if (box.hasAttribute('data-autosubmit') && box.tagName === 'FORM') {
          box.submit();
        }
      });
    });
  });

  // ----- Thư viện ảnh sản phẩm -----
  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    const main = gallery.querySelector('#galleryMain');
    gallery.querySelectorAll('.gallery__thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        if (!main) return;
        main.src = thumb.dataset.src;
        gallery.querySelectorAll('.gallery__thumb').forEach(function (t) {
          t.classList.remove('is-active');
        });
        thumb.classList.add('is-active');
      });
    });
  }

  // ----- Hiện/ẩn mật khẩu -----
  document.querySelectorAll('[data-pw]').forEach(function (wrap) {
    const input = wrap.querySelector('input');
    const btn = wrap.querySelector('.pw__toggle');
    if (!input || !btn) return;
    btn.addEventListener('click', function () {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Ẩn' : 'Hiện';
      btn.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    });
  });

  // ----- Ảnh hover của card: chỉ tải khi trỏ vào (không tốn dung lượng trên mobile) -----
  function initHoverSwap(root) {
    (root || document).querySelectorAll('.card').forEach(function (card) {
      const back = card.querySelector('.card__img--back[data-src]');
      if (!back || card._hoverBound) return;
      card._hoverBound = true;
      const load = function () {
        back.src = back.dataset.src;
        back.removeAttribute('data-src');
        card.removeEventListener('mouseenter', load);
      };
      card.addEventListener('mouseenter', load);
    });
  }
  initHoverSwap(document);

  // ===== Yêu thích (wishlist) & Sản phẩm đã xem — lưu ở localStorage =====
  function getList(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; }
  }
  function setList(key, arr) {
    try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {}
  }
  function wishIds() { return getList('dc_wish'); }

  function syncWishUI() {
    const ids = wishIds();
    document.querySelectorAll('[data-wish]').forEach(function (btn) {
      const on = ids.indexOf(Number(btn.dataset.wish)) !== -1;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const lbl = btn.querySelector('.wish-btn__label');
      if (lbl) lbl.textContent = on ? 'Đã lưu yêu thích' : 'Lưu vào yêu thích';
    });
    const badge = document.querySelector('[data-wish-count]');
    if (badge) {
      const n = ids.length;
      badge.textContent = n;
      if (n > 0) badge.removeAttribute('hidden'); else badge.setAttribute('hidden', '');
    }
  }
  function toggleWish(id) {
    const arr = wishIds();
    const i = arr.indexOf(id);
    if (i === -1) arr.push(id); else arr.splice(i, 1);
    setList('dc_wish', arr);
    syncWishUI();
    if (document.querySelector('[data-wishlist-root]')) renderWishlist();
  }
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-wish]');
    if (!btn) return;
    e.preventDefault();
    toggleWish(Number(btn.dataset.wish));
  });

  function fetchCards(ids, cb) {
    if (!ids.length) { cb(''); return; }
    fetch('/api/the-san-pham?ids=' + ids.join(','))
      .then(function (r) { return r.text(); })
      .then(cb)
      .catch(function () { cb(''); });
  }

  function renderWishlist() {
    const root = document.querySelector('[data-wishlist-root]');
    const empty = document.querySelector('[data-wishlist-empty]');
    if (!root) return;
    const ids = wishIds();
    if (!ids.length) {
      root.setAttribute('hidden', '');
      if (empty) empty.removeAttribute('hidden');
      return;
    }
    fetchCards(ids, function (html) {
      root.innerHTML = html;
      root.removeAttribute('hidden');
      if (empty) empty.setAttribute('hidden', '');
      initHoverSwap(root);
      syncWishUI();
    });
  }

  // Ghi nhận sản phẩm đang xem
  const viewed = document.querySelector('[data-viewed-product]');
  if (viewed) {
    const vid = Number(viewed.dataset.viewedProduct);
    const recent = getList('dc_recent').filter(function (x) { return x !== vid; });
    recent.unshift(vid);
    setList('dc_recent', recent.slice(0, 12));
  }
  // Render các khu vực "Sản phẩm đã xem"
  document.querySelectorAll('[data-recent-section]').forEach(function (section) {
    const exclude = Number(section.dataset.recentExclude || 0);
    const ids = getList('dc_recent').filter(function (x) { return x !== exclude; }).slice(0, 4);
    if (!ids.length) return;
    const root = section.querySelector('[data-recent-root]');
    fetchCards(ids, function (html) {
      if (!html) return;
      root.innerHTML = html;
      section.removeAttribute('hidden');
      initHoverSwap(root);
      syncWishUI();
    });
  });

  syncWishUI();
  renderWishlist();

  // ----- Sự kiện Meta Pixel: AddToCart khi thêm vào giỏ -----
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (form && form.action && form.action.indexOf('/gio-hang/them') !== -1 && window.fbq) {
      fbq('track', 'AddToCart');
    }
  });

  // ----- Thanh mua dính đáy (mobile): hiện khi nút mua chính cuộn khỏi màn hình -----
  const buybar = document.querySelector('[data-buybar]');
  const buyForm = document.querySelector('.buy');
  if (buybar && buyForm && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          buybar.classList.toggle('is-visible', !e.isIntersecting);
        });
      },
      { rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(buyForm);
  }

  // ----- Ẩn flash sau vài giây -----
  const flash = document.querySelector('.flash');
  if (flash) {
    setTimeout(function () {
      flash.style.transition = 'opacity .4s ease';
      flash.style.opacity = '0';
      setTimeout(function () { flash.remove(); }, 400);
    }, 4000);
  }
})();

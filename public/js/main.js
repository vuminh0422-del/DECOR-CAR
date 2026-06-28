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

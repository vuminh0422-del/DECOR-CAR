'use strict';

/**
 * Sinh ảnh placeholder SVG mang phong cách "sang trọng tối giản" của DECOR CAR.
 * Dùng khi sản phẩm chưa có ảnh thật. Mỗi tông màu cho một bảng màu riêng,
 * cùng motif khung hairline + góc tick đồng thau làm chữ ký thị giác.
 */

const TONES = {
  walnut: { bg: '#EFE7DA', panel: '#E3D5C2', accent: '#5A3E26', ink: '#2A2118' },
  brass: { bg: '#F3ECDD', panel: '#EADFC4', accent: '#BC8A3C', ink: '#3A2E16' },
  ink: { bg: '#E8E6E0', panel: '#D7D4CC', accent: '#15140F', ink: '#15140F' },
};

function escapeXml(str) {
  // Chuẩn hoá về NFC để dấu tiếng Việt không bị tách rời khi render trong SVG.
  return String(str)
    .normalize('NFC')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Tách nhãn dài thành tối đa 2 dòng cho cân đối.
function wrap(label) {
  const words = String(label).trim().split(/\s+/);
  if (words.length <= 3) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function renderPlaceholder(label, tone = 'walnut') {
  const t = TONES[tone] || TONES.walnut;
  const lines = wrap(label);
  const W = 800;
  const H = 1000;

  const textLines = lines
    .map(
      (ln, i) =>
        `<text x="${W / 2}" y="${560 + i * 56}" text-anchor="middle" ` +
        `font-family="Times New Roman, Georgia, serif" font-size="40" fill="${t.ink}">${escapeXml(ln)}</text>`
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.bg}"/>
      <stop offset="1" stop-color="${t.panel}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>

  <!-- Khung hairline + góc tick đồng thau (chữ ký thị giác) -->
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="${t.accent}" stroke-width="1.5" opacity="0.5"/>
  <g stroke="${t.accent}" stroke-width="2.5">
    <path d="M48 96 L48 48 L96 48"/>
    <path d="M${W - 96} 48 L${W - 48} 48 L${W - 48} 96"/>
    <path d="M48 ${H - 96} L48 ${H - 48} L96 ${H - 48}"/>
    <path d="M${W - 96} ${H - 48} L${W - 48} ${H - 48} L${W - 48} ${H - 96}"/>
  </g>

  <!-- Motif hình khối tiết chế -->
  <circle cx="${W / 2}" cy="360" r="120" fill="none" stroke="${t.accent}" stroke-width="2" opacity="0.55"/>
  <line x1="${W / 2}" y1="180" x2="${W / 2}" y2="480" stroke="${t.accent}" stroke-width="2" opacity="0.25"/>
  <rect x="${W / 2 - 70}" y="290" width="140" height="140" fill="${t.accent}" opacity="0.12"/>

  <!-- Eyebrow thương hiệu -->
  <text x="${W / 2}" y="660" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="18" letter-spacing="6" fill="${t.accent}">DECOR CAR</text>

  ${textLines}
</svg>`;
}

module.exports = { renderPlaceholder };

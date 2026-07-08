'use strict';

/**
 * Gửi email xác nhận đơn hàng qua SMTP (nodemailer).
 * - Chỉ hoạt động khi đã cấu hình SMTP trong .env (SMTP_HOST, SMTP_USER, SMTP_PASS...).
 * - Nếu chưa cấu hình: bỏ qua êm (không làm hỏng luồng đặt hàng), chỉ ghi log 1 lần.
 * - Không chặn response: checkout gọi rồi .catch(), gửi ở chế độ "fire and forget".
 */

const nodemailer = require('nodemailer');
const { formatVND, ORDER_STATUS } = require('./util');

let transporter = null;
let warned = false;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    if (!warned) {
      warned = true;
      console.log('[mailer] Chưa cấu hình SMTP -> bỏ qua gửi email. Điền SMTP_* trong .env để bật.');
    }
    return null;
  }
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true cho cổng 465
    auth: { user, pass },
  });
  return transporter;
}

function orderHtml(order, store) {
  const rows = order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee">
          ${it.name}${it.variantLabel ? `<br><span style="color:#8c8472;font-size:13px">${it.variantLabel}</span>` : ''}
          <br><span style="color:#8c8472;font-size:13px">SL: ${it.quantity}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${formatVND(it.lineTotal)}</td>
      </tr>`
    )
    .join('');

  const bankBlock =
    order.payment === 'bank'
      ? `<p style="margin:16px 0 0;padding:12px;background:#faf7f0;border:1px solid #e4ddcd">
           <b>Chuyển khoản:</b><br>
           ${store.bankName} — ${store.bankAccount}<br>
           Chủ TK: ${store.bankHolder}<br>
           Nội dung: <b>${order.code}</b>
         </p>`
      : `<p style="margin:16px 0 0;color:#4d6b3f"><b>Thanh toán khi nhận hàng (COD).</b></p>`;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;color:#15140f">
    <h2 style="font-family:Georgia,serif;color:#92692a">DECOR CAR</h2>
    <p>Cảm ơn bạn đã đặt hàng! Đơn <b>${order.code}</b> đã được ghi nhận với trạng thái
       <b>${ORDER_STATUS[order.status] || order.status}</b>.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px">${rows}</table>
    <table style="width:100%;margin-top:12px">
      <tr><td style="color:#8c8472">Tạm tính</td><td style="text-align:right">${formatVND(order.subtotal)}</td></tr>
      ${order.discount ? `<tr><td style="color:#4d6b3f">Giảm giá</td><td style="text-align:right;color:#4d6b3f">−${formatVND(order.discount)}</td></tr>` : ''}
      <tr><td style="color:#8c8472">Phí vận chuyển</td><td style="text-align:right">${order.shipping ? formatVND(order.shipping) : 'Miễn phí'}</td></tr>
      <tr><td style="font-size:18px;font-weight:bold;padding-top:8px">Tổng cộng</td><td style="font-size:18px;font-weight:bold;text-align:right;padding-top:8px;color:#92692a">${formatVND(order.total)}</td></tr>
    </table>
    ${bankBlock}
    <p style="margin-top:16px;color:#2b2820">
      <b>Người nhận:</b> ${order.customer.name} — ${order.customer.phone}<br>
      <b>Địa chỉ:</b> ${order.customer.address}
    </p>
    <p style="margin-top:16px;color:#8c8472;font-size:13px">
      Mọi thắc mắc vui lòng liên hệ hotline ${store.phone} hoặc email ${store.email}.
    </p>
  </div>`;
}

function sendOrderConfirmation(order, store) {
  const tx = getTransporter();
  if (!tx) return Promise.resolve(false);
  const from = process.env.MAIL_FROM || `DECOR CAR <${process.env.SMTP_USER}>`;
  const to = [];
  if (order.customer && /.+@.+\..+/.test(order.customer.email || '')) to.push(order.customer.email);
  const adminTo = process.env.MAIL_ADMIN;
  const messages = [];
  if (to.length) {
    messages.push(
      tx.sendMail({
        from,
        to,
        subject: `Xác nhận đơn hàng ${order.code} — DECOR CAR`,
        html: orderHtml(order, store),
      })
    );
  }
  if (adminTo) {
    messages.push(
      tx.sendMail({
        from,
        to: adminTo,
        subject: `[Đơn mới] ${order.code} — ${order.total.toLocaleString('vi-VN')}₫`,
        html: orderHtml(order, store),
      })
    );
  }
  return Promise.all(messages).then(() => true);
}

module.exports = { sendOrderConfirmation };

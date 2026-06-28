// Cấu hình PM2 để chạy DECOR CAR trên Hostinger VPS.
// Khởi động:  pm2 start ecosystem.config.js
// Lưu lại:    pm2 save  &&  pm2 startup
module.exports = {
  apps: [
    {
      name: 'decor-car',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        TRUST_PROXY: '1',
      },
    },
  ],
};

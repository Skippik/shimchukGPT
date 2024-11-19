module.exports = {
  apps: [
    {
      name: 'telegram-bot', // Название приложения
      script: 'dist/app.js', // Путь к вашему скомпилированному бот-скрипту
      watch: false, // Следить за изменениями (включить true при разработке)
      instances: 1, // Количество процессов (1 для бота)
      autorestart: true, // Перезапуск при ошибках
      max_memory_restart: '500M', // Перезапуск при превышении памяти
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

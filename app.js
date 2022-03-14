// 1. Подключаем модуль экспресс
const express = require("express");
// 7. Подключаем роуты
const routerAuth = require("./routes/auth.routes");
const routerLink = require("./routes/link.routes");
const path = require('path')
// 2. Подключаем модуль для чтения "./config/default.json"
const config = require("config");
// 3. МОНГА
const mongoose = require("mongoose");

// 4. Все для коннекта к МОНГЕ
const MONGO_URI = config.get("mongoUri");

async function start_db() {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

start_db();

// 5. Заводим приложение экспресса
const app = express();

// 8. Цепляем роуты к экспрессу
app.use("/api/auth", routerAuth);
// Для чтения request.body
app.use("/api/link", express.json({ extended: true }), routerLink);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')])
  })
}

// 6. Запускаем сервер express
const PORT = config.get("port") || 5001;

app.listen(PORT, () => console.log(`App has been started on ${PORT}`));

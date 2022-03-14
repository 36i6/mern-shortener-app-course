// Схема данных, прототип модель, типы данных из монги
const { Schema, model, Types } = require("mongoose");

// Создаем новую схему данных для User
const schema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  // Линкуем запись по айдишнику с моделью User с пользователем с тем же айди
  owner: { type: Types.ObjectId, ref: "User" },
});

// Экспортируем модель данных Link с обозначенной схемой
// Данный прототип модели сам умеет работать с монгой под капотом
module.exports = model("Link", schema);

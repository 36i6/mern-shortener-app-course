// Схема данных, прототип модель, типы данных из монги
const { Schema, model, Types } = require("mongoose");

// Создаем новую схему данных для User
const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Линкуем ссылку из списка с айдишником ссылки из модели Link
  links: [{ type: Types.ObjectId, ref: "Link" }],
});

// Экспортируем модель данных User с обозначенной схемой
// Данный прототип модели сам умеет работать с монгой под капотом
module.exports = model("User", schema);

const jwt = require("jsonwebtoken");
const config = require("config");

// Миддлварь auth является самостоятельной функцией
// TODO: Разобраться каким образом в роуте в миддлварь передаются параметры и функция next
module.exports = (req, res, next) => {
  // TODO: разобраться что это за метод такой
  if (req.method === "OPTIONS") {
    return next();
  }

  // Пытаемся понять авторизован ли наш пользователь
  try {
    // Передаем из заголовков токен
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: "Нет авторизации" });
    }

    // Если токен верифицирован секретным ключом, возвращаем токен в тело запроса
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Нет авторизации" });
  }
};

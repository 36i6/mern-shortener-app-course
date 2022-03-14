// Подключаем класс Роутер из экспресса
const { Router } = require("express");
// Подключаем модуль для хеширования паролей
const bcrypt = require("bcryptjs");
// Подключаем модуль для парсинга req.body
const bodyParser = require("body-parser");
// Подключаем json-переводчик
const jsonParser = bodyParser.json();
// Подключаем модуль чтения "/config/default.json"
const config = require("config");
// Подключаем валидаторы присылаемых в req данных
const { check, validationResult } = require("express-validator");
// Подключаем jsonwebtoken для создания токена юзера
const jwt = require("jsonwebtoken");
// Подключаем модель данных User
const User = require("../models/User");
// Запускаем роутер
const router = Router();

// Обрабатываем POST-запрос к роуту "url:port/api/auth/register", читаем req.body, валидируем поля на соответствие требованиям, исполняем необходимую функцию
router.post(
  "/register",
  jsonParser,
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      // Если валидатор вернул ошибки, возвращаем ответ роутеру
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации",
        });
      }

      //Если ошибок нет - идем дальше
      // Передаем параметры из объекта req.body в соответствующие константы
      const { email, password } = req.body;

      // Обращаемся к модели данных User, делаем через нее запрос в монгу на наличие записей с полем email и значением константы email
      const candidate = await User.findOne({ email });

      // если кандидат существует - возвращаем ошибку роутеру
      if (candidate) {
        return res.status(400).json({ message: "User already exists" });
      }

      // хешируем и подсаливаем пароль
      const hashedPassword = await bcrypt.hash(password, 12);
      // создаем нового пользователя по модели User, используем хеш пароля для поля password
      const user = new User({ email, password: hashedPassword });
      // обращаемся к инстансу модели User чтобы она отправила его в базу Монги.
      await user.save();
      res.status(201).json({ message: `User ${email} has been created.` });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
);

// Обрабатываем POST-запрос к роуту "url:port/api/auth/login", читаем req.body, валидируем поля на соответствие требованиям, исполняем необходимую функцию
router.post(
  "/login",
  jsonParser,
  [
    check("email", "Некорректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      // Если валидатор вернул ошибки, возвращаем ответ роутеру
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Введите корректные данные",
        });
      }

      //Если ошибок нет - идем дальше
      // Передаем параметры из объекта req.body в соответствующие константы
      const { email, password } = req.body;

      // Обращаемся к модели данных User, делаем через нее запрос в монгу на наличие записей с полем email и значением константы email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: `Пользователь не найден` });
      }

      // Сравниваем пароль введеный пользователем из req.body с паролем из возвращенного инстанса user которую модель User нашла в монге (и видимо расхеширование происходит автоматически в методе compare())
      const passwdMatch = await bcrypt.compare(password, user.password);
      if (!passwdMatch) {
        return res.status(400).json({ message: `Не верный пароль` });
      }

      // Если пароли совпадают - создаем токен от JWT на один час и присваиваем ему id пользователя из модели User (там id прилинкован к стандартному полю _id в монге которая является типом ObjectId)
      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      // Возвращаем токен респонсом
      res.json({ token, userId: user.id });
    } catch (e) {
      // Если что то изначально пошло не так трубим ошибкой
      console.log(e);
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
);

// Экспортируем роутер для приложения
module.exports = router;

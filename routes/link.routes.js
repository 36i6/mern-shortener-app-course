const Router = require("express");
const config = require("config");
// Подключаем модуль шортенера
const shortid = require("shortid");
// Подключаем модель Link монги
const Link = require("../models/Link");
// Подключаем миддлварь проверки авторизации
const auth = require("../middlewares/auth.middleware");
const router = Router();

// При запросе POST на /api/link/generate в миддлварь передаются данные req, res, next?, далее миддлварь передает req.user (decoded by jwt from middleware) далее в функцию
router.post("/generate", auth, async (req, res) => {
  try {
    // ссылка-префикс, куда добавится шортен код
    const baseUrl = config.get("baseUrl");
    // Вытаскиваем из req.body поле from (сокращаемая ссылка)
    const { from } = req.body;
    // Генерируем шортен код
    const code = shortid.generate();
    // Проверяем через модель Link, существует ли ссылка от сокращаемой ссылки
    const existing = await Link.findOne({ from });
    // Если такая есть, возвращаем хранящую ее запись из монги в поле link
    if (existing) {
      return res.json({ link: existing });
    }
    // Приводим сокращенную ссылку к нужному нам для обработки виду
    const to = baseUrl + "/t/" + code;
    // Создаем новую ссылку по модели Link, в поле owner отдаем req.user.Id из модели User (он прилинкован в самой модели)
    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    // Сохраняем созданную ссылку в монгу
    await link.save();
    //  Возвращаем ссылку в ответе на запрос
    res.status(201).json({ link });
  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});

// Аналогично тому что выше, если метод не options смотрим, авторизован ли пользователь, далее либо выдаем ошибку либо выполняем функцию next() (описано в auth.middleware)
router.get("/", auth, async (req, res) => {
  try {
    // Ищем все ссылки пользователя, выполнившего запрос
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});

// Аналогично тому что выше, если метод не options смотрим, авторизован ли пользователь, далее либо выдаем ошибку либо выполняем функцию next() (описано в auth.middleware)
router.get("/:id", auth, async (req, res) => {
  try {
    // Ищем ссылку по конкретному id, в параметры передаем почему то req.params.id
    // TODO:  (почему не req.params._id?)
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" });
  }
});

module.exports = router;

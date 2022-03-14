import React, { useState, useEffect, useContext } from "react";
// Для перенаправления, он же бывший useHistory, может возвращать на предыдущую страницу через navigate(-1)
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";

export const CreatePage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  // Объявляем переменную link и функцию, ее изменяющую
  const [link, setLink] = useState("");
  // Из хука useHttp достаем функцию request, организующую отправку на сервер нужного нам запроса через fetch()
  const { request } = useHttp();
  // Обработчик нажатия клавиши Enter при вводе ссылки
  const pressHandler = async (event) => {
    if (event.key === "Enter") {
      try {
        // Отправляем запрос, подключаем токен из контекста auth
        // Запрос проксируется из браузера в 5000 порт express, а потому запрос обрабатывается корректно именно экспрессом, а не реактом.
        const data = await request(
          "/api/link/generate",
          "POST",
          {
            from: link,
          },
          { Authorization: `Bearer ${auth.token}` }
        );
        console.log(data);
        // Если все гуд и нам вернулась дата, делаем редирект на страницу DetailPage, запрос обрабатывает routes.js реакта и возвращает нужный блок страницы
        navigate(`/detail/${data.link._id}`);
      } catch (e) {}
    }
  };

  // Делается для того чтобы при запуске страницы сделать фокус-расфокус всех текстовых полей
  // TODO: Разобраться, как работает
  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  return (
    <div className="row">
      <div className="col s8 offset-s2">
        <div className="input-field">
          <input
            placeholder="Вставьте ссылку"
            id="link"
            type="text"
            // TODO: У нас и без value все работало изначально, так зачем он тут?
            value={link}
            // Мы и так можем отдавать в функцию setLink текущее значение
            onChange={(event) => setLink(event.target.value)}
            onKeyPress={pressHandler}
          />
          {/* TODO: разобраться как работает этот лейбл, как он появляется на месте плейсхолдера инпута и как отлетает вверх */}
          <label htmlFor="link">Ссылка</label>
        </div>
      </div>
    </div>
  );
};

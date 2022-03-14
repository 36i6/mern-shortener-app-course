// useState - Хук, который возвращает текущее значение и функцию, меняющую эти значения
import React, { useContext, useEffect, useState } from "react";
// Используем легитимный контекст аутентификации
import { AuthContext } from "../context/AuthContext";
// Подключаем самописный хук, возвращающий данные после отправки на сервер с формы
import { useHttp } from "../hooks/http.hook";
// Подключаем самописный хук, создающий тост
import { useMessage } from "../hooks/message.hook";

// Экспортируем страницу авторизации целиком с функционалом.
export const AuthPage = () => {
  // Теперь мы можем из контекста доставать данные и функции по аутентификации пользователя
  const auth = useContext(AuthContext);
  // Инициатор тоста
  const message = useMessage();
  // Получаем начальные данные с хука useHttp
  const { loading, error, success, request, clearError, clearSuccess } =
    useHttp();

  // Получаем начальные данные с хука useState
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Используем нативный хук useEffect, реагирующий на изменение переменной error из хука useHttp
  useEffect(() => {
    // При изменении значения error, выводим тост error
    message(error);
    // Очищаем ошибки в хуке useHttp
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  // Используем нативный хук useEffect, реагирующий на изменение переменной success из хука useHttp (отсебятина, решается вызыванием тоста после получения данных из request хука useHttp)
  useEffect(() => {
    message(success);
    clearSuccess();
  }, [success, message, clearSuccess]);

  // Объявляем функцию, реагирующую на событие
  const changeHandler = (event) => {
    // В момент события запускаем функцию setForm меняющую значения элемента form хука useState
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Объявляем хендлер, реагирующий на нажатие кнопки "Регистрация"
  const registerHandler = async () => {
    try {
      // Отправляем реакту (через прокси - экспрессу) POST запрос с валидным телом сообщения
      const data = await request("/api/auth/register", "POST", { ...form });
      // Вместо useEffect-success можно вызвать функцию message()
      message(data.message);
    } catch (e) {
      console.log(e);
    }
  };

  // Объявляем хендлер, реагирующий на нажатие кнопки "Войти"
  const loginHandler = async () => {
    try {
      // Отправляем реакту (через прокси - экспрессу) POST запрос с валидным телом сообщения
      const data = await request("/api/auth/login", "POST", { ...form });
      // Отправляем в контекст AuthContext в функцию login данные с ответа сервера
      // TODO: Разобраться, как связаны методы login в хуке useAuth и контексте AuthContext
      auth.login(data.token, data.userId);
    } catch (e) {
      console.log(e);
    }
  };

  // Возвращаем html-объект роутеру
  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Yobanavrot samarik ti zaebal</h1>
        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизация</span>
            <div>
              {/* React не понимает class, только className */}
              <div className="input-field">
                <input
                  id="email"
                  type="email"
                  // [event.target.name] хендлера
                  name="email"
                  className="validate yellow-input"
                  value={form.email}
                  // Вызывает хендлер в момент изменения элемента
                  onChange={changeHandler}
                />
                {/* React не понимает for, только htmlFor */}
                <label htmlFor="email">Введите Email</label>
              </div>
              <div className="input-field">
                <input
                  id="password"
                  type="password"
                  // [event.target.name] хендлера
                  name="password"
                  className="validate yellow-input"
                  value={form.password}
                  // Вызывает хендлер в момент изменения элемента
                  onChange={changeHandler}
                />
                <label htmlFor="password">Введите пароль</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-4"
              // Вызывает хендлер на клике
              onClick={loginHandler}
              // Отключает кнопку в момент когда идет загрузка данных
              disabled={loading}
            >
              Войти
            </button>
            <button
              className="btn grey lighten-1 black-text"
              // Вызывает хендлер на клике
              onClick={registerHandler}
              // Отключает кнопку в момент когда идет загрузка данных
              disabled={loading}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

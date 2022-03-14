// Импортируем нативные хуки
// TODO: Выяснить функционал каждого хука
import { useState, useCallback, useEffect } from "react";

// Заводим название для ключа хранилища
const storageName = "userData";

// Экспортируем хук
export const useAuth = () => {
  // Заводим переменные и функции, их изменяющие
  const [token, setToken] = useState(null);
  // Если ответ готов
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // Создаем колбек функцию логин, записывающую данные в локальное хранилище браузера. Мы могли бы делать это сразу, но завели колбек функцию, чтобы к ней можно было обратиться из хука useEffect
  const login = useCallback((jwtToken, id) => {
    // Передаем в переменные значения из переданных аргументов
    setToken(jwtToken);
    setUserId(id);

    // Меняем (создаем если небыло) в ключе %storageName% строку с данными из переданных аргументов
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
      })
    );
  }, []);

  // Аналогично функции выше, но в данном случае удаляем данные из локального хранилища и обнуляем переменные нашего хука useAuth
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  // Парсим локальное хранилище, и если в нем есть данные, а так же существует токен - отправляем данные в функцию login которая обновит данные в хранилище и в переменных нашего хука
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId);
    }
    setReady(true);
  }, [login]);

  // Хук возвращает эти значения
  // TODO: (можно ли менять местами и нужно ли?)
  return { login, logout, token, userId, ready };
};

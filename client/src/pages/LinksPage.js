import React, { useContext, useState, useCallback, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
// Добавляем иконку прогрузки
import { Loader } from "../components/Loader";
// Добавляем компоненту таблицы со ссылками
import { LinksList } from "../components/LinksList";

// Эта функция есть рендер страницы, отправляемый в роутер
export const LinksPage = () => {
  // Список ссылок изначально будет пустой, чтобы небыло undefined
  const [links, setLinks] = useState([]);
  // Делаем через request запросы на сервер реакта, вытаскиваем флаг загрузки
  const { loading, request } = useHttp();
  // Достаем токен их контекста (чтобы использовать его в депсах)
  const { token } = useContext(AuthContext);

  // Функция запроса на сервер экспресса через прокси реакта
  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request("/api/link", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setLinks(fetched);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  if (loading) {
    return <Loader />;
  }

  // Если уже ничего не грузим то выдаем компоненту LinksList и передаем в нее ответ от сервера со списком полученных ссылок
  return <div>{!loading && <LinksList links={links} />}</div>;
};

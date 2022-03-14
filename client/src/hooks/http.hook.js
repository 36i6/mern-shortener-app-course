// TODO: useCallback how does it works
// useState - параметр начальный и функция, его меняющая
import { useCallback, useState } from "react";

// Экспортируем хук useHttp
export const useHttp = () => {
  // Объявляем флажок загрузки, когда данные отправляются и принимаются для отключения кнопок
  const [loading, setLoading] = useState(false);

  // Объявляем хранилище для ошибок
  const [error, setError] = useState(null);

  // Отсебятина, хранилище с успешным ответом от сервера
  const [success, setSuccess] = useState(null);

  // Запускаем useCallback, в парамерты передаем функцию и зависимости??
  const request = useCallback(
    // асинхронная функция запроса на сервер. В параметрах указаны данные по умолчанию.
    async (url, method = "GET", body = null, headers = {}) => {
      // Переключаем флажок загрузки
      setLoading(true);

      try {
        // Если в теле запроса есть данные - трансформируем их json в строку, ибо хук приводит body к строке и получает object Object.
        if (body) {
          // TODO: Вот тут получше разобраться
          body = JSON.stringify(body);
          // Нужно явно указать что передается по сети json, иначе сервер не воспринимает его и отбрасывает
          headers["Content-Type"] = "application/json";
        }

        // TODO: Как работает fetch
        // Данные из параметров функции request передаем на fetch и получаем ответ
        // fetch видимо отправляет запрос в DOM браузера, в нашем случае запрос в каком то месте проксируется на 5000 порт экспресса
        const response = await fetch(url, { method, body, headers });
        const data = await response.json();

        // Если с ответом есть проблемы
        if (!response.ok) {
          throw new Error(data.message || "Something goes wrong");
        }

        // Переключаем флажок на завершение загрузки
        setLoading(false);

        // Возвращаем ответ
        setSuccess(data.message);
        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );

  // Обязательно обарачивать функции в хук useCallback если нужно их использовать в других хуках
  // TODO: Выяснить, почему
  const clearSuccess = useCallback(() => setSuccess(null), []);
  const clearError = useCallback(() => setError(null), []);

  // Возвращаем результат функции request для изменения живых локальных параметров страницы и флажок окончания загрузки данных
  return { loading, error, success, request, clearError, clearSuccess };
};

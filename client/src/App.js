// 1. Импортируем класс реакт
import React from "react";
// Импортируем для самостоятельного блока Router в SPA
import { BrowserRouter as Router } from "react-router-dom";
// Импортируем роуты
import { useRoutes } from "./routes";
// Импортируем хук, проверяющий состояние аутентификации
import { useAuth } from "./hooks/auth.hook";
// Импортируем контекст, позволяющий обмениваться данными контекста внутри всего приложения
import { AuthContext } from "./context/AuthContext";
// Импортируем навбар
import { Navbar } from "./components/Navbar";
// Импортируем компонент индикатора загрузки
import { Loader } from "./components/Loader";
// Импортируем библиотеку стилей
import "materialize-css";

// Запускаем приложение реакта
function App() {
  // Достаем из хука данные по авторизации пользователя
  // ready = данные готовы и успешно импортированы в приложение
  const { token, login, logout, userId, ready } = useAuth();
  // Приводим к булевому значению наличие токена
  const isAuthenticated = !!token;

  // Подключаем роуты к приложению
  // isAuthenticated - параметр для выбора отображаемых роутов
  const routes = useRoutes(isAuthenticated);

  // Если данные по авторизации еще не пришли, крутим песочные часы, а не возвращаем роут для неавторизованных пользователей
  if (!ready) {
    return <Loader />;
  }
  // Возвращаем SPA, если данные по авторизации готовы
  return (
    // TODO: Разобраться что такое провайдер контекста
    <AuthContext.Provider
      value={{ token, login, logout, userId, isAuthenticated }}
    >
      <Router>
        {/* Если пользователь авторизован добавляем навбар перед дивом */}
        {isAuthenticated && <Navbar />}
        <div className="container">{routes}</div>
      </Router>
    </AuthContext.Provider>
  );
}

// TODO: Export Default App WHO IS?
export default App;

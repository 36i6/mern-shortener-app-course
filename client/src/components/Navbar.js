// Импортируем React для всех компонент
// Хук useContext нужен для подключения контекстов
import React, { useContext } from "react";
// NavLink - аналог <a></a>
// TODO: Разобраться с NavLink, useNavigate
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  // Читаем контекст для вытаскивания функции logout
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Прописываем функцию logoutHandler для обработки нажатия на a href Выйти (событие onClick)
  const logoutHandler = (event) => {
    // Предотвращаем стандартное поведение
    // TODO: Тоже разобраться
    event.preventDefault();
    // Вызываем функцию logout из контекста (хотя прописана она в хуке useAuth)
    auth.logout();
    navigate("/");
  };

  return (
    <nav>
      {/* Нету class, только className */}
      <div className="nav-wrapper">
        <a href="/" className="brand-logo">
          Сокращение ссылок
        </a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <NavLink to="/create">Создать</NavLink>
          </li>
          <li>
            <NavLink to="/links">Ссылки</NavLink>
          </li>
          <li>
            <a href="/" onClick={logoutHandler}>
              Выйти
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

import React from "react";
// Она же a href
import { Link } from "react-router-dom";

// Получаем в компоненту fetched links
export const LinksList = ({ links }) => {
  // Если список пустой
  if (!links.length) {
    return <p className="center">Ссылок пока нет</p>;
  }
  // ыначе
  return (
    <table>
      <thead>
        <tr>
          <th>Номер</th>
          <th>Исходная ссылка</th>
          <th>Сокращенная ссылка</th>
          <th>Открыть</th>
        </tr>
      </thead>

      <tbody>
        {/* Бежим по массиву ссылок */}
        {links.map((link, index) => {
          return (
            //   Обязательно добавляем уникальный ключ ссылки
            <tr key={link.code}>
              <td>{index + 1}</td>
              <td>{link.from}</td>
              <td>{link.to}</td>
              <td>
                <Link to={`/detail/${link._id}`}>Открыть</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

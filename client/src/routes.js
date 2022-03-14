import React from "react";
// Router - Контейнер в котором будут рендериться блоки
// Route - Сами контейнерные блоки
// Navigate - бывший Redirect
import { Routes, Route, Navigate } from "react-router-dom";
// Страницы, передающиеся в Route
import { AuthPage } from "./pages/AuthPage";
import { LinksPage } from "./pages/LinksPage";
import { CreatePage } from "./pages/CreatePage";
import { DetailPage } from "./pages/DetailPage";

// Экспортируем функцию которая рендерит роуты
export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/links" exact element={<LinksPage />} />
        <Route path="/create" exact element={<CreatePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/create" />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

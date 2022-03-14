// Импортируем функцию создания контекста
// TODO: Разобраться что такое контекст и как работает
import { createContext } from "react";

function foo() {}

// Экспортируем контекст со значениями по умолчанию
export const AuthContext = createContext({
  token: null,
  userId: null,
  login: foo,
  logout: foo,
  isAuthenticated: false,
});

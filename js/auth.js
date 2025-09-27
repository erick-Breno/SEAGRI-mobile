import * as api from './api.js';

let currentUser = null;
export const getCurrentUser = () => currentUser;
export const login = (email, password, allUsers) => {
  if (email === "admin@agroconnect.com" && password === "admin123") {
    currentUser = { id: "admin", name: "Administrador", email: email, isAdmin: true };
    return true;
  }

  // Lógica para usuários normais
  const user = allUsers.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return true;
  }

  return false; // Retorna false se o login falhar
};

// Função de Registro
export const register = async (name, email, phone, password) => {
  const newUser = { name, email, phone, password, isAdmin: false };
  try {
    await api.saveNewUser(newUser);
    currentUser = newUser;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return true;
  } catch (error) {
    console.error("Erro no registro:", error);
    return false;
  }
};

export const logout = () => {
  currentUser = null;
  localStorage.removeItem("currentUser");
};

export const updateCurrentUserData = (newData) => {
    if (currentUser) {
        currentUser = { ...currentUser, ...newData };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
}
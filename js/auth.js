// js/auth.js

import * as api from './api.js';

// O estado do usuário atual é privado para este módulo
let currentUser = null;

// Função para carregar o usuário do localStorage ao iniciar o app


// Getter para acessar o usuário atual de forma segura
export const getCurrentUser = () => currentUser;

// Função de Login
export const login = (email, password, allUsers) => {
  // Lógica de Admin (ainda client-side, mas agora isolada)
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
    await api.saveNewUser(newUser); // A API já adiciona o ID
    currentUser = newUser;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return true;
  } catch (error) {
    console.error("Erro no registro:", error);
    return false;
  }
};

// Função de Logout
export const logout = () => {
  currentUser = null;
  localStorage.removeItem("currentUser");
};

// Atualiza os dados do usuário logado na sessão atual
export const updateCurrentUserData = (newData) => {
    if (currentUser) {
        currentUser = { ...currentUser, ...newData };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
}
// js/helpers.js

// Converte o ID da categoria para um nome legível
export const getCategoryName = (categoryId) => {
  const categories = {
    hortalicas: "Hortaliças",
    frutas: "Frutas",
    laticinios: "Laticínios",
    graos: "Grãos",
  };
  return categories[categoryId] || categoryId;
};

// Retorna uma imagem padrão caso o produto não tenha uma URL
export const getDefaultImage = (category) => {
    // Poderíamos ter imagens padrão diferentes por categoria no futuro
    return "https://images.pexels.com/photos/1656579/pexels-photo-1656579.jpeg?auto=compress&cs=tinysrgb&w=600";
};

// Converte string de preço (ex: "R$ 10,50") para um número (10.5)
export const parsePrice = (priceString) => {
  if (!priceString || typeof priceString !== "string") return 0;
  // Remove tudo que não for dígito, vírgula ou ponto. Depois troca vírgula por ponto.
  const cleanedString = priceString.replace(/[^0-9,.]/g, "").replace(",", ".");
  return parseFloat(cleanedString) || 0;
};

// Formata data para o padrão brasileiro
export const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('pt-BR');
};
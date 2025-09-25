import { db } from './firebase.js';

// --- Funções de Leitura (Fetch & Listeners) ---
export const fetchAllData = () => {
  const refs = [db.ref('products'), db.ref('users'), db.ref('suggestions')];
  return Promise.all(refs.map(ref => ref.once('value')));
};
export const onProductsChange = (callback) => db.ref('products').on('value', callback);
export const onUsersChange = (callback) => db.ref('users').on('value', callback);
export const onSuggestionsChange = (callback) => db.ref('suggestions').on('value', callback);

// --- Funções de Escrita (Create, Update, Delete) ---
export const saveNewUser = (userData) => {
  const newUserRef = db.ref('users').push();
  userData.id = newUserRef.key;
  return newUserRef.set(userData);
};

export const saveNewProduct = (productData) => {
  const newProductRef = db.ref('products').push();
  productData.id = newProductRef.key;
  return newProductRef.set(productData);
};

export const updateProduct = (productId, productData) => {
  return db.ref(`products/${productId}`).update(productData);
};

export const deleteProduct = (productId) => {
  return db.ref(`products/${productId}`).remove();
};

export const saveNewSuggestion = (suggestionData) => {
  const newSuggestionRef = db.ref('suggestions').push();
  suggestionData.id = newSuggestionRef.key;
  return newSuggestionRef.set(suggestionData);
};

export const updateUserProfile = (userId, profileData) => {
  return db.ref(`users/${userId}`).update(profileData);
};

export const sendSuggestionReply = (suggestionId, replyText) => {
  return db.ref(`suggestions/${suggestionId}`).update({ reply: replyText, status: 'replied' });
};

export const deleteSuggestion = (suggestionId) => {
  return db.ref(`suggestions/${suggestionId}`).remove();
};
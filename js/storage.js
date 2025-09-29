import { storage } from './firebase.js';

/**
 * Faz o upload de um arquivo para o Firebase Storage.
 * @param {File} file O arquivo a ser enviado.
 * @param {string} path O caminho no Storage onde o arquivo será salvo (ex: 'products/user123/').
 * @returns {Promise<string>} A URL de download do arquivo.
 */
export const uploadFile = async (file, path) => {
  if (!file) throw new Error("Nenhum arquivo fornecido para upload.");

  // Cria um nome de arquivo único para evitar sobreposição
  const uniqueFileName = `${Date.now()}-${file.name}`;
  const fileRef = storage.ref(`${path}/${uniqueFileName}`);

  try {
    // Faz o upload do arquivo
    const snapshot = await fileRef.put(file);
    
    // Obtém a URL de download
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    return downloadURL;
  } catch (error) {
    console.error("Erro durante o upload do arquivo:", error);
    throw error;
  }
};
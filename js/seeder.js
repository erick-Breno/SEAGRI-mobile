// seeder.js
const admin = require('firebase-admin');

// --- CONFIGURAÇÃO ---
// Coloque o caminho para sua chave e a URL do seu banco de dados
const serviceAccount = require('./admin-key.json');
const databaseURL = "https://teste-590e9-default-rtdb.firebaseio.com"; // MUDE PARA A SUA URL

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

const db = admin.database();

const usersData = [
  { name: 'João da Horta', email: 'joao@horta.com', phone: '99988776655', password: '123', profilePictureUrl: 'https://images.pexels.com/photos/5472410/pexels-photo-5472410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', galleryUrls: ['https://images.pexels.com/photos/2255866/pexels-photo-2255866.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/258447/pexels-photo-258447.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Maria das Frutas', email: 'maria@frutas.com', phone: '99887766554', password: '123', profilePictureUrl: 'https://images.pexels.com/photos/5946969/pexels-photo-5946969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', galleryUrls: ['https://images.pexels.com/photos/708529/pexels-photo-708529.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Pedro do Queijo', email: 'pedro@queijo.com', phone: '99776655443', password: '123', profilePictureUrl: 'https://images.pexels.com/photos/5965530/pexels-photo-5965530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', galleryUrls: ['https://images.pexels.com/photos/143582/pexels-photo-143582.jpeg?auto=compress&cs=tinysrgb&w=600'] },
  { name: 'Ana do Milho', email: 'ana@milho.com', phone: '99665544332', password: '123', profilePictureUrl: 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', galleryUrls: [] },
  { name: 'Carlos do Feijão', email: 'carlos@feijao.com', phone: '99554433221', password: '123', profilePictureUrl: 'https://images.pexels.com/photos/5965535/pexels-photo-5965535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', galleryUrls: [] },
];

const productsData = [
  { name: 'Alface Crespa Orgânica', category: 'hortalicas', price: 'R$ 3,50', image: 'https://images.pexels.com/photos/2551790/pexels-photo-2551790.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Tomate Cereja Doce', category: 'hortalicas', price: 'R$ 5,00 / cumbuca', image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Rúcula Fresca', category: 'hortalicas', price: 'R$ 4,00', image: 'https://images.pexels.com/photos/45203/brownie-dessert-cake-sweet-45203.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Cenoura Baby', category: 'hortalicas', price: 'R$ 6,00 / kg', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Pimentão Amarelo', category: 'hortalicas', price: 'R$ 8,00 / kg', image: 'https://images.pexels.com/photos/59573/pexels-photo-59573.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Banana Prata', category: 'frutas', price: 'R$ 5,50 / dúzia', image: 'https://images.pexels.com/photos/2280925/pexels-photo-2280925.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Laranja Pêra', category: 'frutas', price: 'R$ 4,00 / kg', image: 'https://images.pexels.com/photos/2090902/pexels-photo-2090902.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Mamão Formosa', category: 'frutas', price: 'R$ 7,00 / unidade', image: 'https://images.pexels.com/photos/4113936/pexels-photo-4113936.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Abacaxi Pérola', category: 'frutas', price: 'R$ 8,00 / unidade', image: 'https://images.pexels.com/photos/5945842/pexels-photo-5945842.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Manga Tommy', category: 'frutas', price: 'R$ 6,50 / kg', image: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Queijo Minas Frescal', category: 'laticinios', price: 'R$ 25,00 / peça', image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Queijo Muçarela Artesanal', category: 'laticinios', price: 'R$ 30,00 / kg', image: 'https://images.pexels.com/photos/4110101/pexels-photo-4110101.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Requeijão Cremoso da Fazenda', category: 'laticinios', price: 'R$ 15,00 / pote', image: 'https://images.pexels.com/photos/806361/pexels-photo-806361.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Doce de Leite Pastoso', category: 'laticinios', price: 'R$ 18,00 / pote', image: 'https://images.pexels.com/photos/6605652/pexels-photo-6605652.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Manteiga Caseira', category: 'laticinios', price: 'R$ 12,00 / 250g', image: 'https://images.pexels.com/photos/5848529/pexels-photo-5848529.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Milho Verde para Pamonha', category: 'graos', price: 'R$ 15,00 / dúzia', image: 'https://images.pexels.com/photos/5856424/pexels-photo-5856424.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Fubá de Milho Caipira', category: 'graos', price: 'R$ 8,00 / kg', image: 'https://images.pexels.com/photos/7623910/pexels-photo-7623910.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Amendoim Cru', category: 'graos', price: 'R$ 10,00 / kg', image: 'https://images.pexels.com/photos/159045/the-interior-of-the-repair-shop-workshop-mechanic-159045.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Farinha de Mandioca Branca', category: 'graos', price: 'R$ 7,50 / kg', image: 'https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Feijão Carioca Novo', category: 'graos', price: 'R$ 9,00 / kg', image: 'https://images.pexels.com/photos/6608310/pexels-photo-6608310.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Arroz Agulhinha', category: 'graos', price: 'R$ 20,00 / 5kg', image: 'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Ovos Caipira', category: 'laticinios', price: 'R$ 12,00 / dúzia', image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Couve Manteiga', category: 'hortalicas', price: 'R$ 3,00 / maço', image: 'https://images.pexels.com/photos/5967868/pexels-photo-5967868.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Limão Taiti', category: 'frutas', price: 'R$ 5,00 / kg', image: 'https://images.pexels.com/photos/1209033/pexels-photo-1209033.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Mel Puro de Abelha', category: 'laticinios', price: 'R$ 35,00 / litro', image: 'https://images.pexels.com/photos/81090/bee-honey-honeycomb-honey-bee-81090.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

async function seedDatabase() {
  try {
    console.log('Limpando dados antigos...');
    await db.ref('users').remove();
    await db.ref('products').remove();
    console.log('Dados antigos removidos.');

    console.log('Adicionando novos usuários...');
    const userPromises = usersData.map(user => {
      const ref = db.ref('users').push();
      return ref.set({ ...user, id: ref.key });
    });
    await Promise.all(userPromises);
    console.log('Usuários adicionados com sucesso.');

    // Pega os usuários recém-criados para associar aos produtos
    const usersSnapshot = await db.ref('users').once('value');
    const users = Object.values(usersSnapshot.val());

    console.log('Adicionando novos produtos...');
    const productPromises = productsData.map((product, index) => {
      const user = users[index % users.length]; // Distribui os produtos entre os usuários
      const ref = db.ref('products').push();
      return ref.set({
        ...product,
        id: ref.key,
        userId: user.id,
        userName: user.name,
        phone: user.phone,
        priceValue: parseFloat(product.price.replace(/[^0-9,]/g, '').replace(',', '.')) || 0,
        createdAt: new Date().toISOString(),
        status: 'available'
      });
    });
    await Promise.all(productPromises);
    console.log('Produtos adicionados com sucesso.');
    console.log('Banco de dados populado!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
    process.exit(1);
  }
}

seedDatabase();
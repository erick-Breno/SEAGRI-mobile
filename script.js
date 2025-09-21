// Global variables
let currentUser = null;
let products = [];
let users = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadUsers();
    loadProducts();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    }
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('showRegister').addEventListener('click', () => toggleAuthForm('register'));
    document.getElementById('showLogin').addEventListener('click', () => toggleAuthForm('login'));
    
    // Logout buttons
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('mobileLogoutBtn').addEventListener('click', handleLogout);
    
    // Navigation
    setupNavigation();
    
    // Forms
    document.getElementById('publishForm').addEventListener('submit', handlePublishProduct);
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    
    // Product filters
    setupProductFilters();
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

function setupProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('filter-active'));
            this.classList.add('filter-active');
            
            filterProducts(filter);
        });
    });
}

function toggleAuthForm(form) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (form === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check admin credentials
    if (email === 'admin@agroconnect.com' && password === 'admin123') {
        currentUser = {
            id: 'admin',
            name: 'Administrador',
            email: email,
            phone: '',
            isAdmin: true
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
        return;
    }
    
    // Check regular user credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
    } else {
        showModal('Erro', 'Email ou senha incorretos!');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showModal('Erro', 'Este email já está cadastrado!');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password,
        isAdmin: false
    };
    
    users.push(newUser);
    saveUsers();
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showModal('Cadastro realizado!', 'Bem-vindo ao AgroConnect!');
    setTimeout(() => {
        closeModal();
        showMainApp();
    }, 2000);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    
    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    toggleAuthForm('login');
}

function showMainApp() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    // Show admin panel if admin
    if (currentUser.isAdmin) {
        document.getElementById('admin-panel').classList.remove('hidden');
    }
    
    // Update profile info
    updateProfileInfo();
    
    // Load products
    loadProductsDisplay();
    loadUserProducts();
    
    // Show home section by default
    showSection('home');
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update navigation active state
    updateNavigation(sectionId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavigation(activeId) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + activeId) {
            link.classList.add('nav-active');
        } else {
            link.classList.remove('nav-active');
        }
    });
}

function handlePublishProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = document.getElementById('productPrice').value;
    const phone = document.getElementById('productPhone').value;
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImage').value;
    
    const newProduct = {
        id: Date.now().toString(),
        name,
        category,
        price,
        phone,
        description,
        image: image || getDefaultImage(category),
        userId: currentUser.id,
        userName: currentUser.name,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    saveProducts();
    
    // Reset form
    document.getElementById('publishForm').reset();
    
    showModal('Produto Publicado!', 'Seu produto foi publicado com sucesso!');
    
    // Refresh displays
    loadProductsDisplay();
    loadUserProducts();
}

function handleContactForm(e) {
    e.preventDefault();
    
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simulate sending email
    const emailData = {
        to: 'erickbreno128@gmail.com',
        from: currentUser.email,
        subject: `[AgroConnect] ${subject}`,
        message: `
            Usuário: ${currentUser.name}
            Email: ${currentUser.email}
            Telefone: ${currentUser.phone}
            
            Sugestão:
            ${message}
        `
    };
    
    console.log('Email enviado:', emailData);
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    showModal('Sugestão Enviada!', 'Sua sugestão foi enviada com sucesso! Obrigado pelo feedback.');
}

function loadProductsDisplay() {
    const grid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');
    
    if (products.length === 0) {
        grid.innerHTML = '';
        noProducts.classList.remove('hidden');
        return;
    }
    
    noProducts.classList.add('hidden');
    
    grid.innerHTML = products.map(product => `
        <div class="product-card bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow" data-category="${product.category}">
            <div class="h-48 bg-cover bg-center" style="background-image: url('${product.image}');"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-400 text-sm mb-2">${getCategoryName(product.category)}</p>
                <p class="text-primary font-bold text-xl mb-2">${product.price}</p>
                <p class="text-gray-300 text-sm mb-3">Por: ${product.userName}</p>
                <div class="flex gap-2">
                    <button onclick="contactSeller('${product.phone}')" class="flex-1 bg-primary text-white py-2 rounded-button hover:bg-green-600 transition-colors cursor-pointer">
                        <i class="ri-phone-line mr-2"></i>Contatar
                    </button>
                    ${currentUser.isAdmin ? `
                        <button onclick="deleteProduct('${product.id}')" class="bg-red-600 text-white px-3 py-2 rounded-button hover:bg-red-700 transition-colors cursor-pointer">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function loadUserProducts() {
    const container = document.getElementById('user-products');
    const noProducts = document.getElementById('no-user-products');
    
    const userProducts = products.filter(p => p.userId === currentUser.id);
    
    // Update product count
    document.getElementById('profileProductCount').textContent = userProducts.length;
    
    if (userProducts.length === 0) {
        container.innerHTML = '';
        noProducts.classList.remove('hidden');
        return;
    }
    
    noProducts.classList.add('hidden');
    
    container.innerHTML = userProducts.map(product => `
        <div class="product-card bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div class="h-48 bg-cover bg-center" style="background-image: url('${product.image}');"></div>
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-400 text-sm mb-2">${getCategoryName(product.category)}</p>
                <p class="text-primary font-bold text-xl mb-3">${product.price}</p>
                <button onclick="deleteUserProduct('${product.id}')" class="w-full bg-red-600 text-white py-2 rounded-button hover:bg-red-700 transition-colors cursor-pointer">
                    <i class="ri-delete-bin-line mr-2"></i>Excluir
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts(filter) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'todos' || category === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function contactSeller(phone) {
    const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=Olá! Vi seu produto no AgroConnect e gostaria de mais informações.`;
    window.open(whatsappUrl, '_blank');
}

function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        loadProductsDisplay();
        showModal('Produto Excluído', 'O produto foi removido com sucesso.');
    }
}

function deleteUserProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        loadProductsDisplay();
        loadUserProducts();
        showModal('Produto Excluído', 'Seu produto foi removido com sucesso.');
    }
}

function updateProfileInfo() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;
}

function getCategoryName(category) {
    const categories = {
        'hortalicas': 'Hortaliças',
        'frutas': 'Frutas',
        'laticinios': 'Laticínios',
        'graos': 'Grãos'
    };
    return categories[category] || category;
}

function getDefaultImage(category) {
    const defaultImages = {
        'hortalicas': 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'frutas': 'https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'laticinios': 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        'graos': 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    };
    return defaultImages[category] || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
}

function showModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('successModal').classList.add('hidden');
}

// Data persistence functions
function saveUsers() {
    localStorage.setItem('agroconnect_users', JSON.stringify(users));
}

function loadUsers() {
    const savedUsers = localStorage.getItem('agroconnect_users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

function saveProducts() {
    localStorage.setItem('agroconnect_products', JSON.stringify(products));
}

function loadProducts() {
    const savedProducts = localStorage.getItem('agroconnect_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}
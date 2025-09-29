import * as api from './api.js';
import * as auth from './auth.js';
import * as ui from './ui.js';
import { initializeSettings } from './settings.js';
import { getDefaultImage, parsePrice, getCategoryName } from './helpers.js';
import { uploadFile } from './storage.js';
import { openImageUploader } from './image-uploader.js';

let state = {
    products: [],
    users: [],
    suggestions: [],
    activeFilter: 'todos',
    currentSection: 'home',
    productBeingEdited: null,
    searchTerm: '',
    selectedProductFile: null,
    selectedProfilePicFile: null,
    selectedGalleryFiles: [],
};

function renderCurrentSection() {
    const user = auth.getCurrentUser();

    switch (state.currentSection) {
        case 'home':
            const featured = [...state.products.filter(p => p.status === 'available')].sort(() => 0.5 - Math.random()).slice(0, 4);
            ui.renderFeaturedProducts(featured, navigateToSellerProfile);
            break;
        case 'produtos':
            const available = state.products.filter(p => p.status === 'available');
            const categoryFiltered = state.activeFilter === 'todos' ? available : available.filter(p => p.category === state.activeFilter);
            const searchFiltered = state.searchTerm 
                ? categoryFiltered.filter(p => p.name.toLowerCase().includes(state.searchTerm.toLowerCase()))
                : categoryFiltered;
            ui.renderProducts(searchFiltered, navigateToSellerProfile);
            break;
        case 'perfil':
            if (user && !user.isAdmin) {
                const userProducts = state.products.filter(p => p.userId === user.id && p.status === 'available');
                ui.updateProfileInfo(user, userProducts.length);
                ui.updateUserGallery(user.galleryUrls, openGalleryModal);
                ui.renderUserProducts(userProducts, openEditProductForm, openDeleteProductConfirm);
            }
            break;
        case 'admin-panel':
            if (user && user.isAdmin) renderAdminPanel();
            break;
    }
}

function renderAdminPanel() {
    ui.renderAdminSuggestions(state.suggestions, openSuggestionModal);
    
    const userFilter = document.querySelector('.admin-user-filter-btn.active')?.dataset.filter;
    if (!userFilter) return;
    
    const usersWithProductCount = state.users.map(u => ({
        ...u,
        productCount: state.products.filter(p => p.userId === u.id && p.status === 'available').length
    }));

    let filteredUsers;
    if (userFilter === 'with-products') filteredUsers = usersWithProductCount.filter(u => u.productCount > 0);
    else if (userFilter === 'without-products') filteredUsers = usersWithProductCount.filter(u => u.productCount === 0);
    else filteredUsers = usersWithProductCount;
    
    ui.renderAdminUsers(filteredUsers);
}
async function handleContactForm(e) { e.preventDefault(); ui.showLoader(); const user = auth.getCurrentUser(); const newSuggestion = { userId: user.id, subject: document.getElementById("contactSubject").value.trim(), message: document.getElementById("contactMessage").value.trim(), userName: user.name, userEmail: user.email, createdAt: new Date().toISOString(), status: 'pending', reply: '' }; try { await api.saveNewSuggestion(newSuggestion); ui.resetForm("contactForm"); showModal("Sugestão Enviada!", "Obrigado! Acompanhe a resposta na aba de Notificações.", 'successModal'); navigateTo('notificacoes'); } catch(err) { showModal("Erro", "Não foi possível enviar a sugestão.", 'successModal'); } finally { ui.hideLoader(); } }

async function handleLogin(e) { e.preventDefault(); ui.showLoader(); const email = document.getElementById("loginEmail").value; const password = document.getElementById("loginPassword").value; const success = auth.login(email, password, state.users); if (success) { ui.showMainApp(auth.getCurrentUser().isAdmin); navigateTo('home'); } else { showModal("Erro", "Email ou senha incorretos!", 'successModal'); } ui.hideLoader(); }

async function handleRegister(e) { e.preventDefault(); ui.showLoader(); const name = document.getElementById("registerName").value.trim(); const email = document.getElementById("registerEmail").value.trim(); const phone = document.getElementById("registerPhone").value; const password = document.getElementById("registerPassword").value; if (state.users.find(u => u.email === email)) { showModal("Erro", "Este email já está cadastrado!", 'successModal'); ui.hideLoader(); return; } const success = await auth.register(name, email, phone, password); if (success) { showModal("Cadastro realizado!", "Bem-vindo ao AgroConnect!", 'successModal'); setTimeout(() => { closeModal('successModal'); ui.showMainApp(false); navigateTo('home'); }, 2000); } else { showModal("Erro", "Não foi possível realizar o cadastro.", 'successModal'); } ui.hideLoader(); }
function handleLogout() { auth.logout(); ui.showAuthScreen(); }

async function handlePublishFormSubmit(e) {
    e.preventDefault();
    ui.showLoader();
    const user = auth.getCurrentUser();
    const form = e.target;
    const mode = form.dataset.mode;
    const productId = form.dataset.productId;

    let imageUrl = state.productBeingEdited?.image || getDefaultImage(document.getElementById("productCategory").value);

    try {
        if (state.selectedProductFile) {
            imageUrl = await uploadFile(state.selectedProductFile, `products/${user.id}`);
        }

        const productData = {
            name: document.getElementById("productName").value.trim(),
            category: document.getElementById("productCategory").value,
            price: document.getElementById("productPrice").value,
            priceValue: parsePrice(document.getElementById("productPrice").value),
            phone: document.getElementById("productPhone").value,
            description: document.getElementById("productDescription").value.trim(),
            image: imageUrl,
            userId: user.id, userName: user.name, status: 'available'
        };

        if (mode === 'edit') {
            await api.updateProduct(productId, productData);
            showModal("Produto Atualizado!", "Suas alterações foram salvas.", 'successModal');
        } else {
            productData.createdAt = new Date().toISOString();
            await api.saveNewProduct(productData);
            showModal("Produto Anunciado!", "Seu produto foi publicado com sucesso!", 'successModal');
        }
        resetPublishForm();
        navigateTo('perfil');
    } catch (error) {
        console.error("Erro ao publicar:", error);
        showModal("Erro", "Ocorreu um erro ao salvar o produto.", 'successModal');
    } finally {
        ui.hideLoader();
    }
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    ui.showLoader();
    const user = auth.getCurrentUser();
    let profilePictureUrl = user.profilePictureUrl || '';
    let newGalleryUrls = [];

    try {
        if (state.selectedProfilePicFile) {
            profilePictureUrl = await uploadFile(state.selectedProfilePicFile, `profiles/${user.id}`);
        }
        if (state.selectedGalleryFiles.length > 0) {
            const uploadPromises = state.selectedGalleryFiles.map(file => uploadFile(file, `galleries/${user.id}`));
            newGalleryUrls = await Promise.all(uploadPromises);
        }

        const updates = {
            name: document.getElementById('editProfileName').value,
            phone: document.getElementById('editProfilePhone').value,
            profilePictureUrl,
            galleryUrls: [...(user.galleryUrls || []), ...newGalleryUrls]
        };

        await api.updateUserProfile(user.id, updates);
        auth.updateCurrentUserData(updates);
        closeModal('editProfileModal');
        showModal('Sucesso', 'Seu perfil foi atualizado.', 'successModal');
        resetEditProfileForm();
        renderCurrentSection();
    } catch (err) {
        console.error("Erro ao atualizar perfil:", err);
        showModal('Erro', 'Não foi possível atualizar o perfil.', 'successModal');
    } finally {
        ui.hideLoader();
    }
}

function navigateTo(sectionId) { const user = auth.getCurrentUser(); if (sectionId === 'perfil' && user?.isAdmin) sectionId = 'admin-panel'; state.currentSection = sectionId; ui.showSection(sectionId); renderCurrentSection(); }
function navigateToSellerProfile(sellerId) { const seller = state.users.find(u => u.id === sellerId); const sellerProducts = state.products.filter(p => p.userId === sellerId && p.status === 'available'); if (seller) { ui.renderSellerProfile(seller, sellerProducts); navigateTo('seller-profile'); } }
function handleFilterClick(filter) { state.activeFilter = filter; document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('filter-active', b.dataset.filter === filter)); renderCurrentSection(); }
function handleAdminTabClick(tabId) { document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId)); document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.toggle('hidden', c.id !== `admin-${tabId}-content`)); }
function handleAdminUserFilterClick(filter) { document.querySelectorAll('.admin-user-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter)); renderAdminPanel(); }
function handleSearchInput(e) { state.searchTerm = e.target.value; renderCurrentSection(); }

function showModal(title, msg, id) { const modal = document.getElementById(id); const titleEl = modal?.querySelector(".modal-title"); const msgEl = modal?.querySelector("#modalMessage"); if (titleEl) titleEl.textContent = title; if (msgEl) msgEl.textContent = msg; modal?.classList.remove("hidden"); }
function closeModal(id) { document.getElementById(id)?.classList.add("hidden"); }

function openEditProductForm(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    state.productBeingEdited = product;
    
    document.getElementById('publishForm').dataset.mode = 'edit';
    document.getElementById('publishForm').dataset.productId = productId;
    
    document.getElementById('publish-form-title').innerHTML = `<i class="ri-edit-2-line"></i> Editar Produto`;
    document.getElementById('publish-form-submit-btn').innerHTML = `<i class="ri-save-line"></i> Salvar Alterações`;
    
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productPhone').value = product.phone;
    document.getElementById('productDescription').value = product.description;
    
    document.getElementById('productImageInfo').textContent = "Alterar imagem (opcional).";
    
    navigateTo('publicar');
}

function resetPublishForm() {
    ui.resetForm('publishForm');
    document.getElementById('publishForm').dataset.mode = 'new';
    document.getElementById('publishForm').dataset.productId = '';
    state.productBeingEdited = null;
    state.selectedProductFile = null;
    document.getElementById('publish-form-title').innerHTML = `<i class="ri-add-circle-line"></i> Anunciar Novo Produto`;
    document.getElementById('publish-form-submit-btn').innerHTML = `<i class="ri-send-plane-fill"></i> Publicar Anúncio`;
    document.getElementById('productImageInfo').textContent = "Nenhuma imagem selecionada.";
}

function resetEditProfileForm() {
    state.selectedProfilePicFile = null;
    state.selectedGalleryFiles = [];
    document.getElementById('profilePictureInfo').textContent = "Nenhuma nova foto selecionada.";
    document.getElementById('galleryInfo').textContent = "Nenhuma foto selecionada.";
}

function openDeleteProductConfirm(productId) { /* ... (código existente sem alteração) ... */ }
function openGalleryModal(imageUrl) { /* ... (código existente sem alteração) ... */ }
function openEditProfileModal() { const user = auth.getCurrentUser(); if (!user) return; resetEditProfileForm(); document.getElementById('editProfileName').value = user.name || ''; document.getElementById('editProfilePhone').value = user.phone || ''; document.getElementById('editProfileModal').classList.remove('hidden'); }
function openSuggestionModal(suggestionId) { /* ... (código existente sem alteração) ... */ }

function setupEventListeners() {
    document.getElementById('publishForm')?.addEventListener('submit', handlePublishFormSubmit);
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('editProfileForm')?.addEventListener('submit', handleUpdateProfile);

    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); if (link.getAttribute("href") === '#publicar') resetPublishForm(); navigateTo(link.getAttribute("href").substring(1)); }); });
    document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => handleFilterClick(btn.dataset.filter)));
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.addEventListener('click', () => handleAdminTabClick(btn.dataset.tab)));
    document.querySelectorAll('.admin-user-filter-btn').forEach(btn => btn.addEventListener('click', () => handleAdminUserFilterClick(btn.dataset.filter)));
    
    document.getElementById('contactForm')?.addEventListener('submit', handleContactForm);
    
    ['logoutBtn', 'mobileLogoutBtn', 'admin-logout-btn', 'profileLogoutBtn'].forEach(id => { document.getElementById(id)?.addEventListener("click", handleLogout); });
    document.getElementById('showRegister')?.addEventListener('click', () => ui.toggleAuthForm('register'));
    document.getElementById('showLogin')?.addEventListener('click', () => ui.toggleAuthForm('login'));
    document.getElementById('backToLoginBtn')?.addEventListener('click', () => ui.toggleAuthForm('login'));
    
    document.querySelectorAll('.close-modal-btn').forEach(el => el.addEventListener('click', () => closeModal(el.dataset.modalId)));
    
    document.getElementById('product-search-input')?.addEventListener('input', handleSearchInput);

    // Event listeners para os novos botões de seleção de imagem
    document.getElementById('selectProductImageBtn').addEventListener('click', async () => {
        try {
            const file = await openImageUploader({ multiple: false });
            state.selectedProductFile = file;
            document.getElementById('productImageInfo').textContent = file.name;
        } catch (error) { console.log(error.message); }
    });

    document.getElementById('selectProfilePictureBtn').addEventListener('click', async () => {
        try {
            const file = await openImageUploader({ multiple: false });
            state.selectedProfilePicFile = file;
            document.getElementById('profilePictureInfo').textContent = `Nova foto: ${file.name}`;
        } catch (error) { console.log(error.message); }
    });

    document.getElementById('selectGalleryBtn').addEventListener('click', async () => {
        try {
            const files = await openImageUploader({ multiple: true });
            state.selectedGalleryFiles = files;
            document.getElementById('galleryInfo').textContent = `${files.length} foto(s) selecionada(s).`;
        } catch (error) { console.log(error.message); }
    });
    
    window.openEditProfileModal = openEditProfileModal;
    window.showSection = (sectionId) => { if(sectionId === 'publicar') resetPublishForm(); navigateTo(sectionId); };
}

function initializeApp() {
    document.removeEventListener("DOMContentLoaded", initializeApp);
    ui.showLoader();
    initializeSettings();
    setupEventListeners();

    const refreshDataAndRender = (snapshot, dataType) => {
        const data = snapshot.val();
        state[dataType] = data ? Object.values(data) : [];
        if (dataType === 'suggestions') state.suggestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (dataType === 'users') {
            const currentUser = auth.getCurrentUser();
            if (currentUser && !currentUser.isAdmin) {
                const updatedUser = state.users.find(u => u.id === currentUser.id);
                if (updatedUser) auth.updateCurrentUserData(updatedUser);
            }
        }
        renderCurrentSection();
    };

    api.onProductsChange(snapshot => refreshDataAndRender(snapshot, 'products'));
    api.onUsersChange(snapshot => refreshDataAndRender(snapshot, 'users'));
    api.onSuggestionsChange(snapshot => refreshDataAndRender(snapshot, 'suggestions'));

    const currentUser = auth.getCurrentUser();
    if (currentUser) { 
        ui.showMainApp(currentUser.isAdmin); 
    } else { 
        ui.showAuthScreen(); 
    }
    ui.hideLoader();
}


document.addEventListener("DOMContentLoaded", initializeApp);

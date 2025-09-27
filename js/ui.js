// ui.js

import * as components from './components.js';

const sections = document.querySelectorAll(".section-content");
// REMOVA ESTA LINHA: const loader = document.getElementById('loader');
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');

// --- NOVO: Função para resetar a UI para o estado padrão ---
function resetUI() {
    document.body.classList.remove('admin-mode');
    document.querySelectorAll('.brand-name').forEach(el => el.textContent = 'AgroConnect');
    document.querySelectorAll('.brand-location').forEach(el => el.textContent = 'Açailândia-MA');
    document.querySelector('.desktop-nav .logout-btn').classList.remove('hidden');
}

// MODIFIQUE showLoader e hideLoader para buscar o elemento sempre que necessário
export const showLoader = () => {
    const loader = document.getElementById('loader'); // Busca o loader na hora
    if (loader) loader.classList.remove('hidden');
};
export const hideLoader = () => {
    const loader = document.getElementById('loader'); // Busca o loader na hora
    if (loader) loader.classList.add('hidden');
};

export const showSection = (sectionId) => {
    sections.forEach((s) => s.classList.add("hidden"));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.remove("hidden");
    updateNavigation(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
};

export const showAuthScreen = () => {
    authScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
    resetUI();
};
export const showMainApp = (isAdmin) => {
    authScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
    if (isAdmin) setupAdminUI();
    else setupUserUI();
    showSection('home');
};
export const toggleAuthForm = (formToShow) => {
    document.getElementById("login-form").classList.toggle("hidden", formToShow === "register");
    document.getElementById("register-form").classList.toggle("hidden", formToShow !== "register");
};
export const resetForm = (formId) => document.getElementById(formId)?.reset();

function renderList(containerId, noContentId, items, createComponentFn, ...args) {
    const container = document.getElementById(containerId);
    const noContentEl = document.getElementById(noContentId);
    if (!container || !noContentEl) return;

    container.innerHTML = '';
    if (!items || items.length === 0) {
        noContentEl.classList.remove('hidden');
    } else {
        noContentEl.classList.add('hidden');
        items.forEach(item => {
            if (typeof createComponentFn === 'function') {
                const element = createComponentFn(item, ...args);
                container.appendChild(element);
            }
        });
    }
}

export const renderAdminUsers = (usersWithProductCount) => {
    const container = document.getElementById('admin-users-list');
    const noContentEl = document.getElementById('no-admin-users');
    if (!container || !noContentEl) return;

    container.innerHTML = '';
    if (!usersWithProductCount || usersWithProductCount.length === 0) {
        noContentEl.classList.remove('hidden');
    } else {
        noContentEl.classList.add('hidden');
        usersWithProductCount.forEach(user => {
            const element = components.createUserAdminCard(user, user.productCount);
            container.appendChild(element);
        });
    }
};

export const renderProducts = (products, onCardClick) => renderList('products-grid', 'no-products', products, components.createProductCard, onCardClick);
export const renderFeaturedProducts = (products, onCardClick) => renderList('featured-products', 'no-featured-products', products, components.createFeaturedProductCard, onCardClick);
export const renderUserProducts = (products, onEdit, onDelete) => renderList('user-products', 'no-user-products', products, components.createUserProductCard, onEdit, onDelete);
export const renderAdminSuggestions = (suggestions, onClick) => renderList('admin-suggestions-list', 'no-admin-suggestions', suggestions, components.createSuggestionCard, true, onClick);
export const renderUserSuggestions = (suggestions, onClick) => renderList('user-suggestions-list', 'no-user-suggestions', suggestions, components.createSuggestionCard, false, onClick);

export const updateProfileInfo = (user, productCount) => {
    if (!user) return;
    document.getElementById("profileName").textContent = user.name || '-';
    document.getElementById("profileEmail").textContent = user.email || '-';
    document.getElementById("profilePhone").textContent = user.phone || '-';
    document.getElementById('profileAvatar').src = user.profilePictureUrl || 'img/default-avatar.png';
    document.getElementById("profileProductCount").textContent = productCount;
};

export const updateUserGallery = (galleryUrls = [], onImageClick) => {
    renderList('user-gallery', 'no-gallery-photos', galleryUrls, (url) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = "Foto da galeria";
        img.addEventListener('click', () => onImageClick(url));
        return img;
    });
};

export const renderSellerProfile = (seller, products) => {
    const container = document.getElementById('seller-profile-content');
    container.innerHTML = '';
    const profileElement = components.createSellerProfile(seller, products);
    container.appendChild(profileElement);
};

function setupAdminUI() {
    document.body.classList.add('admin-mode');

    // Esconder botão de sugestão mobile
    const mobileSuggestionBtn = document.getElementById('mobile-suggestion-btn');
    if (mobileSuggestionBtn) mobileSuggestionBtn.style.display = 'none';

    // Ajustes de nav/admin
    document.getElementById('admin-logout-btn')?.classList.remove('hidden');
    document.querySelectorAll(".admin-only-nav").forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll(".user-only-nav").forEach(el => el.classList.add('hidden'));

    const mobileLink = document.getElementById("mobile-nav-extra-link");
    if (mobileLink) {
        mobileLink.href = "#admin-panel";
        mobileLink.innerHTML = `<i class="ri-shield-user-line"></i><span>Admin</span>`;
    }

    document.querySelectorAll('.brand-location').forEach(el => el.textContent = 'Administrador');
    document.querySelector('.desktop-nav .logout-btn')?.classList.add('hidden');
}


function setupUserUI() {
    document.body.classList.remove('admin-mode');

    // Mostrar botão de sugestão mobile
    const mobileSuggestionBtn = document.getElementById('mobile-suggestion-btn');
    if (mobileSuggestionBtn) mobileSuggestionBtn.style.display = 'flex'; // ou 'block', dependendo do CSS

    document.getElementById('admin-logout-btn')?.classList.add('hidden');
    document.querySelectorAll(".admin-only-nav").forEach(el => el.classList.add('hidden'));
    document.querySelectorAll(".user-only-nav").forEach(el => el.classList.remove('hidden'));

    document.querySelectorAll('.brand-location').forEach(el => el.textContent = 'Açailândia-MA');
    document.querySelector('.desktop-nav .logout-btn')?.classList.remove('hidden');
}



function updateNavigation(activeId) {
    document.querySelectorAll(".nav-link, .mobile-nav-item").forEach(link => {
        link.classList.toggle("nav-active", link.getAttribute("href") === "#" + activeId);
    });
}
import { getCategoryName, formatDate } from './helpers.js';

function createElement(tag, className, content = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.innerHTML = content;
    return el;
}

export function createProductCard(product, onCardClick) {
    const card = createElement('div', 'product-card');
    card.style.cursor = 'pointer';

    const image = createElement('div', 'product-image');
    image.style.backgroundImage = `url('${product.image}')`;

    const content = createElement('div', 'product-content');
    content.innerHTML = `
        <h3>${product.name}</h3>
        <p>${getCategoryName(product.category)}</p>
        <p class="price">${product.price} R$</p>
        <p>Por: ${product.userName}</p>
    `;
    
    card.append(image, content);
    card.addEventListener('click', () => onCardClick(product.userId)); // MODIFICADO: agora passa userId
    return card;
}

export function createFeaturedProductCard(product, onCardClick) {
    const card = createElement('div', 'featured-card product-card');
    card.style.cursor = 'pointer';
    
    const image = createElement('div', 'product-image');
    image.style.backgroundImage = `url('${product.image}')`;
    
    const content = createElement('div', 'product-content');
    content.innerHTML = `
        <h3>${product.name}</h3>
        <p class="price">${product.price} R$</p>
    `;
    
    card.append(image, content);
    card.addEventListener('click', () => onCardClick(product.userId)); // MODIFICADO: agora passa userId
    return card;
}

export function createUserProductCard(product, onEdit, onDelete) {
    const card = createElement('div', 'product-card');
    
    const image = createElement('div', 'product-image');
    image.style.backgroundImage = `url('${product.image}')`;

    const content = createElement('div', 'product-content');
    content.innerHTML = `<h3>${product.name}</h3><p class="price">${product.price} R$</p>`;

    const actions = createElement('div', 'user-product-actions');
    const editBtn = createElement('button', 'btn btn-secondary', '<i class="ri-edit-2-line"></i> Editar');
    const deleteBtn = createElement('button', 'btn btn-danger', '<i class="ri-delete-bin-line"></i> Excluir');
    
    editBtn.addEventListener('click', () => onEdit(product.id));
    deleteBtn.addEventListener('click', () => onDelete(product.id));
    
    actions.append(editBtn, deleteBtn);
    content.append(actions);
    card.append(image, content);
    return card;
}

export function createSellerProfile(seller, products) {
    const fragment = document.createDocumentFragment();

    // Profile Card
    const profileCard = createElement('div', 'profile-card');
    profileCard.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar-wrapper">
                <img src="${seller.profilePictureUrl || 'img/default-avatar.png'}" alt="Foto do Vendedor" class="profile-avatar"/>
            </div>
            <div class="profile-header-info">
                <h2><i class="ri-store-2-line"></i> ${seller.name}</h2>
                <p id="profileEmail" class="profile-email-display">${seller.email}</p>
            </div>
            <div class="profile-header-actions">
                <a href="https://wa.me/55${(seller.phone || '').replace(/\D/g, "")}?text=Olá! Vi seus produtos no AgroConnect." target="_blank" class="btn btn-primary"><i class="ri-whatsapp-line"></i> Contato</a>
            </div>
        </div>
        <div class="profile-info">
            <div class="profile-item"><p>Telefone:</p><p>${seller.phone || '-'}</p></div>
            <div class="profile-item"><p>Produtos à Venda:</p><p>${products.length}</p></div>
        </div>
    `;
    
    // Gallery Section
    const gallerySection = createElement('div');
    gallerySection.innerHTML = `<h3><i class="ri-camera-lens-line"></i> Galeria do Produtor</h3>`;
    const galleryGrid = createElement('div', 'gallery-grid');
    if (seller.galleryUrls && seller.galleryUrls.length > 0) {
        seller.galleryUrls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Foto da galeria';
            img.onclick = () => window.openGalleryModal(url); // Conecta ao modal
            galleryGrid.appendChild(img);
        });
    } else {
        galleryGrid.innerHTML = `<div class="no-content" style="grid-column: 1/-1;"><p>Este produtor ainda não adicionou fotos à galeria.</p></div>`;
    }
    gallerySection.appendChild(galleryGrid);

    // Products Section
    const productsSection = createElement('div');
    productsSection.innerHTML = `<h3>Produtos deste Vendedor</h3>`;
    const productsGrid = createElement('div', 'products-grid');
    if (products.length > 0) {
        products.forEach(p => {
             // Usamos o card normal, mas sem o click para perfil (já estamos nele)
            const card = createProductCard(p, () => {});
            card.style.cursor = 'default';
            productsGrid.appendChild(card);
        });
    } else {
        productsGrid.innerHTML = `<div class="no-content" style="grid-column: 1/-1;"><p>Nenhum produto à venda no momento.</p></div>`;
    }
    productsSection.appendChild(productsGrid);

    fragment.append(profileCard, gallerySection, productsSection);
    return fragment;
}

export function createUserAdminCard(user, productCount) {
    const card = createElement('div', 'admin-user-card');
    card.innerHTML = `
        <h4>${user.name}</h4>
        <p><i class="ri-mail-line"></i> ${user.email}</p>
        <p><i class="ri-phone-line"></i> ${user.phone}</p>
        <p><i class="ri-shopping-bag-3-line"></i> <strong>${productCount}</strong> produtos à venda</p>
    `;
    return card;
}
// Adicione esta função ao final do arquivo components.js

export function createSuggestionCard(suggestion, isAdminView, onClick) {
    // Usa uma classe diferente se for a visão do admin
    const cardClass = isAdminView ? 'suggestion-card-item' : 'user-suggestion-card';
    const card = createElement('div', cardClass);

    // Adiciona classe 'replied' para estilização se já foi respondida
    if (suggestion.status === 'replied') {
        card.classList.add('replied');
    }

    // Conteúdo do card
    card.innerHTML = `
        <h4>${suggestion.subject}</h4>
        <div class="suggestion-meta-info">
            <span>${isAdminView ? `De: ${suggestion.userName}` : formatDate(suggestion.createdAt)}</span>
            <span class="status-${suggestion.status}">${suggestion.status === 'replied' ? 'Respondida' : 'Pendente'}</span>
        </div>
    `;

    // Adiciona o evento de clique para abrir o modal
    card.addEventListener('click', () => onClick(suggestion.id));

    return card;

}

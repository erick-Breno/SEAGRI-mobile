
 function handleSuggestionSubmit(e) {
     e.preventDefault();
     
     const currentUser = getCurrentUser();
     if (!currentUser) return;
     
     const subject = document.getElementById('contactSubject').value.trim();
     const message = document.getElementById('contactMessage').value.trim();
     
     if (!subject || !message) {
         showModal('Erro', 'Por favor, preencha todos os campos.', 'error');
         return;
     }
     
     const suggestion = {
         id: Date.now().toString(),
         userId: currentUser.id,
         userName: currentUser.name,
         userEmail: currentUser.email,
         subject: subject,
         message: message,
         createdAt: new Date().toISOString(),
         status: 'pending',
         reply: ''
     };
     
     // Salvar sugestão
     const suggestions = getSuggestions();
     suggestions.push(suggestion);
     localStorage.setItem('suggestions', JSON.stringify(suggestions));
     
     // Simular envio de email
     console.log('📧 Email enviado para erickbreno128@gmail.com:');
     console.log('Assunto:', subject);
     console.log('De:', currentUser.name, '(',  currentUser.email, ')');
     console.log('Mensagem:', message);
     
     // Limpar formulário
     document.getElementById('contactForm').reset();
     
     // Atualizar lista de sugestões do usuário
    renderUserSuggestions();
     
     showModal('Sugestão Enviada!', 'Sua sugestão foi enviada com sucesso. Obrigado pelo feedback!', 'success');
 }

// Renderizar sugestões do usuário atual
function renderUserSuggestions() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const suggestions = getSuggestions();
    const userSuggestions = suggestions.filter(s => s.userId === currentUser.id);
    
    const container = document.getElementById('user-suggestions-list');
    const noSuggestionsEl = document.getElementById('no-user-suggestions');
    
    if (userSuggestions.length === 0) {
        container.innerHTML = '';
        noSuggestionsEl.classList.remove('hidden');
        return;
    }
    
    noSuggestionsEl.classList.add('hidden');
    
    // Ordenar por data (mais recente primeiro)
    userSuggestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = userSuggestions.map(suggestion => `
        <div class="suggestion-card ${suggestion.status === 'replied' ? 'replied' : ''}">
            <div class="suggestion-header">
                <h4 class="suggestion-title">${escapeHtml(suggestion.subject)}</h4>
                <div class="suggestion-actions">
                    <span class="suggestion-status status-${suggestion.status}">
                        ${suggestion.status === 'replied' ? 'Respondida' : 'Pendente'}
                    </span>
                    <button onclick="deleteSuggestion('${suggestion.id}')" 
                            class="btn-delete-suggestion" 
                            title="Excluir sugestão">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
            
            <div class="suggestion-meta">
                <span class="suggestion-date">
                    <i class="ri-calendar-line"></i>
                    ${formatDate(suggestion.createdAt)}
                </span>
            </div>
            
            <div class="suggestion-content">
                <p class="suggestion-message">${escapeHtml(suggestion.message)}</p>
                
                ${suggestion.status === 'replied' && suggestion.reply ? `
                    <div class="suggestion-reply">
                        <h5><i class="ri-reply-line"></i> Resposta do Administrador:</h5>
                        <p>${escapeHtml(suggestion.reply)}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Excluir sugestão do usuário
function deleteSuggestion(suggestionId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    if (!confirm('Tem certeza que deseja excluir esta sugestão? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const suggestions = getSuggestions();
    const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId && s.userId === currentUser.id);
    
    if (suggestionIndex === -1) {
        showModal('Erro', 'Sugestão não encontrada ou você não tem permissão para excluí-la.', 'error');
        return;
    }
    
    // Remover sugestão
    suggestions.splice(suggestionIndex, 1);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    
    // Atualizar interface
    renderUserSuggestions();
    
    showModal('Sugestão Excluída', 'Sua sugestão foi excluída com sucesso.', 'success');
}

 // ===== FUNÇÕES AUXILIARES =====

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formatar data para exibição
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

 function getCurrentUser() {
     const userData = localStorage.getItem('currentUser');
     return userData ? JSON.parse(userData) : null;
 }

 function showSection(sectionId) {
     // Esconder todas as seções
     document.querySelectorAll('.section-content').forEach(section => {
         section.classList.add('hidden');
     });
     
     // Mostrar seção selecionada
     const targetSection = document.getElementById(sectionId);
     if (targetSection) {
         targetSection.classList.remove('hidden');
        
        // Carregar dados específicos da seção
        if (sectionId === 'produtos') {
            renderProducts();
        } else if (sectionId === 'perfil') {
            renderUserProfile();
        } else if (sectionId === 'contato') {
            renderUserSuggestions();
        }
     }
     
     // Atualizar navegação ativa
     updateActiveNavigation(sectionId);
     
     // Scroll para o topo
     window.scrollTo({ top: 0, behavior: 'smooth' });
 }
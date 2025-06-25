// Global state
let currentDiscipline = null;
let disciplines = [];
let isLoading = false;
let lastLoadTime = 0;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        setupNavigation();
        await loadDisciplines();
        showPage('home');
        setupGoogleForms();
        showConfigurationStatus();
    } catch (error) {
        console.error('Erro na inicialização:', error);
        showErrorMessage('Erro ao inicializar aplicação.');
    }
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            showPage(page);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        updateNavigation(pageId);
    }
}

function updateNavigation(activePageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === activePageId) {
            link.classList.add('active');
        }
    });
}

// Data Loading - Versão melhorada com controle de estado
async function loadDisciplines(force = false) {
    // Evitar múltiplas chamadas simultâneas
    if (isLoading) {
        console.log('Carregamento já em andamento, ignorando...');
        return disciplines;
    }
    
    // Cache por 2 minutos, a menos que seja forçado
    const now = Date.now();
    if (!force && disciplines.length > 0 && (now - lastLoadTime) < 120000) {
        console.log('Usando dados em cache');
        renderDisciplines();
        return disciplines;
    }
    
    isLoading = true;
    
    try {
        showLoading(true);
        console.log('Carregando disciplinas...');
        
        // Verificar se a função existe
        if (typeof fetchDisciplinesFromSheets !== 'function') {
            throw new Error('Função fetchDisciplinesFromSheets não está disponível');
        }
        
        // Buscar dados do Google Sheets
        const newDisciplines = await fetchDisciplinesFromSheets();
        
        // Validar dados recebidos
        if (!Array.isArray(newDisciplines)) {
            throw new Error('Dados inválidos recebidos do Google Sheets');
        }
        
        disciplines = newDisciplines;
        lastLoadTime = now;
        
        console.log(`${disciplines.length} disciplinas carregadas com sucesso`);
        renderDisciplines();
        
        return disciplines;
        
    } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
        
        // Se já temos dados em cache, manter eles
        if (disciplines.length > 0) {
            console.log('Mantendo dados em cache devido ao erro');
            renderDisciplines();
            showTemporaryMessage('Erro ao atualizar. Mostrando dados anteriores.', 'warning');
        } else {
            showErrorMessage('Erro ao carregar disciplinas. Verifique a configuração.');
        }
        
        throw error;
        
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

function renderDisciplines() {
    const grid = document.getElementById('disciplines-grid');
    
    if (!grid) {
        console.error('Grid de disciplinas não encontrado');
        return;
    }
    
    if (disciplines.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 48px 24px;
                color: #6b7280;
            ">
                <h3>📚 Nenhuma disciplina encontrada</h3>
                <p>Configure a integração com Google Sheets para ver suas disciplinas aqui.</p>
                <button class="btn btn-primary" onclick="refreshDisciplines()" style="margin-top: 16px;">
                    🔄 Tentar Novamente
                </button>
            </div>
        `;
        return;
    }
    
    try {
        grid.innerHTML = disciplines.map(discipline => `
            <div class="card" onclick="showDiscipline(${discipline.id})">
                <h3 class="card-title">${escapeHtml(discipline.name)}</h3>
                <p class="card-description">${escapeHtml(discipline.description)}</p>
                <div class="card-meta">
                    ${discipline.contents?.length || 0} materiais disponíveis
                </div>
                <div class="card-actions">
                    <span class="btn btn-primary">Acessar Materiais</span>
                </div>
            </div>
        `).join('');
        
        console.log('Disciplinas renderizadas com sucesso');
        
    } catch (error) {
        console.error('Erro ao renderizar disciplinas:', error);
        showErrorMessage('Erro ao exibir disciplinas.');
    }
}

function showDiscipline(disciplineId) {
    try {
        currentDiscipline = disciplines.find(d => d.id === disciplineId);
        if (!currentDiscipline) {
            showTemporaryMessage('Disciplina não encontrada', 'error');
            return;
        }
        
        document.getElementById('discipline-title').textContent = currentDiscipline.name;
        document.getElementById('discipline-description').textContent = currentDiscipline.description || '';
        
        renderDisciplineContent();
        showPage('discipline');
        
    } catch (error) {
        console.error('Erro ao mostrar disciplina:', error);
        showTemporaryMessage('Erro ao carregar disciplina', 'error');
    }
}

function renderDisciplineContent() {
    const container = document.getElementById('discipline-content');
    const contents = currentDiscipline.contents || [];
    
    if (!container) {
        console.error('Container de conteúdo não encontrado');
        return;
    }
    
    if (contents.length === 0) {
        container.innerHTML = `
            <div class="content-item">
                <h3 class="content-title">📝 Nenhum material disponível</h3>
                <p class="content-description">
                    Os materiais para esta disciplina ainda não foram adicionados à planilha.
                </p>
                <div class="content-actions">
                    <button class="btn btn-secondary" onclick="refreshDisciplines()">
                        🔄 Atualizar
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = contents.map(content => {
        const typeInfo = contentTypes[content.type] || contentTypes.document;
        
        return `
            <div class="content-item">
                <h3 class="content-title">
                    <span style="margin-right: 8px;">${typeInfo.icon}</span>
                    ${escapeHtml(content.title)}
                </h3>
                <p class="content-description">${escapeHtml(content.description)}</p>
                
                <div class="content-actions">
                    <a href="${content.downloadUrl}" 
                       target="_blank" 
                       class="btn btn-primary"
                       onclick="trackDownload('${escapeHtml(content.title)}')">
                        📥 Baixar ${typeInfo.label}
                    </a>
                    <button class="btn btn-secondary" 
                            onclick="togglePreview(${content.id})">
                        👁️ Visualizar
                    </button>
                </div>
                
                <div id="preview-${content.id}" class="content-preview" style="display: none;">
                    <iframe src="${content.previewUrl}" 
                            title="Preview de ${escapeHtml(content.title)}"
                            loading="lazy">
                    </iframe>
                </div>
                
                <div class="content-meta">
                    Tipo: ${typeInfo.label} • 
                    <span style="color: ${typeInfo.color};">●</span> 
                    Material de estudo
                </div>
            </div>
        `;
    }).join('');
}

// Preview functionality
function togglePreview(contentId) {
    const previewElement = document.getElementById(`preview-${contentId}`);
    if (!previewElement) return;
    
    const isVisible = previewElement.style.display !== 'none';
    
    if (isVisible) {
        previewElement.style.display = 'none';
    } else {
        // Hide all other previews
        document.querySelectorAll('.content-preview').forEach(preview => {
            preview.style.display = 'none';
        });
        
        // Show this preview
        previewElement.style.display = 'block';
        
        // Scroll to preview
        setTimeout(() => {
            previewElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
}

// Google Forms setup
function setupGoogleForms() {
    const existingIframe = document.querySelector('#submit-page iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    const formContainer = document.querySelector('#submit-page .form-container');
    if (formContainer && typeof GOOGLE_FORMS_CONFIG !== 'undefined') {
        formContainer.innerHTML = `
            <div class="form-redirect" style="text-align: center; padding: 48px 24px;">
                <h3 style="margin-bottom: 16px;">📝 Enviar Atividade</h3>
                <p style="margin-bottom: 24px; color: #6b7280;">
                    Clique no botão abaixo para acessar o formulário de envio de atividades.
                </p>
                <a href="${GOOGLE_FORMS_CONFIG.formUrl}" 
                   target="_blank" 
                   class="btn btn-primary"
                   style="font-size: 16px; padding: 12px 24px;">
                    🚀 Abrir Formulário
                </a>
                <p style="margin-top: 16px; font-size: 14px; color: #9ca3af;">
                    O formulário será aberto em uma nova aba
                </p>
            </div>
        `;
        
        const formNote = document.querySelector('.form-note');
        if (formNote) {
            formNote.remove();
        }
    }
}

function showConfigurationStatus() {
    const issues = validateConfiguration();
    
    if (issues.length > 0) {
        console.warn('Problemas de configuração encontrados:', issues);
        
        if (typeof showSetupInstructions === 'function') {
            const statusHtml = showSetupInstructions();
            
            const homeHeader = document.querySelector('#home-page .page-header');
            if (homeHeader && statusHtml) {
                homeHeader.insertAdjacentHTML('afterend', statusHtml);
            }
            
            const submitHeader = document.querySelector('#submit-page .page-header');
            if (submitHeader) {
                const submitAlert = statusHtml.replace('Configuração Necessária', 'Google Forms não configurado');
                submitHeader.insertAdjacentHTML('afterend', submitAlert);
            }
        }
    }
}

// Função para atualizar dados manualmente
async function refreshDisciplines() {
    if (isLoading) {
        showTemporaryMessage('Atualização já em andamento...', 'info');
        return;
    }
    
    try {
        await loadDisciplines(true); // Forçar atualização
        showTemporaryMessage('Dados atualizados com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        showTemporaryMessage('Erro ao atualizar dados. Verifique sua conexão.', 'error');
    }
}

// Utility functions
function trackDownload(fileName) {
    console.log(`Download iniciado: ${fileName}`);
}

function showLoading(show = true) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

function showErrorMessage(message) {
    const grid = document.getElementById('disciplines-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-message" style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 48px 24px;
                color: #ef4444;
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 8px;
            ">
                <h3>⚠️ Erro</h3>
                <p>${escapeHtml(message)}</p>
                <button class="btn btn-primary" onclick="refreshDisciplines()" style="margin-top: 16px;">
                    🔄 Tentar Novamente
                </button>
            </div>
        `;
    }
}

function showTemporaryMessage(message, type = 'info') {
    // Remover mensagens anteriores
    const existingMessages = document.querySelectorAll('.temporary-message');
    existingMessages.forEach(msg => msg.remove());
    
    const colors = {
        success: { bg: '#10b981', text: '#ffffff' },
        error: { bg: '#ef4444', text: '#ffffff' },
        warning: { bg: '#f59e0b', text: '#ffffff' },
        info: { bg: '#3b82f6', text: '#ffffff' }
    };
    
    const color = colors[type] || colors.info;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'temporary-message';
    messageElement.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color.bg};
            color: ${color.text};
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
        ">
            ${escapeHtml(message)}
        </div>
    `;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 4000);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}

function validateConfiguration() {
    const issues = [];
    
    if (typeof fetchDisciplinesFromSheets !== 'function') {
        issues.push('Função fetchDisciplinesFromSheets não encontrada');
    }
    
    if (typeof GOOGLE_FORMS_CONFIG === 'undefined') {
        issues.push('Configuração do Google Forms não encontrada');
    } else if (GOOGLE_FORMS_CONFIG.formUrl.includes('EXEMPLO')) {
        issues.push('URL do Google Forms não configurada');
    }
    
    return issues;
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.id === 'discipline-page') {
            showPage('home');
        }
    }
    
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        refreshDisciplines();
    }
});

// Error handling para iframes
function setupIframeErrorHandling(iframe) {
    iframe.addEventListener('error', function() {
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = `
            <div style="
                padding: 20px;
                text-align: center;
                color: #6b7280;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
            ">
                <p>⚠️ Erro ao carregar o conteúdo</p>
                <p style="font-size: 14px; margin-top: 8px;">
                    Verifique se o link está correto e se o arquivo é público.
                </p>
            </div>
        `;
        iframe.parentNode.replaceChild(errorMessage, iframe);
    });
}

// Setup inicial melhorado
function initializeEventListeners() {
    // Observer para iframes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IFRAME') {
                    setupIframeErrorHandling(node);
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Configurar iframes existentes
    document.querySelectorAll('iframe').forEach(setupIframeErrorHandling);
    
    // Detectar mudanças de visibilidade da página
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            // Página ficou visível novamente
            const timeSinceLastLoad = Date.now() - lastLoadTime;
            // Se passou mais de 5 minutos, atualizar automaticamente
            if (timeSinceLastLoad > 300000) {
                console.log('Página ficou visível após longo tempo, atualizando dados...');
                loadDisciplines(true);
            }
        }
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeEventListeners, 100);
});
// Configurações das planilhas Google Sheets
const CONFIG = {
    // URLs das planilhas - SUBSTITUA pelos IDs reais das suas planilhas
    DISCIPLINES_SHEET_ID: 'SEU_ID_DA_PLANILHA_DISCIPLINAS',
    ACTIVITIES_SHEET_ID: 'SEU_ID_DA_PLANILHA_ATIVIDADES',
    
    // URLs completas (serão construídas automaticamente)
    get DISCIPLINES_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.DISCIPLINES_SHEET_ID}/gviz/tq?tqx=out:json`;
    },
    get ACTIVITIES_URL() {
        return `https://docs.google.com/spreadsheets/d/${this.ACTIVITIES_SHEET_ID}/gviz/tq?tqx=out:json`;
    }
};

// Estado da aplicação
const AppState = {
    currentPage: '',
    theme: 'light',
    disciplinesData: [],
    activitiesData: []
};

// Utilitários
const Utils = {
    // Parser para dados do Google Sheets
    parseGoogleSheetsData(response) {
        try {
            // Remove o prefixo do JSONP
            const jsonString = response.substring(47).slice(0, -2);
            const data = JSON.parse(jsonString);
            
            if (!data.table || !data.table.rows) {
                return [];
            }
            
            const rows = data.table.rows;
            const headers = data.table.cols.map(col => col.label || '');
            
            return rows.map(row => {
                const rowData = {};
                row.c.forEach((cell, index) => {
                    const header = headers[index];
                    rowData[header] = cell ? cell.v : '';
                });
                return rowData;
            });
        } catch (error) {
            console.error('Erro ao fazer parse dos dados:', error);
            return [];
        }
    },

    // Agrupar dados por disciplina
    groupByDiscipline(data, disciplineKey = 'Disciplina') {
        const grouped = {};
        data.forEach(item => {
            const discipline = item[disciplineKey] || 'Sem Disciplina';
            if (!grouped[discipline]) {
                grouped[discipline] = [];
            }
            grouped[discipline].push(item);
        });
        return grouped;
    },

    // Formatar data
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    },

    // Debounce para otimizar performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Gerenciador de temas
const ThemeManager = {
    init() {
        this.loadTheme();
        this.setupThemeToggle();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    },

    setTheme(theme) {
        AppState.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    },

    toggleTheme() {
        const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    updateThemeIcon() {
        const themeIcons = document.querySelectorAll('.theme-icon');
        const icon = AppState.theme === 'light' ? '🌙' : '☀️';
        themeIcons.forEach(iconEl => {
            iconEl.textContent = icon;
        });
    },

    setupThemeToggle() {
        const toggleButtons = document.querySelectorAll('#themeToggle');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleTheme());
        });
    }
};

// Gerenciador de dados
const DataManager = {
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            return Utils.parseGoogleSheetsData(text);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            throw error;
        }
    },

    async loadDisciplines() {
        try {
            const data = await this.fetchData(CONFIG.DISCIPLINES_URL);
            AppState.disciplinesData = data;
            return data;
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error);
            return [];
        }
    },

    async loadActivities() {
        try {
            const data = await this.fetchData(CONFIG.ACTIVITIES_URL);
            AppState.activitiesData = data;
            return data;
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            return [];
        }
    }
};

// Renderizadores de página
const PageRenderers = {
    // Renderizar página de disciplinas
    async renderDisciplines() {
        const container = document.getElementById('disciplinesContainer');
        const loading = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');

        if (!container) return;

        try {
            loading.style.display = 'block';
            errorMessage.style.display = 'none';

            const data = await DataManager.loadDisciplines();
            
            if (data.length === 0) {
                this.showEmptyState(container, 'Nenhuma disciplina encontrada.');
                return;
            }

            const groupedData = Utils.groupByDiscipline(data);
            container.innerHTML = this.buildDisciplinesHTML(groupedData);
            this.setupDisciplineToggles();

        } catch (error) {
            console.error('Erro ao renderizar disciplinas:', error);
            errorMessage.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    },

    buildDisciplinesHTML(groupedData) {
        return Object.entries(groupedData).map(([discipline, contents]) => `
            <div class="discipline-folder" data-discipline="${discipline}">
                <div class="discipline-header">
                    <h3 class="discipline-title">${discipline}</h3>
                    <span class="discipline-toggle">▼</span>
                </div>
                <div class="discipline-content">
                    <div class="content-list">
                        ${contents.map(content => `
                            <div class="content-item">
                                <h4 class="content-title">${content['Título do conteúdo'] || 'Sem título'}</h4>
                                <p class="content-description">${content['Descrição'] || 'Sem descrição'}</p>
                                ${content['Link do arquivo'] ? `
                                    <a href="${content['Link do arquivo']}" target="_blank" rel="noopener noreferrer" class="content-link">
                                        📄 Abrir arquivo
                                    </a>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    },

    // Renderizar página de atividades
    async renderActivities() {
        const container = document.getElementById('activitiesContainer');
        const loading = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');

        if (!container) return;

        try {
            loading.style.display = 'block';
            errorMessage.style.display = 'none';

            const data = await DataManager.loadActivities();
            
            if (data.length === 0) {
                this.showEmptyState(container, 'Nenhuma atividade encontrada.');
                return;
            }

            const groupedData = Utils.groupByDiscipline(data);
            container.innerHTML = this.buildActivitiesHTML(groupedData);

        } catch (error) {
            console.error('Erro ao renderizar atividades:', error);
            errorMessage.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    },

    buildActivitiesHTML(groupedData) {
        return Object.entries(groupedData).map(([discipline, activities]) => `
            <div class="activity-group">
                <div class="activity-group-header">
                    <h3 class="activity-group-title">${discipline}</h3>
                </div>
                <div class="activity-list">
                    ${activities.map(activity => `
                        <div class="activity-item">
                            <div class="activity-header">
                                <h4 class="activity-title">${activity['Título da atividade'] || 'Sem título'}</h4>
                                ${activity['Data'] ? `
                                    <span class="activity-date">${Utils.formatDate(activity['Data'])}</span>
                                ` : ''}
                            </div>
                            ${activity['Link do Formulário'] ? `
                                <a href="${activity['Link do Formulário']}" target="_blank" rel="noopener noreferrer" class="activity-link">
                                    📝 Acessar formulário
                                </a>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    showEmptyState(container, message) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem 0; color: var(--text-secondary);">
                <p>${message}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">
                    Verifique se as planilhas estão configuradas corretamente.
                </p>
            </div>
        `;
    },

    setupDisciplineToggles() {
        const headers = document.querySelectorAll('.discipline-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const folder = header.parentElement;
                folder.classList.toggle('expanded');
            });
        });
    }
};

// Gerenciador de navegação
const NavigationManager = {
    init() {
        this.detectCurrentPage();
        this.setupNavigation();
    },

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('atividades.html')) {
            AppState.currentPage = 'activities';
        } else if (path.includes('sobre.html')) {
            AppState.currentPage = 'about';
        } else {
            AppState.currentPage = 'disciplines';
        }
    },

    setupNavigation() {
        // Adicionar indicador de página ativa
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (
                (AppState.currentPage === 'disciplines' && href === 'index.html') ||
                (AppState.currentPage === 'activities' && href === 'atividades.html') ||
                (AppState.currentPage === 'about' && href === 'sobre.html')
            ) {
                link.classList.add('active');
            }
        });
    }
};

// Inicialização da aplicação
const App = {
    async init() {
        try {
            // Inicializar gerenciadores
            ThemeManager.init();
            NavigationManager.init();

            // Renderizar conteúdo baseado na página atual
            await this.renderCurrentPage();

            // Configurar listeners globais
            this.setupGlobalListeners();

        } catch (error) {
            console.error('Erro na inicialização da aplicação:', error);
        }
    },

    async renderCurrentPage() {
        switch (AppState.currentPage) {
            case 'disciplines':
                await PageRenderers.renderDisciplines();
                break;
            case 'activities':
                await PageRenderers.renderActivities();
                break;
            case 'about':
                // Página sobre não precisa de renderização dinâmica
                break;
        }
    },

    setupGlobalListeners() {
        // Listener para redimensionamento da janela
        window.addEventListener('resize', Utils.debounce(() => {
            // Reajustar layout se necessário
        }, 250));

        // Listener para mudanças de tema do sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    ThemeManager.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exportar para uso global (se necessário)
window.TutoriaApp = {
    CONFIG,
    AppState,
    Utils,
    ThemeManager,
    DataManager,
    PageRenderers,
    NavigationManager,
    App
};


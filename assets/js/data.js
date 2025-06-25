// Configuração GRATUITA do Google Sheets (CSV Público)
const SHEETS_CONFIG = {
    // Substitua apenas pelo ID da sua planilha (sem API Key!)
    SPREADSHEET_ID: '10IJhsn-PgH9Q7mQtXWyp8fLagRccYD2u44xgtFiaG3w', // Ex: 1BxLvYw8XgF4NeRtA7sD2qP9mK8jH6gF5dS3aZ1xC2vB
    SHEET_GID: '0', // GID da aba (normalmente 0, mas pode verificar na URL)
    SHEET_NAME: 'disciplinas', // Nome da aba (apenas para referência)
    
    // URL do CSV público (SEM API KEY!)
    get csvUrl() {
        return `https://docs.google.com/spreadsheets/d/e/2PACX-1vSlJvF-HrULzwRKc70d7ImyQgz1rjZMJGwI14MLv6oYZyAU6i3pSf332MQZGkhosb0v0GjEn1EzHeOg/pub?output=csv`;
    }
};

// Configuração do Google Forms
const GOOGLE_FORMS_CONFIG = {
    // Substitua pelo link do seu Google Forms
    formUrl: 'https://forms.gle/EXEMPLO_DO_SEU_FORM',
    
    // Instruções para configuração
};

// Cache dos dados para melhor performance
let cachedDisciplines = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Tipos de conteúdo com ícones e cores
const contentTypes = {
    pdf: {
        label: "PDF",
        icon: "📄",
        color: "#ef4444"
    },
    video: {
        label: "Vídeo", 
        icon: "🎥",
        color: "#8b5cf6"
    },
    slides: {
        label: "Slides",
        icon: "📊", 
        color: "#06b6d4"
    },
    document: {
        label: "Documento",
        icon: "📝",
        color: "#10b981"
    },
    exercicio: {
        label: "Exercício",
        icon: "✏️",
        color: "#f59e0b"
    }
};

// Função principal para buscar dados da planilha via CSV (GRATUITO!)
async function fetchDisciplinesFromSheets() {
    try {
        // Verificar se há dados em cache válidos
        if (cachedDisciplines && lastFetchTime && 
            (Date.now() - lastFetchTime) < CACHE_DURATION) {
            console.log('📋 Usando dados do cache');
            return cachedDisciplines;
        }

        showLoading(true);
        console.log('🔄 Carregando dados da planilha via CSV...');
        
        // Buscar dados via CSV público (sem API Key!)
        const response = await fetch(SHEETS_CONFIG.csvUrl);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        if (!csvText.trim()) {
            throw new Error('CSV vazio - verifique se a planilha está pública');
        }
        
        console.log('✅ CSV carregado com sucesso');
        const disciplines = parseCSVData(csvText);
        
        // Atualizar cache
        cachedDisciplines = disciplines;
        lastFetchTime = Date.now();
        
        console.log(`📚 ${disciplines.length} disciplinas carregadas`);
        return disciplines;
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados da planilha:', error);
        
        // Mostrar erro específico para o usuário
        if (error.message.includes('404')) {
            console.error('🚨 Planilha não encontrada - verifique o ID da planilha');
        } else if (error.message.includes('403')) {
            console.error('🚨 Acesso negado - verifique se a planilha está pública');
        }
        
        // Retornar dados de exemplo em caso de erro
        return getExampleDisciplines();
        
    } finally {
        showLoading(false);
    }
}

// Processar dados do CSV
function parseCSVData(csvText) {
    console.log('🔧 Processando dados do CSV...');
    
    // Dividir em linhas e remover linhas vazias
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        throw new Error('CSV deve ter pelo menos cabeçalho e uma linha de dados');
    }
    
    const [headerLine, ...dataLines] = lines;
    
    // Processar cabeçalhos
    const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().trim());
    console.log('📋 Cabeçalhos encontrados:', headers);
    
    // Validar cabeçalhos esperados
    const expectedHeaders = ['disciplina', 'descricao', 'titulo_conteudo', 'desc_conteudo', 'tipo', 'link_drive'];
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
        console.warn('⚠️ Cabeçalhos faltando na planilha:', missingHeaders);
    }
    
    // Mapear índices dos cabeçalhos
    const headerMap = {};
    expectedHeaders.forEach(header => {
        const index = headers.indexOf(header);
        if (index !== -1) {
            headerMap[header] = index;
        }
    });
    
    console.log('🗂️ Mapeamento de cabeçalhos:', headerMap);
    
    // Agrupar dados por disciplina
    const disciplinesMap = new Map();
    let contentIdCounter = 1;
    let processedRows = 0;
    
    dataLines.forEach((line, rowIndex) => {
        if (!line.trim()) return;
        
        try {
            const columns = parseCSVLine(line);
            
            const disciplineName = columns[headerMap.disciplina]?.trim();
            if (!disciplineName) {
                console.warn(`⚠️ Linha ${rowIndex + 2}: disciplina vazia, ignorando`);
                return;
            }
            
            // Criar ou obter disciplina
            if (!disciplinesMap.has(disciplineName)) {
                disciplinesMap.set(disciplineName, {
                    id: disciplinesMap.size + 1,
                    name: disciplineName,
                    description: columns[headerMap.descricao]?.trim() || '',
                    contents: []
                });
                console.log(`📖 Nova disciplina: ${disciplineName}`);
            }
            
            const discipline = disciplinesMap.get(disciplineName);
            
            // Adicionar conteúdo se existir
            const contentTitle = columns[headerMap.titulo_conteudo]?.trim();
            const driveLink = columns[headerMap.link_drive]?.trim();
            
            if (contentTitle && driveLink) {
                const content = {
                    id: contentIdCounter++,
                    title: contentTitle,
                    description: columns[headerMap.desc_conteudo]?.trim() || '',
                    type: columns[headerMap.tipo]?.trim().toLowerCase() || 'document',
                    fileId: extractFileIdFromDriveUrl(driveLink),
                    downloadUrl: generateDownloadUrl(driveLink),
                    previewUrl: generatePreviewUrl(driveLink)
                };
                
                discipline.contents.push(content);
                console.log(`📄 Conteúdo adicionado: ${contentTitle} (${content.type})`);
            }
            
            processedRows++;
            
        } catch (error) {
            console.error(`❌ Erro ao processar linha ${rowIndex + 2}:`, error);
        }
    });
    
    console.log(`✅ Processamento concluído: ${processedRows} linhas processadas`);
    return Array.from(disciplinesMap.values());
}

// Função auxiliar para processar linha CSV (handle vírgulas dentro de aspas)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
        const char = line[i];
        
        if (char === '"') {
            // Verificar se é aspas duplas escapadas ("")
            if (i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i += 2; // Pular ambas as aspas
            } else {
                inQuotes = !inQuotes;
                i++;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
            i++;
        } else {
            current += char;
            i++;
        }
    }
    
    // Adicionar último campo
    result.push(current.trim());
    
    // Remover aspas do início e fim dos campos
    return result.map(field => {
        field = field.trim();
        if (field.startsWith('"') && field.endsWith('"')) {
            return field.slice(1, -1);
        }
        return field;
    });
}

// Extrair ID do arquivo do link do Google Drive
function extractFileIdFromDriveUrl(url) {
    if (!url) return '';
    
    // Padrões de URL do Google Drive
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9-_]+)/,
        /id=([a-zA-Z0-9-_]+)/,
        /\/d\/([a-zA-Z0-9-_]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return url; // Retorna a URL original se não conseguir extrair ID
}

// Gerar URL de download
function generateDownloadUrl(driveUrl) {
    const fileId = extractFileIdFromDriveUrl(driveUrl);
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Gerar URL de preview
function generatePreviewUrl(driveUrl) {
    const fileId = extractFileIdFromDriveUrl(driveUrl);
    return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Dados de exemplo para fallback
function getExampleDisciplines() {
    return [
        {
            id: 1,
            name: "⚙️ Configuração Necessária",
            description: "Configure a integração com Google Sheets para carregar suas disciplinas",
            contents: [
                {
                    id: 1,
                    title: "Como Configurar (Método CSV - GRATUITO)",
                    description: "Siga as instruções abaixo para configurar a integração gratuita",
                    type: "document",
                    fileId: "",
                    downloadUrl: "#",
                    previewUrl: "#"
                }
            ]
        }
    ];
}

// Função para validar configuração
function validateConfiguration() {
    const issues = [];
    
    if (!SHEETS_CONFIG.SPREADSHEET_ID || SHEETS_CONFIG.SPREADSHEET_ID === 'SEU_SPREADSHEET_ID_AQUI') {
        issues.push('ID da planilha não configurado');
    }
    
    if (!GOOGLE_FORMS_CONFIG.formUrl || GOOGLE_FORMS_CONFIG.formUrl.includes('EXEMPLO')) {
        issues.push('URL do Google Forms não configurada');
    }
    
    return issues;
}

// Função para obter GID da aba (auxiliar)
function getSheetGIDFromUrl(sheetUrl) {
    const match = sheetUrl.match(/gid=(\d+)/);
    return match ? match[1] : '0';
}




// Função para testar a conexão
async function testConnection() {
    console.log('🧪 Testando conexão com a planilha...');
    console.log('📊 URL do CSV:', SHEETS_CONFIG.csvUrl);
    
    try {
        const response = await fetch(SHEETS_CONFIG.csvUrl);
        console.log('📡 Status da resposta:', response.status, response.statusText);
        
        if (response.ok) {
            const csvText = await response.text();
            console.log('✅ CSV carregado com sucesso!');
            console.log('📄 Primeiros 200 caracteres:', csvText.substring(0, 200) + '...');
            return true;
        } else {
            console.error('❌ Erro na resposta:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao testar conexão:', error);
        return false;
    }
}

// Log das instruções no console
console.group('📚 Portal do Tutor - Instruções de Configuração GRATUITA');
console.log('🆓', setupInstructions.method);
console.log('\n' + setupInstructions.sheets.title);
setupInstructions.sheets.steps.forEach(step => console.log(step));
console.log('\n' + setupInstructions.forms.title);
setupInstructions.forms.steps.forEach(step => console.log(step));
console.log('\n' + setupInstructions.example.title);
console.log('Cabeçalhos:', setupInstructions.example.headers);
console.log('Exemplo 1:', setupInstructions.example.row1);
console.log('Exemplo 2:', setupInstructions.example.row2);
console.log('\n' + setupInstructions.csv.title);
console.log('💡', setupInstructions.csv.explanation);
console.log('URL Original:', setupInstructions.csv.urlExample.original);
console.log('URL CSV:', setupInstructions.csv.urlExample.csv);
console.groupEnd();

// Função para forçar atualização dos dados
function refreshData() {
    console.log('🔄 Forçando atualização dos dados...');
    cachedDisciplines = null;
    lastFetchTime = null;
    return fetchDisciplinesFromSheets();
}

// Exportar funções principais para uso no script.js
window.fetchDisciplinesFromSheets = fetchDisciplinesFromSheets;
window.GOOGLE_FORMS_CONFIG = GOOGLE_FORMS_CONFIG;
window.contentTypes = contentTypes;
window.showSetupInstructions = showSetupInstructions;
window.refreshData = refreshData;
window.testConnection = testConnection;

// Função auxiliar para mostrar loading (deve ser implementada no script principal)
function showLoading(show) {
    // Esta função deve ser implementada no seu script principal
    // Exemplo: document.getElementById('loading').style.display = show ? 'block' : 'none';
    console.log(show ? '⏳ Carregando...' : '✅ Carregamento concluído');
}
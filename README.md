# Site de Tutoria - Pedro Lucas

Site estático minimalista e responsivo para tutoria educacional, com dados automatizados via Google Sheets públicos.

## 📁 Estrutura do Projeto

```
website_tutoria/
├── index.html          # Página principal (Disciplinas)
├── atividades.html     # Página de Atividades
├── sobre.html          # Página Sobre
├── styles.css          # Estilos CSS
├── scripts.js          # Funcionalidades JavaScript
└── README.md           # Este arquivo
```

## 🚀 Configuração

### 1. Preparar as Planilhas Google Sheets

#### Planilha 1: Disciplinas e Conteúdos
Crie uma planilha com as seguintes colunas:
- **Disciplina**: Nome da disciplina
- **Título do conteúdo**: Título do material
- **Descrição**: Descrição do conteúdo
- **Link do arquivo**: URL do arquivo no Google Drive

Exemplo:
| Disciplina | Título do conteúdo | Descrição | Link do arquivo |
|------------|-------------------|-----------|-----------------|
| Matemática | Álgebra Linear | Conceitos básicos de álgebra | https://drive.google.com/... |
| Física | Mecânica Clássica | Leis de Newton | https://drive.google.com/... |

#### Planilha 2: Atividades
Crie uma planilha com as seguintes colunas:
- **Disciplina**: Nome da disciplina
- **Título da atividade**: Nome da atividade
- **Data**: Data da atividade (formato: DD/MM/AAAA)
- **Link do Formulário**: URL do Google Forms

Exemplo:
| Disciplina | Título da atividade | Data | Link do Formulário |
|------------|-------------------|------|-------------------|
| Matemática | Exercícios Álgebra | 15/12/2024 | https://forms.google.com/... |
| Física | Lista Newton | 20/12/2024 | https://forms.google.com/... |

### 2. Configurar Permissões das Planilhas

1. Abra cada planilha no Google Sheets
2. Clique em "Compartilhar" (botão azul no canto superior direito)
3. Em "Acesso geral", selecione "Qualquer pessoa com o link"
4. Defina a permissão como "Visualizador"
5. Copie o ID da planilha da URL (parte entre `/d/` e `/edit`)

### 3. Configurar o JavaScript

Abra o arquivo `scripts.js` e localize a seção `CONFIG` no início do arquivo:

```javascript
const CONFIG = {
    // URLs das planilhas - SUBSTITUA pelos IDs reais das suas planilhas
    DISCIPLINES_SHEET_ID: 'SEU_ID_DA_PLANILHA_DISCIPLINAS',
    ACTIVITIES_SHEET_ID: 'SEU_ID_DA_PLANILHA_ATIVIDADES',
    // ...
};
```

Substitua `SEU_ID_DA_PLANILHA_DISCIPLINAS` e `SEU_ID_DA_PLANILHA_ATIVIDADES` pelos IDs reais das suas planilhas.

## 🌐 Deploy no GitHub Pages

### 1. Criar Repositório
1. Acesse [GitHub](https://github.com) e faça login
2. Clique em "New repository"
3. Nomeie o repositório (ex: `tutoria-site`)
4. Marque como "Public"
5. Clique em "Create repository"

### 2. Upload dos Arquivos
1. Na página do repositório, clique em "uploading an existing file"
2. Arraste todos os arquivos do projeto para a área de upload
3. Adicione uma mensagem de commit (ex: "Adicionar site de tutoria")
4. Clique em "Commit changes"

### 3. Ativar GitHub Pages
1. Vá para "Settings" do repositório
2. Role até a seção "Pages"
3. Em "Source", selecione "Deploy from a branch"
4. Escolha "main" como branch e "/ (root)" como pasta
5. Clique em "Save"

O site estará disponível em: `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO`

## 🎨 Funcionalidades

### Modo Claro/Escuro
- Botão no canto superior direito para alternar temas
- Preferência salva automaticamente no navegador
- Detecta preferência do sistema operacional

### Responsividade
- Layout adaptável para desktop, tablet e mobile
- Menu responsivo
- Cards e elementos otimizados para touch

### Carregamento Dinâmico
- Dados carregados automaticamente das planilhas
- Indicadores de carregamento
- Tratamento de erros

### Organização por Disciplinas
- Disciplinas agrupadas em pastas expansíveis
- Links diretos para arquivos do Google Drive
- Formulários organizados por disciplina

## 🛠️ Personalização

### Cores e Temas
Edite as variáveis CSS em `styles.css`:
```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #212529;
    --accent-color: #495057;
    /* ... */
}
```

### Informações de Contato
Edite o arquivo `sobre.html` para alterar:
- Nome do tutor
- Email de contato
- Descrição pessoal

### Fontes
Para alterar a fonte, modifique o link no `<head>` dos arquivos HTML e a propriedade `font-family` no CSS.

## 🔧 Solução de Problemas

### Dados não carregam
1. Verifique se os IDs das planilhas estão corretos
2. Confirme que as planilhas estão públicas
3. Verifique se as colunas têm os nomes exatos especificados
4. Abra o console do navegador (F12) para ver erros

### Layout quebrado
1. Verifique se todos os arquivos CSS e JS estão no mesmo diretório
2. Confirme que os links nos arquivos HTML estão corretos
3. Teste em diferentes navegadores

### Problemas de CORS
- Use um servidor local (Live Server no VS Code) para testar
- O GitHub Pages resolve automaticamente problemas de CORS

## 📱 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 📄 Licença

Este projeto é de uso livre para fins educacionais.

---

**Desenvolvido para Pedro Lucas - Tutoria Educacional**


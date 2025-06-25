# Portal do Tutor - Site Estático

Um site estático moderno e responsivo para tutores, com design inspirado no Notion, integração com Google Drive para materiais e Google Forms para envio de atividades.

## 🚀 Características

- **Design Limpo**: Interface inspirada no Notion com tipografia moderna
- **Totalmente Responsivo**: Funciona perfeitamente em desktop e mobile
- **Integração Google Drive**: Visualização e download direto de materiais
- **Google Forms**: Envio de atividades integrado
- **Estático**: Apenas HTML, CSS e JavaScript - sem backend necessário
- **GitHub Pages Ready**: Pronto para deploy no GitHub Pages

## 📁 Estrutura do Projeto

```
static-tutor-site/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos do site
│   ├── js/
│   │   ├── data.js         # Dados das disciplinas e configurações
│   │   └── script.js       # Funcionalidades do site
│   └── images/             # Imagens (se necessário)
├── README.md               # Este arquivo
└── .gitignore             # Arquivos a serem ignorados pelo Git
```

## ⚙️ Configuração

### 1. Configurar Google Drive

1. **Upload dos Materiais**:
   - Faça upload dos seus PDFs, slides e vídeos para o Google Drive
   - Organize em pastas por disciplina (opcional)

2. **Obter Links dos Arquivos**:
   - Para cada arquivo, clique com o botão direito → "Obter link"
   - Certifique-se de que a permissão está como "Qualquer pessoa com o link"
   - Copie o ID do arquivo da URL

   **Exemplo**:
   ```
   URL original: https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view
   ID do arquivo: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   ```

3. **Atualizar data.js**:
   - Abra o arquivo `assets/js/data.js`
   - Substitua os IDs de exemplo pelos seus IDs reais
   - Atualize títulos, descrições e informações das disciplinas

### 2. Configurar Google Forms

1. **Criar Formulário**:
   - Acesse [Google Forms](https://forms.google.com)
   - Crie um novo formulário com os campos:
     - Nome do Aluno (texto)
     - Disciplina (múltipla escolha ou texto)
     - Upload de Arquivo (upload de arquivo)
     - Comentários (texto longo, opcional)

2. **Configurar Upload**:
   - No campo de upload, configure para salvar no seu Google Drive
   - Defina tipos de arquivo permitidos (PDF, DOC, etc.)

3. **Obter Link de Incorporação**:
   - Clique em "Enviar" → ícone "< >"
   - Copie o link de incorporação
   - Cole no arquivo `data.js` na variável `googleFormsConfig.submitFormUrl`

### 3. Personalizar Conteúdo

#### Disciplinas e Materiais

Edite o arquivo `assets/js/data.js`:

```javascript
const disciplines = [
    {
        id: 1,
        name: "Nome da Disciplina",
        description: "Descrição da disciplina",
        contents: [
            {
                id: 1,
                title: "Título do Material",
                description: "Descrição do material",
                type: "pdf", // pdf, video, slides, document
                fileId: "SEU_ID_DO_GOOGLE_DRIVE",
                downloadUrl: "https://drive.google.com/uc?export=download&id=SEU_ID",
                previewUrl: "https://drive.google.com/file/d/SEU_ID/preview"
            }
        ]
    }
];
```

#### Tipos de Conteúdo Suportados

- `pdf`: Documentos PDF
- `video`: Vídeos
- `slides`: Apresentações
- `document`: Documentos gerais

## 🌐 Deploy no GitHub Pages

### Método 1: Interface Web do GitHub

1. **Criar Repositório**:
   - Acesse [GitHub](https://github.com) e crie um novo repositório
   - Nome sugerido: `portal-tutor` ou similar
   - Marque como público

2. **Upload dos Arquivos**:
   - Clique em "uploading an existing file"
   - Arraste todos os arquivos do projeto
   - Commit as mudanças

3. **Ativar GitHub Pages**:
   - Vá em Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" ou "master"
   - Folder: "/ (root)"
   - Clique em "Save"

4. **Acessar o Site**:
   - O site estará disponível em: `https://seuusuario.github.io/nome-do-repositorio`

### Método 2: Git Command Line

```bash
# Clonar ou inicializar repositório
git init
git add .
git commit -m "Initial commit"

# Adicionar repositório remoto
git remote add origin https://github.com/seuusuario/nome-do-repositorio.git

# Push para GitHub
git push -u origin main
```

## 🎨 Personalização Visual

### Cores

Edite o arquivo `assets/css/styles.css` para alterar as cores:

```css
:root {
    --primary-color: #0056f6;      /* Azul principal */
    --text-color: #111111;         /* Texto principal */
    --text-secondary: #6b7280;     /* Texto secundário */
    --border-color: #e5e5e5;       /* Bordas */
    --background: #ffffff;         /* Fundo */
}
```

### Tipografia

Para alterar a fonte, substitua no `<head>` do `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=SuaFonte:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

E no CSS:

```css
body {
    font-family: 'SuaFonte', sans-serif;
}
```

## 📱 Funcionalidades

### Para Estudantes

- **Navegação Simples**: Interface intuitiva sem necessidade de login
- **Visualização de Materiais**: Preview direto no site ou download
- **Envio de Atividades**: Formulário integrado com Google Forms
- **Responsivo**: Funciona em qualquer dispositivo

### Para Tutores

- **Fácil Atualização**: Edite apenas o arquivo `data.js`
- **Organização**: Materiais organizados por disciplina
- **Recebimento**: Atividades chegam diretamente no seu Google Drive
- **Sem Manutenção**: Site estático não requer servidor

## 🔧 Manutenção

### Adicionar Nova Disciplina

1. Abra `assets/js/data.js`
2. Adicione um novo objeto no array `disciplines`
3. Faça commit e push das mudanças

### Adicionar Novo Material

1. Faça upload do arquivo para o Google Drive
2. Obtenha o ID do arquivo
3. Adicione no array `contents` da disciplina correspondente
4. Faça commit e push das mudanças

### Atualizar Formulário

1. Edite o formulário no Google Forms
2. Se necessário, atualize o link em `data.js`
3. Faça commit e push das mudanças

## 🐛 Solução de Problemas

### Arquivos não Carregam

- Verifique se os IDs do Google Drive estão corretos
- Confirme que os arquivos têm permissão "Qualquer pessoa com o link"
- Teste os links diretamente no navegador

### Formulário não Aparece

- Verifique se o link do Google Forms está correto
- Confirme que o formulário está configurado para aceitar respostas
- Teste o link do formulário diretamente

### Site não Atualiza

- Aguarde alguns minutos (GitHub Pages pode demorar para atualizar)
- Limpe o cache do navegador (Ctrl+F5)
- Verifique se o commit foi feito corretamente

## 📞 Suporte

Para dúvidas sobre:
- **Google Drive**: [Central de Ajuda do Google Drive](https://support.google.com/drive)
- **Google Forms**: [Central de Ajuda do Google Forms](https://support.google.com/forms)
- **GitHub Pages**: [Documentação do GitHub Pages](https://docs.github.com/pages)

## 📄 Licença

Este projeto é de uso livre. Você pode modificar e distribuir conforme necessário.

---

**Desenvolvido com ❤️ para facilitar o ensino e aprendizado**


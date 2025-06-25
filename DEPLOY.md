# Guia de Deploy no GitHub Pages

Este guia irá te ajudar a colocar seu Portal do Tutor online usando o GitHub Pages.

## 📋 Pré-requisitos

- Conta no GitHub (gratuita)
- Arquivos do projeto baixados
- Google Drive com materiais organizados
- Google Forms configurado

## 🚀 Passo a Passo

### 1. Criar Repositório no GitHub

1. Acesse [GitHub.com](https://github.com) e faça login
2. Clique no botão verde "New" ou "+" → "New repository"
3. Nome do repositório: `portal-tutor` (ou outro nome de sua escolha)
4. Marque como **Public** (necessário para GitHub Pages gratuito)
5. Clique em "Create repository"

### 2. Configurar Seus Dados

Antes de fazer upload, você precisa personalizar o site:

#### A. Configurar Google Drive (arquivo `assets/js/data.js`)

1. Faça upload dos seus materiais para o Google Drive
2. Para cada arquivo:
   - Clique com botão direito → "Obter link"
   - Permissão: "Qualquer pessoa com o link"
   - Copie o ID do arquivo (parte entre `/d/` e `/view`)

3. Edite o arquivo `assets/js/data.js`:
   ```javascript
   // Substitua os IDs de exemplo pelos seus IDs reais
   fileId: "SEU_ID_AQUI",
   downloadUrl: "https://drive.google.com/uc?export=download&id=SEU_ID_AQUI",
   previewUrl: "https://drive.google.com/file/d/SEU_ID_AQUI/preview"
   ```

#### B. Configurar Google Forms

1. Crie um formulário no [Google Forms](https://forms.google.com)
2. Adicione campos:
   - Nome do Aluno (texto)
   - Disciplina (múltipla escolha)
   - Upload de Arquivo
   - Comentários (opcional)

3. Configure upload para salvar no seu Google Drive
4. Clique em "Enviar" → ícone "< >" (incorporar)
5. Copie o link e cole em `data.js`:
   ```javascript
   submitFormUrl: "SEU_LINK_DO_FORMS_AQUI"
   ```

### 3. Upload dos Arquivos

#### Método 1: Interface Web (Mais Fácil)

1. No seu repositório GitHub, clique em "uploading an existing file"
2. Arraste TODOS os arquivos do projeto:
   ```
   index.html
   assets/
   ├── css/styles.css
   ├── js/data.js
   └── js/script.js
   README.md
   .gitignore
   ```
3. Escreva uma mensagem: "Initial commit"
4. Clique em "Commit changes"

#### Método 2: Git Command Line

```bash
# Clone o repositório
git clone https://github.com/seuusuario/portal-tutor.git
cd portal-tutor

# Copie todos os arquivos do projeto para esta pasta

# Adicione e commit
git add .
git commit -m "Initial commit"
git push origin main
```

### 4. Ativar GitHub Pages

1. No seu repositório, vá em **Settings** (aba no topo)
2. Role para baixo até **Pages** (menu lateral esquerdo)
3. Em **Source**, selecione:
   - **Deploy from a branch**
   - **Branch**: main (ou master)
   - **Folder**: / (root)
4. Clique em **Save**

### 5. Acessar Seu Site

- Aguarde 2-5 minutos para o deploy
- Seu site estará em: `https://seuusuario.github.io/portal-tutor`
- O link aparecerá na seção Pages das configurações

## ✅ Checklist Final

- [ ] Todos os arquivos foram enviados
- [ ] IDs do Google Drive foram atualizados
- [ ] Google Forms foi configurado
- [ ] GitHub Pages foi ativado
- [ ] Site está acessível no link fornecido

## 🔄 Atualizações Futuras

Para adicionar novos materiais ou fazer mudanças:

1. Edite o arquivo `assets/js/data.js`
2. Faça commit das mudanças:
   - Interface web: edite o arquivo diretamente no GitHub
   - Git: `git add .` → `git commit -m "Atualização"` → `git push`
3. Aguarde alguns minutos para a atualização

## 🆘 Problemas Comuns

### Site não carrega
- Verifique se o repositório é público
- Confirme que GitHub Pages está ativado
- Aguarde até 10 minutos para propagação

### Arquivos não baixam
- Verifique se os IDs do Google Drive estão corretos
- Confirme que os arquivos têm permissão pública
- Teste os links diretamente no navegador

### Formulário não aparece
- Verifique se o link do Google Forms está correto
- Confirme que o formulário aceita respostas
- Teste o link do formulário separadamente

## 📞 Suporte

- [Documentação GitHub Pages](https://docs.github.com/pages)
- [Ajuda Google Drive](https://support.google.com/drive)
- [Ajuda Google Forms](https://support.google.com/forms)

---

**Boa sorte com seu Portal do Tutor! 🎓**


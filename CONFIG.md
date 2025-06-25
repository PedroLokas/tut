# Configuração do Portal do Tutor

Use este arquivo como guia para configurar seu portal.

## 📝 Template de Configuração

### Google Drive - IDs dos Arquivos

Para cada arquivo no Google Drive, você precisará do ID. Exemplo:

```
URL original: https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view
ID do arquivo: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

### Template para data.js

```javascript
const disciplines = [
    {
        id: 1,
        name: "NOME_DA_DISCIPLINA",
        description: "DESCRIÇÃO_DA_DISCIPLINA",
        contents: [
            {
                id: 1,
                title: "TÍTULO_DO_MATERIAL",
                description: "DESCRIÇÃO_DO_MATERIAL",
                type: "pdf", // pdf, video, slides, document
                fileId: "ID_DO_GOOGLE_DRIVE",
                downloadUrl: "https://drive.google.com/uc?export=download&id=ID_DO_GOOGLE_DRIVE",
                previewUrl: "https://drive.google.com/file/d/ID_DO_GOOGLE_DRIVE/preview"
            }
        ]
    }
];

const googleFormsConfig = {
    submitFormUrl: "LINK_DO_GOOGLE_FORMS_AQUI"
};
```

## 🔗 Links Importantes

- **Google Drive**: https://drive.google.com
- **Google Forms**: https://forms.google.com
- **GitHub**: https://github.com
- **GitHub Pages**: https://pages.github.com

## 📋 Checklist de Configuração

### Antes do Deploy:

- [ ] Materiais organizados no Google Drive
- [ ] Permissões dos arquivos configuradas como públicas
- [ ] IDs dos arquivos coletados
- [ ] Google Forms criado e configurado
- [ ] Link do formulário copiado
- [ ] Arquivo data.js atualizado com seus dados
- [ ] Site testado localmente

### Durante o Deploy:

- [ ] Repositório GitHub criado
- [ ] Arquivos enviados para o repositório
- [ ] GitHub Pages ativado
- [ ] Site acessível no link fornecido

### Após o Deploy:

- [ ] Todos os links de download funcionando
- [ ] Formulário de envio funcionando
- [ ] Site responsivo em mobile
- [ ] Navegação entre páginas funcionando

## 🎯 Exemplo Prático

### Disciplina: Física 1

```javascript
{
    id: 1,
    name: "Física 1",
    description: "Introdução aos conceitos fundamentais da física",
    contents: [
        {
            id: 1,
            title: "Aula 01 - Cinemática",
            description: "Conceitos básicos de movimento",
            type: "pdf",
            fileId: "1ABC123DEF456GHI789JKL",
            downloadUrl: "https://drive.google.com/uc?export=download&id=1ABC123DEF456GHI789JKL",
            previewUrl: "https://drive.google.com/file/d/1ABC123DEF456GHI789JKL/preview"
        }
    ]
}
```

## 🚀 Próximos Passos

1. **Configure seus materiais** seguindo o template acima
2. **Teste localmente** abrindo o index.html no navegador
3. **Faça o deploy** seguindo o guia DEPLOY.md
4. **Compartilhe o link** com seus alunos

---

**Dica**: Mantenha uma planilha com os IDs dos seus arquivos para facilitar futuras atualizações!

